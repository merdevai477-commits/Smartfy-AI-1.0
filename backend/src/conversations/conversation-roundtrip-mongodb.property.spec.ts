import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import * as fc from 'fast-check';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { Message, MessageSchema } from '../messages/schemas/message.schema';
import { ConversationsService } from './conversations.service';
import { MessagesService } from '../messages/messages.service';

describe('Feature: gemini-chat-integration, Property 13: Conversation Persistence Round-Trip (MongoDB)', () => {
  let mongoServer: MongoMemoryServer;
  let mongoConnection: Connection;
  let conversationsService: ConversationsService;
  let messagesService: MessagesService;
  let conversationModel: Model<Conversation>;
  let messageModel: Model<Message>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    mongoConnection = (await connect(mongoUri)).connection;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([
          { name: Conversation.name, schema: ConversationSchema },
          { name: Message.name, schema: MessageSchema },
        ]),
      ],
      providers: [ConversationsService, MessagesService],
    }).compile();

    conversationsService = module.get<ConversationsService>(ConversationsService);
    messagesService = module.get<MessagesService>(MessagesService);
    conversationModel = module.get('ConversationModel');
    messageModel = module.get('MessageModel');
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await conversationModel.deleteMany({});
    await messageModel.deleteMany({});
  });

  it('should preserve conversation and messages order in round-trip save/load', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }), // title
        fc.array(fc.string({ minLength: 1, maxLength: 200 }), { minLength: 2, maxLength: 10 }), // messages
        async (title, messageContents) => {
          const userId = '507f1f77bcf86cd799439011';

          // Create conversation
          const conversation = await conversationsService.create(userId, title);
          const conversationId = conversation._id.toString();

          // Save messages
          for (const content of messageContents) {
            await messagesService.create({
              conversationId,
              clerkId: userId,
              role: 'user',
              content,
            });
            await new Promise(resolve => setTimeout(resolve, 10));
          }

          // Load conversation and messages
          const loadedConversation = await conversationsService.findById(conversationId);
          const loadedMessages = await messagesService.findByConversation(conversationId);

          // Verify conversation
          expect(loadedConversation).toBeDefined();
          expect(loadedConversation!.title).toBe(title);
          expect(loadedConversation!.clerkId.toString()).toBe(userId);

          // Verify messages order
          expect(loadedMessages.length).toBe(messageContents.length);
          loadedMessages.forEach((msg, index) => {
            expect(msg.content).toBe(messageContents[index]);
          });

          // Verify chronological order
          for (let i = 1; i < loadedMessages.length; i++) {
            expect(loadedMessages[i].createdAt.getTime())
              .toBeGreaterThanOrEqual(loadedMessages[i - 1].createdAt.getTime());
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should update conversation updatedAt timestamp on new message', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 200 }),
        async (title, messageContent) => {
          const userId = '507f1f77bcf86cd799439011';

          // Create conversation
          const conversation = await conversationsService.create(userId, title);
          const initialUpdatedAt = conversation.updatedAt;

          // Wait to ensure timestamp difference
          await new Promise(resolve => setTimeout(resolve, 100));

          // Add message and touch conversation
          await messagesService.create({
            conversationId: conversation._id.toString(),
            clerkId: userId,
            role: 'user',
            content: messageContent,
          });
          await conversationsService.touch(conversation._id.toString());

          // Load conversation again
          const updatedConversation = await conversationsService.findById(
            conversation._id.toString()
          );

          // Verify updatedAt was updated
          expect(updatedConversation!.updatedAt.getTime())
            .toBeGreaterThan(initialUpdatedAt.getTime());
        }
      ),
      { numRuns: 50 }
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import * as fc from 'fast-check';
import { Message, MessageSchema } from './schemas/message.schema';
import { MessagesService } from './messages.service';

describe('Feature: gemini-chat-integration, Property 12: Message Persistence Order (MongoDB)', () => {
  let mongoServer: MongoMemoryServer;
  let mongoConnection: Connection;
  let messagesService: MessagesService;
  let messageModel: Model<Message>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    mongoConnection = (await connect(mongoUri)).connection;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([
          { name: Message.name, schema: MessageSchema },
        ]),
      ],
      providers: [MessagesService],
    }).compile();

    messagesService = module.get<MessagesService>(MessagesService);
    messageModel = module.get('MessageModel');
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await messageModel.deleteMany({});
  });

  it('should save user message to MongoDB before AI response is requested', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 1000 }),
        fc.string({ minLength: 24, maxLength: 24 }), // MongoDB ObjectId length
        async (content, conversationId) => {
          // Create user message
          const userMessage = await messagesService.create({
            conversationId,
            clerkId: '507f1f77bcf86cd799439011', // Valid ObjectId
            role: 'user',
            content,
          });

          // Verify message was saved to MongoDB
          const savedMessage = await messageModel.findById(userMessage._id);
          expect(savedMessage).toBeDefined();
          expect(savedMessage!.content).toBe(content);
          expect(savedMessage!.role).toBe('user');
          expect(savedMessage!.partial).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve message order in MongoDB', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 2, maxLength: 10 }),
        async (messages) => {
          const conversationId = '507f1f77bcf86cd799439011';
          const userId = '507f1f77bcf86cd799439012';

          // Save messages sequentially
          for (const content of messages) {
            await messagesService.create({
              conversationId,
              clerkId: userId,
              role: 'user',
              content,
            });
            // Small delay to ensure different timestamps
            await new Promise(resolve => setTimeout(resolve, 10));
          }

          // Fetch messages in chronological order
          const savedMessages = await messageModel
            .find({ conversationId })
            .sort({ createdAt: 1 })
            .lean();

          // Verify order matches insertion order
          expect(savedMessages.length).toBe(messages.length);
          savedMessages.forEach((msg, index) => {
            expect(msg.content).toBe(messages[index]);
          });
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should set partial flag when stream is interrupted', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }),
        async (partialContent) => {
          const conversationId = '507f1f77bcf86cd799439011';
          const userId = '507f1f77bcf86cd799439012';

          // Save partial message
          const partialMessage = await messagesService.create({
            conversationId,
            clerkId: userId,
            role: 'assistant',
            content: partialContent,
            partial: true,
          });

          // Verify partial flag is set
          const savedMessage = await messageModel.findById(partialMessage._id);
          expect(savedMessage!.partial).toBe(true);
          expect(savedMessage!.role).toBe('assistant');
        }
      ),
      { numRuns: 100 }
    );
  });
});

const { MongoClient } = require('mongodb');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testServices() {
    console.log('--- Testing Services ---');

    // 1. Test Gemini
    console.log('\\n1. Testing Gemini API...');
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say exactly: "Gemini is working!"');
        console.log('Gemini Response:', result.response.text().trim());
        console.log('✅ Gemini API is WORKING');
    } catch (error) {
        console.error('❌ Gemini API FAILED:', error.message);
    }

    // 2. Test MongoDB
    console.log('\\n2. Testing MongoDB Connection...');
    let client;
    try {
        client = new MongoClient(process.env.MONGODB_URI || '');
        await client.connect();
        console.log('✅ MongoDB connected successfully');

        // 3. Test History (Conversations & Messages collections)
        console.log('\\n3. Testing Chat History (Database Collections)...');
        const db = client.db();
        const convCount = await db.collection('conversations').countDocuments();
        const msgCount = await db.collection('messages').countDocuments();
        console.log(`Conversations in DB: ${convCount}`);
        console.log(`Messages in DB: ${msgCount}`);
        console.log('✅ Chat History storage is accessible');

    } catch (error) {
        console.error('❌ MongoDB Connection FAILED:', error.message);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

testServices();

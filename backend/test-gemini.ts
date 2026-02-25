import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

async function testGeminiModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const modelsToTest = ['gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];

    for (const modelName of modelsToTest) {
        console.log(`\nTesting model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say "Hello"');
            console.log(`✅ Success with ${modelName}:`, result.response.text().trim());
        } catch (error: any) {
            console.error(`❌ Failed with ${modelName}:`, error.message);
        }
    }
}

testGeminiModels();

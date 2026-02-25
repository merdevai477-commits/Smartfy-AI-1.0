import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    console.log('Fetching available models with API key starting with:', apiKey.substring(0, 10));

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach((m: any) => {
                console.log(`- ${m.name}`);
            });
        } else {
            console.error('Unexpected response:', data);
        }
    } catch (error: any) {
        console.error('Fetch failed:', error.message);
    }
}

listModels();

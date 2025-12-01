const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateContent = async (req, res) => {
    try {
        const { businessContext } = req.body;
        if (!businessContext) {
            return res.status(400).json({ message: "Business context is required." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a social media expert for small businesses. A user has provided their business context. Generate a short, engaging, and creative social media post (around 2-3 lines) for them. Add 2-3 relevant hashtags. The post should not sound too robotic. Business context: "${businessContext}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        res.status(200).json({ generatedPost: text });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Failed to generate content from AI." });
    }
};

const generateImagePost = async (req, res) => {
    try {
        const { theme } = req.body;
        if (!theme) {
            return res.status(400).json({ message: "An image theme is required." });
        }

        // 🔥 Replace gemini-pro → gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are a creative director. Based on the theme "${theme}", generate two things in a JSON format: 1. A short, catchy social media 'caption'. 2. A descriptive 'image_prompt' for an AI image generator to create a visually appealing image. Example output: {"caption": "Your text here", "image_prompt": "Your description here"}. IMPORTANT: Only output the raw JSON object, without any extra text or markdown.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = await response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI did not return a valid JSON object.");
        }
        
        const jsonString = jsonMatch[0];
        const jsonResponse = JSON.parse(jsonString);

        res.status(200).json(jsonResponse);

    } catch (error) {
        console.error("Error generating image post:", error);
        res.status(500).json({ message: "Failed to generate image post from AI." });
    }
};

const generateActualImage = async (req, res) => {
    try {
        const { image_prompt } = req.body;
        if (!image_prompt) {
            return res.status(400).json({ message: "An image prompt is required." });
        }
        
        const API_KEY = process.env.GEMINI_API_KEY;
        const MODEL_ID = "imagen-3.0-generate-002"; 
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:predict?key=${API_KEY}`;

        const payload = {
            instances: [{ prompt: image_prompt }],
            parameters: { "sampleCount": 1 }
        };
        
        const response = await axios.post(url, payload);
        const result = response.data;

        if (result.predictions && result.predictions[0].bytesBase64Encoded) {
            res.status(200).json({ imageBase64: result.predictions[0].bytesBase64Encoded });
        } else {
            console.error("Imagen API Response:", result);
            throw new Error("Image generation failed. No prediction found in API response.");
        }

    } catch (error) {
        console.error("Error generating actual image:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Failed to generate image from AI." });
    }
};

module.exports = { generateContent, generateImagePost, generateActualImage };

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- FUNCTION 1: GENERATE TEXT POST ---
const generateContent = async (req, res) => {
    try {
        const { businessContext } = req.body;
        if (!businessContext) { return res.status(400).json({ message: "Business context is required." }); }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a social media expert for small businesses. Generate a short, engaging, creative social media post (around 2-3 lines) with 2-3 relevant hashtags. Do not sound robotic." },
                { role: "user", content: `My business context is: "${businessContext}"` }
            ],
        });

        const text = completion.choices[0].message.content;
        res.status(200).json({ generatedPost: text });

    } catch (error) {
        console.error("Error generating content from OpenAI:", error);
        res.status(500).json({ message: "Failed to generate content from AI." });
    }
};

// --- FUNCTION 2: GENERATE IMAGE IDEA (CAPTION + PROMPT) ---
const generateImagePost = async (req, res) => {
    try {
        const { theme } = req.body;
        if (!theme) { return res.status(400).json({ message: "An image theme is required." }); }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "You are a creative director. Generate a JSON object with two keys: 'caption' (a short, catchy social media caption) and 'image_prompt' (a descriptive prompt for an AI image generator). Only output the raw JSON." },
                { role: "user", content: `The theme is: "${theme}"` }
            ],
        });
        
        const jsonResponse = JSON.parse(completion.choices[0].message.content);
        res.status(200).json(jsonResponse);

    } catch (error) {
        console.error("Error generating image post from OpenAI:", error);
        res.status(500).json({ message: "Failed to generate image post from AI." });
    }
};

// --- FUNCTION 3: GENERATE ACTUAL IMAGE ---
const generateActualImage = async (req, res) => {
    try {
        const { image_prompt } = req.body;
        if (!image_prompt) { return res.status(400).json({ message: "An image prompt is required." }); }

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: image_prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
        });

        const imageBase64 = response.data[0].b64_json;
        res.status(200).json({ imageBase64: imageBase64 });

    } catch (error) {
        console.error("Error generating actual image from DALL-E:", error);
        res.status(500).json({ message: "Failed to generate image from AI." });
    }
};

module.exports = { generateContent, generateImagePost, generateActualImage };
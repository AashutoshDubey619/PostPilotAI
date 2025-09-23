const { GoogleGenerativeAI } = require("@google/generative-ai");

// .env file se API key ko access karna
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateContent = async (req, res) => {
    try {
        // Frontend se user ka business context lena
        const { businessContext } = req.body;

        if (!businessContext) {
            return res.status(400).json({ message: "Business context is required." });
        }

        // AI model ko select karna
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // AI ko prompt dena
        const prompt = `You are a social media expert for small businesses. A user has provided their business context. Generate a short, engaging, and creative social media post (around 2-3 lines) for them. Add 2-3 relevant hashtags. The post should not sound too robotic or obviously AI-generated. Business context: "${businessContext}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Generate kiye gaye text ko wapas frontend ko bhejna
        res.status(200).json({ generatedPost: text });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Failed to generate content from AI." });
    }
};

module.exports = { generateContent };

const { TwitterApi } = require('twitter-api-v2');
const SocialAccount = require('../models/SocialAccount');
const Post = require('../models/Post');

// --- FUNCTION 1: POST NOW (No changes here) ---
const postToTwitter = async (req, res) => {
    const userId = req.user._id;
    const { content } = req.body;
    if (!content) { return res.status(400).json({ message: "Post content is required." }); }
    try {
        const twitterAccount = await SocialAccount.findOne({ userId, platform: 'twitter' });
        if (!twitterAccount) { return res.status(404).json({ message: "Twitter account not connected." }); }
        let userClient = new TwitterApi(twitterAccount.accessToken);
        try {
            await userClient.v2.tweet(content);
        } catch (e) {
            if (e.code === 401) {
                const refreshingClient = new TwitterApi({ clientId: process.env.TWITTER_CLIENT_ID, clientSecret: process.env.TWITTER_CLIENT_SECRET });
                const { client: refreshedClient, accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshingClient.refreshOAuth2Token(twitterAccount.refreshToken);
                twitterAccount.accessToken = newAccessToken;
                twitterAccount.refreshToken = newRefreshToken;
                await twitterAccount.save();
                await refreshedClient.v2.tweet(content);
            } else { throw e; }
        }
        res.status(200).json({ message: "Tweet posted successfully!" });
    } catch (error) {
        console.error("Error posting to Twitter:", error);
        res.status(500).json({ message: "Failed to post tweet." });
    }
};

// --- FUNCTION 2: SCHEDULE POST (No changes here) ---
const schedulePost = async (req, res) => {
    const userId = req.user._id;
    const { content, scheduledAt, platform } = req.body;
    if (!content || !scheduledAt || !platform) { return res.status(400).json({ message: "Content, platform, and schedule time are required." }); }
    try {
        const newPost = await Post.create({ userId, platform, content, status: 'scheduled', scheduledAt: new Date(scheduledAt) });
        res.status(201).json({ message: "Post scheduled successfully!", post: newPost });
    } catch (error) {
        console.error("Error scheduling post:", error);
        res.status(500).json({ message: "Failed to schedule post." });
    }
};

// --- FUNCTION 3: GET ALL POSTS FOR CALENDAR (Yeh naya hai) ---
const getPosts = async (req, res) => {
    const userId = req.user._id;
    try {
        // Logged-in user ke saare posts ko database se dhoondho
        const posts = await Post.find({ userId: userId });
        // Saare posts ko wapas frontend ko bhej do
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts." });
    }
};

// Teeno functions ko export karna
module.exports = { postToTwitter, schedulePost, getPosts };

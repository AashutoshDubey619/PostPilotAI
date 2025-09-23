const { TwitterApi } = require('twitter-api-v2');
const SocialAccount = require('../models/SocialAccount');
const Post = require('../models/Post'); // Naya Post model import kiya

// --- FUNCTION 1: POST NOW ---
// Yeh function abhi waisa hi hai jaisa pehle tha
const postToTwitter = async (req, res) => {
    const userId = req.user._id;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: "Post content is required." });
    }

    try {
        const twitterAccount = await SocialAccount.findOne({ userId, platform: 'twitter' });

        if (!twitterAccount) {
            return res.status(404).json({ message: "Twitter account not connected." });
        }

        let userClient = new TwitterApi(twitterAccount.accessToken);

        try {
            await userClient.v2.tweet(content);
        } catch (e) {
            if (e.code === 401) {
                console.log("Access token expired. Refreshing token...");
                const refreshingClient = new TwitterApi({
                    clientId: process.env.TWITTER_CLIENT_ID,
                    clientSecret: process.env.TWITTER_CLIENT_SECRET,
                });

                const {
                    client: refreshedClient,
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                } = await refreshingClient.refreshOAuth2Token(twitterAccount.refreshToken);

                twitterAccount.accessToken = newAccessToken;
                twitterAccount.refreshToken = newRefreshToken;
                await twitterAccount.save();

                console.log("Token refreshed successfully. Retrying post...");
                await refreshedClient.v2.tweet(content);
            } else {
                throw e;
            }
        }

        res.status(200).json({ message: "Tweet posted successfully!" });

    } catch (error) {
        console.error("Error posting to Twitter:", error);
        res.status(500).json({ message: "Failed to post tweet." });
    }
};

// --- FUNCTION 2: SCHEDULE POST ---
// Yeh naya function hai jo post ko database me save karega
const schedulePost = async (req, res) => {
    const userId = req.user._id;
    // Frontend se content ke saath-saath scheduledAt aur platform bhi aayega
    const { content, scheduledAt, platform } = req.body;

    if (!content || !scheduledAt || !platform) {
        return res.status(400).json({ message: "Content, platform, and schedule time are required." });
    }

    try {
        // Post ko database me 'scheduled' status ke saath save karna
        const newPost = await Post.create({
            userId,
            platform,
            content,
            status: 'scheduled',
            scheduledAt: new Date(scheduledAt), // Date string ko Date object me convert karna
        });

        res.status(201).json({ message: "Post scheduled successfully!", post: newPost });

    } catch (error) {
        console.error("Error scheduling post:", error);
        res.status(500).json({ message: "Failed to schedule post." });
    }
};

// Dono functions ko export karna
module.exports = { postToTwitter, schedulePost };
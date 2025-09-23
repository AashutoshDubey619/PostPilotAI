const cron = require('node-cron');
const Post = require('../models/Post');
const SocialAccount = require('../models/SocialAccount');
const { TwitterApi } = require('twitter-api-v2');

// Yeh function scheduled post ko Twitter par bhejega
const processScheduledPost = async (post) => {
    console.log(`Processing post ID: ${post._id} for user ID: ${post.userId}`);
    try {
        const twitterAccount = await SocialAccount.findOne({ userId: post.userId, platform: 'twitter' });

        if (!twitterAccount) {
            throw new Error('Twitter account not found for user.');
        }

        // Token refresh logic bilkul waisi hi hai jaisi postController me thi
        let userClient = new TwitterApi(twitterAccount.accessToken);
        try {
            await userClient.v2.tweet(post.content);
        } catch (e) {
            if (e.code === 401) { // Token expired
                console.log(`Token expired for post ${post._id}. Refreshing...`);
                const refreshingClient = new TwitterApi({
                    clientId: process.env.TWITTER_CLIENT_ID,
                    clientSecret: process.env.TWITTER_CLIENT_SECRET,
                });

                const { client: refreshedClient, accessToken, refreshToken } = await refreshingClient.refreshOAuth2Token(twitterAccount.refreshToken);
                
                twitterAccount.accessToken = accessToken;
                twitterAccount.refreshToken = refreshToken;
                await twitterAccount.save();
                
                console.log('Token refreshed. Retrying post...');
                await refreshedClient.v2.tweet(post.content);
            } else {
                throw e;
            }
        }
        
        // Post successful hua, to status update karo
        post.status = 'posted';
        post.postedAt = new Date();
        await post.save();
        console.log(`Post ID: ${post._id} successfully posted to Twitter.`);

    } catch (error) {
        console.error(`Failed to process post ID: ${post._id}. Error:`, error.message);
        // Post fail hua, to status update karo
        post.status = 'failed';
        await post.save();
    }
};

// Yeh hamara main robot hai
const startScheduler = () => {
    // '* * * * *' ka matlab hai "har minute"
    console.log('Scheduler started. Checking for due posts every minute.');
    cron.schedule('* * * * *', async () => {
        console.log('Running cron job to check for scheduled posts...');
        
        const now = new Date();
        // Database me un saare posts ko dhoondho jinka status 'scheduled' hai
        // aur jinka post karne ka time abhi ya pehle ka hai
        const duePosts = await Post.find({
            status: 'scheduled',
            scheduledAt: { $lte: now }
        });

        if (duePosts.length > 0) {
            console.log(`Found ${duePosts.length} posts to process.`);
            // Har post ko ek-ek karke process karo
            for (const post of duePosts) {
                await processScheduledPost(post);
            }
        } else {
            console.log('No posts due for posting at this time.');
        }
    });
};

module.exports = { startScheduler };
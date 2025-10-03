const cron = require('node-cron');
const Post = require('../models/Post');
const SocialAccount = require('../models/SocialAccount');
const { TwitterApi } = require('twitter-api-v2');

const processScheduledPost = async (post) => {
    console.log(`Processing post ID: ${post._id} for user ID: ${post.userId}`);
    try {
        const twitterAccount = await SocialAccount.findOne({ userId: post.userId, platform: 'twitter' });

        if (!twitterAccount) {
            throw new Error('Twitter account not found for user.');
        }

        let userClient = new TwitterApi(twitterAccount.accessToken);
        try {
            console.log(`Attempting to post tweet for post ID: ${post._id}`);
            await userClient.v2.tweet(post.content);
            console.log(`Tweet posted successfully for post ID: ${post._id}`);
        } catch (e) {
            console.error(`Error posting tweet for post ID: ${post._id}:`, e);
            if (e.code === 401) {
                console.log(`Token expired for post ${post._id}. Refreshing...`);
                const refreshingClient = new TwitterApi({
                    clientId: process.env.TWITTER_CLIENT_ID,
                    clientSecret: process.env.TWITTER_CLIENT_SECRET,
                });

                try {
                    const { client: refreshedClient, accessToken, refreshToken } = await refreshingClient.refreshOAuth2Token(twitterAccount.refreshToken);
                    
                    twitterAccount.accessToken = accessToken;
                    twitterAccount.refreshToken = refreshToken;
                    await twitterAccount.save();
                    
                    console.log('Token refreshed. Retrying post...');
                    await refreshedClient.v2.tweet(post.content);
                    console.log(`Tweet posted successfully after token refresh for post ID: ${post._id}`);
                } catch (refreshError) {
                    console.error(`Failed to refresh token or post tweet for post ID: ${post._id}:`, refreshError);
                    throw refreshError;
                }
            } else {
                throw e;
            }
        }
        

        post.status = 'posted';
        post.postedAt = new Date();
        await post.save();
        console.log(`Post ID: ${post._id} successfully posted to Twitter.`);

    } catch (error) {
        console.error(`Failed to process post ID: ${post._id}. Error:`, error.message);
        post.status = 'failed';
        await post.save();
    }
};

const startScheduler = () => {
    console.log('Scheduler started. Checking for due posts every minute.');
    cron.schedule('* * * * *', async () => {
        console.log('Running cron job to check for scheduled posts...');
        
        const now = new Date();
        const duePosts = await Post.find({
            status: 'scheduled',
            scheduledAt: { $lte: now }
        });

        if (duePosts.length > 0) {
            console.log(`Found ${duePosts.length} posts to process.`);
            for (const post of duePosts) {
                await processScheduledPost(post);
            }
        } else {
            console.log('No posts due for posting at this time.');
        }
    });
};

module.exports = { startScheduler };
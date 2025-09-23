const { TwitterApi } = require('twitter-api-v2');
const SocialAccount = require('../models/SocialAccount');

const twitterClient = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
});

const CALLBACK_URL = 'http://localhost:5001/api/connect/twitter/callback';
const authStore = {};

exports.generateAuthLink = (req, res) => {
    // --- YEH HISSA IMPORTANT HAI ---
    // DUMMY_USER_ID ki jagah, ab hum asli user ki ID nikalenge
    // jo 'protect' middleware ne req.user me daali thi.
    const loggedInUserId = req.user._id; 

    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
        CALLBACK_URL,
        {
            state: loggedInUserId.toString(), // ID ko string me convert karna zaroori hai
            scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
        }
    );

    authStore[loggedInUserId] = { codeVerifier, state };

    res.redirect(url);
};

// handleCallback function me koi change nahi hai
exports.handleCallback = async (req, res) => {
    const { state, code } = req.query;
    const loggedInUserId = state;

    if (!state || !code || !authStore[loggedInUserId]) {
        return res.redirect('http://localhost:5173/dashboard?error=invalid-request');
    }

    const { codeVerifier } = authStore[loggedInUserId];

    try {
        const { client: loggedClient, accessToken, refreshToken } = await twitterClient.loginWithOAuth2({
            code,
            codeVerifier,
            redirectUri: CALLBACK_URL,
        });

        const { data: userObject } = await loggedClient.v2.me();

        const existingAccount = await SocialAccount.findOne({ platform: 'twitter', platformUserId: userObject.id });
        if (existingAccount) {
            return res.redirect('http://localhost:5173/dashboard?error=account-already-connected');
        }

        await SocialAccount.create({
            userId: loggedInUserId,
            platform: 'twitter',
            platformUserId: userObject.id,
            username: userObject.username,
            accessToken,
            refreshToken,
        });

        delete authStore[loggedInUserId];

        res.redirect('http://localhost:5173/dashboard?success=twitter-connected');
    } catch (e) {
        console.error("Error connecting Twitter account:", e);
        res.redirect('http://localhost:5173/dashboard?error=twitter-auth-failed');
    }
};

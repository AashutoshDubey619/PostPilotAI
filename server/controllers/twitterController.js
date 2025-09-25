const { TwitterApi } = require('twitter-api-v2');
const SocialAccount = require('../models/SocialAccount');

const twitterClient = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
});

const CALLBACK_URL = 'https://postpilotai-t0xt.onrender.com/api/connect/twitter/callback';
const FRONTEND_URL = 'https://post-pilot-hycgzdlut-aashutosh-dubeys-projects.vercel.app';

const authStore = {};

exports.generateAuthLink = (req, res) => {
    const loggedInUserId = req.user._id; 
    const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
        CALLBACK_URL,
        {
            state: loggedInUserId.toString(),
            scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
        }
    );
    authStore[loggedInUserId] = { codeVerifier, state };
    res.redirect(url);
};

exports.handleCallback = async (req, res) => {
    const { state, code } = req.query;
    const loggedInUserId = state;

    if (!state || !code || !authStore[loggedInUserId]) {
        return res.redirect(`${FRONTEND_URL}/dashboard?error=invalid-request`);
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
            // Update tokens if account already exists
            existingAccount.accessToken = accessToken;
            existingAccount.refreshToken = refreshToken;
            await existingAccount.save();
            delete authStore[loggedInUserId];
            return res.redirect(`${FRONTEND_URL}/dashboard?success=twitter-connected`);
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

        // Yahan URL ko update kiya
        res.redirect(`${FRONTEND_URL}/dashboard?success=twitter-connected`);

    } catch (e) {
        console.error("Error connecting Twitter account:", e);
        // Yahan URL ko update kiya
        res.redirect(`${FRONTEND_URL}/dashboard?error=twitter-auth-failed`);
    }
};

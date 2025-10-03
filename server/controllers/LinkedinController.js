const axios = require('axios');
const SocialAccount = require('../models/SocialAccount');

const CALLBACK_URL = 'https://postpilotai-t0xt.onrender.com/api/connect/linkedin/callback';
const FRONTEND_URL = 'https://post-pilot-hycgzdlut-aashutosh-dubeys-projects.vercel.app';

exports.generateAuthLink = (req, res) => {
    const loggedInUserId = req.user._id;

    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&state=${loggedInUserId.toString()}&scope=profile%20openid%20w_member_social`;
    
    res.redirect(linkedInAuthUrl);
};

exports.handleCallback = async (req, res) => {
    const { code, state: loggedInUserId } = req.query;

    if (!code) {
        return res.redirect(`${FRONTEND_URL}/dashboard?error=linkedin-auth-failed`);
    }

    try {
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: CALLBACK_URL,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        
        const { sub: platformUserId, name: username } = profileResponse.data;

        const existingAccount = await SocialAccount.findOne({ platform: 'linkedin', platformUserId });
        if (existingAccount) {
            return res.redirect(`${FRONTEND_URL}/dashboard?error=linkedin-account-already-connected`);
        }

        await SocialAccount.create({
            userId: loggedInUserId,
            platform: 'linkedin',
            platformUserId,
            username,
            accessToken,
        });

        res.redirect(`${FRONTEND_URL}/dashboard?success=linkedin-connected`);

    } catch (error) {
        console.error("Error connecting LinkedIn account:", error.response ? error.response.data : error.message);
        res.redirect(`${FRONTEND_URL}/dashboard?error=linkedin-auth-failed`);
    }
};

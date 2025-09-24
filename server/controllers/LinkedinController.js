const axios = require('axios');
const SocialAccount = require('../models/SocialAccount');

// Naya live backend URL
const CALLBACK_URL = 'https://postpilotai-t0xt.onrender.com/api/connect/linkedin/callback';
// Naya live frontend URL
const FRONTEND_URL = 'https://post-pilot-hycgzdlut-aashutosh-dubeys-projects.vercel.app';

// Function 1: LinkedIn ke liye authentication link generate karna
exports.generateAuthLink = (req, res) => {
    const loggedInUserId = req.user._id;

    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&state=${loggedInUserId.toString()}&scope=profile%20openid%20w_member_social`;
    
    res.redirect(linkedInAuthUrl);
};

// Function 2: LinkedIn se wapas aane par callback ko handle karna
exports.handleCallback = async (req, res) => {
    const { code, state: loggedInUserId } = req.query;

    if (!code) {
        return res.redirect(`${FRONTEND_URL}/dashboard?error=linkedin-auth-failed`);
    }

    try {
        // Step 1: Code ke badle me Access Token lena
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

        // Step 2: Access Token ka istemal karke user ki profile details lena
        const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        
        const { sub: platformUserId, name: username } = profileResponse.data;

        // Check karein ki yeh account pehle se juda hai ya nahi
        const existingAccount = await SocialAccount.findOne({ platform: 'linkedin', platformUserId });
        if (existingAccount) {
            return res.redirect(`${FRONTEND_URL}/dashboard?error=linkedin-account-already-connected`);
        }

        // Naya social account banakar database me save karein
        await SocialAccount.create({
            userId: loggedInUserId,
            platform: 'linkedin',
            platformUserId,
            username,
            accessToken,
        });

        // Yahan URL ko update kiya
        res.redirect(`${FRONTEND_URL}/dashboard?success=linkedin-connected`);

    } catch (error) {
        console.error("Error connecting LinkedIn account:", error.response ? error.response.data : error.message);
        // Yahan URL ko update kiya
        res.redirect(`${FRONTEND_URL}/dashboard?error=linkedin-auth-failed`);
    }
};

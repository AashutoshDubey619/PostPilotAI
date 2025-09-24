import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Text Post states
    const [businessContext, setBusinessContext] = useState('');
    const [generatedTextPost, setGeneratedTextPost] = useState('');
    const [editableTextPost, setEditableTextPost] = useState('');
    const [textPostStatus, setTextPostStatus] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    
    // Image Post states
    const [imageTheme, setImageTheme] = useState('');
    const [generatedCaption, setGeneratedCaption] = useState('');
    const [editableCaption, setEditableCaption] = useState('');
    const [generatedImagePrompt, setGeneratedImagePrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState('');
    const [imagePostStatus, setImagePostStatus] = useState('');

    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUserInfo) {
            setUserInfo(storedUserInfo);
        } else {
            navigate('/login');
        }
        
        const queryParams = new URLSearchParams(location.search);
        const success = queryParams.get('success');
        const error = queryParams.get('error');
        if (success) {
            const platform = success.split('-')[0];
            setMessage(`${platform.charAt(0).toUpperCase() + platform.slice(1)} account successfully connected!`);
        } else if (error) {
            setMessage(`Failed to connect account. Error: ${error}`);
        }
    }, [location, navigate]);

    const handleConnect = (platform) => {
        if (userInfo && userInfo.token) {
            window.location.href = `http://localhost:5001/api/connect/${platform}?token=${userInfo.token}`;
        }
    };

    const handleGeneratePost = async () => {
        if (!businessContext) { alert("Please describe your business first."); return; }
        setIsLoading(true);
        setGeneratedTextPost('');
        setEditableTextPost('');
        setTextPostStatus('');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5001/api/ai/generate', { businessContext }, config);
            setGeneratedTextPost(data.generatedPost);
            setEditableTextPost(data.generatedPost);
        } catch (error) {
            setGeneratedTextPost("Sorry, we couldn't generate a post right now.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostToTwitter = async () => {
        if (!editableTextPost) { alert("Please generate a post first."); return; }
        setTextPostStatus('Posting...');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5001/api/post/twitter', { content: editableTextPost }, config);
            setTextPostStatus(data.message);
        } catch (error) {
            setTextPostStatus("Failed to post tweet. Please try again.");
        }
    };
    
    const handleSchedulePost = async () => {
        if (!editableTextPost || !scheduleTime) { alert("Please generate a post and select a schedule time."); return; }
        setTextPostStatus('Scheduling...');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5001/api/post/schedule', { content: editableTextPost, scheduledAt: scheduleTime, platform: 'twitter' }, config);
            setTextPostStatus(data.message);
        } catch (error) {
            setTextPostStatus("Failed to schedule post. Please try again.");
        }
    };

    const handleGenerateImagePost = async () => {
        if (!imageTheme) { alert("Please provide a theme for the image post."); return; }
        setIsLoading(true);
        setGeneratedCaption('');
        setEditableCaption('');
        setGeneratedImagePrompt('');
        setGeneratedImage('');
        setImagePostStatus('');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5001/api/ai/generate-image', { theme: imageTheme }, config);
            setGeneratedCaption(data.caption);
            setEditableCaption(data.caption);
            setGeneratedImagePrompt(data.image_prompt);
        } catch (error) {
            setGeneratedCaption("Sorry, we couldn't generate a caption right now.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateActualImage = async () => {
        if (!generatedImagePrompt) { alert("Please generate an image idea (prompt) first."); return; }
        setIsLoading(true);
        setGeneratedImage('');
        setImagePostStatus('');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5001/api/ai/generate-actual-image', { image_prompt: generatedImagePrompt }, config);
            setGeneratedImage(`data:image/png;base64,${data.imageBase64}`);
        } catch (error) {
            alert("Sorry, we couldn't generate the image right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostImageToTwitter = async () => {
        if (!generatedImage || !editableCaption) { alert("Please generate a caption and an image first."); return; }
        setImagePostStatus('Posting image...');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5001/api/post/twitter-image', { caption: editableCaption, imageBase64: generatedImage }, config);
            setImagePostStatus(data.message);
        } catch (error) {
            setImagePostStatus("Failed to post image.");
        }
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Welcome, {userInfo ? userInfo.name : 'Guest'}!</h1>
            <p>This is your dashboard. Let's create and post some amazing content.</p>

            {message && (<div style={{ padding: '15px', borderRadius: '8px', color: message.includes('successfully') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</div>)}

            {/* --- TEXT POST GENERATOR SECTION --- */}
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginTop: 0, color: '#333' }}>Generate a Text Post</h2>
                <h3 style={{ marginTop: '20px', color: '#333' }}>Step 1: Describe Your Business</h3>
                <textarea value={businessContext} onChange={(e) => setBusinessContext(e.target.value)} placeholder="e.g., I own a small, cozy coffee shop in Nagpur..." style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                
                <h3 style={{ marginTop: '20px', color: '#333' }}>Step 2: Generate a Post Idea</h3>
                <button onClick={handleGeneratePost} disabled={isLoading} style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                    {isLoading ? 'Generating...' : 'Generate Text Post'}
                </button>
                
                {generatedTextPost && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eef2f7', borderRadius: '8px' }}>
                        <h4>Generated Post (Click to edit):</h4>
                        <textarea 
                            value={editableTextPost} 
                            onChange={(e) => setEditableTextPost(e.target.value)}
                            style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                            <input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            <button onClick={handleSchedulePost} style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                                Schedule Post
                            </button>
                            <button onClick={handlePostToTwitter} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#1DA1F2', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                                Post Now
                            </button>
                        </div>
                        {textPostStatus && <p style={{ marginTop: '10px', fontWeight: 'bold', color: textPostStatus.includes('successfully') ? 'green' : 'red' }}>{textPostStatus}</p>}
                    </div>
                )}
            </div>

            {/* --- IMAGE POST GENERATOR SECTION --- */}
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginTop: 0, color: '#333' }}>Generate an Image Post</h2>
                <h3 style={{ marginTop: '20px', color: '#333' }}>Step 1: Describe a Theme or Topic</h3>
                <input type="text" value={imageTheme} onChange={(e) => setImageTheme(e.target.value)} placeholder="e.g., A programmer celebrating a successful project launch" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                
                <h3 style={{ marginTop: '20px', color: '#333' }}>Step 2: Generate Ideas</h3>
                <button onClick={handleGenerateImagePost} disabled={isLoading} style={{ padding: '12px 24px', backgroundColor: '#5a67d8', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                    {isLoading ? 'Generating Ideas...' : 'Generate Caption + Image Idea'}
                </button>
                
                {generatedCaption && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eef2f7', borderRadius: '8px' }}>
                        <h4>Generated Caption (Click to edit):</h4>
                        <textarea 
                            value={editableCaption} 
                            onChange={(e) => setEditableCaption(e.target.value)}
                            style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                        <h4 style={{marginTop: '15px'}}>Image Idea (Prompt for AI):</h4>
                        <p style={{ fontStyle: 'italic', color: '#555' }}>{generatedImagePrompt}</p>
                        <h3 style={{ marginTop: '20px', color: '#333' }}>Step 3: Create the Image</h3>
                        <button onClick={handleGenerateActualImage} disabled={isLoading} style={{ marginTop: '10px', padding: '12px 24px', backgroundColor: '#007bff', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                           {isLoading ? 'Creating Image...' : 'Generate Actual Image'}
                        </button>
                    </div>
                )}

                {generatedImage && (
                    <div style={{ marginTop: '20px' }}>
                        <h4>Your Generated Image:</h4>
                        <img src={generatedImage} alt="AI Generated Art" style={{ maxWidth: '512px', width: '100%', height: 'auto', borderRadius: '8px', marginTop: '10px' }} />
                        <div style={{marginTop: '20px'}}>
                            <button onClick={handlePostImageToTwitter} style={{ padding: '10px 20px', backgroundColor: '#1DA1F2', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                                Post Image + Caption to Twitter
                            </button>
                            {imagePostStatus && <p style={{ marginTop: '10px', fontWeight: 'bold', color: imagePostStatus.includes('successfully') ? 'green' : 'red' }}>{imagePostStatus}</p>}
                        </div>
                    </div>
                )}
            </div>

            {/* --- CONNECT ACCOUNTS SECTION --- */}
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginTop: 0, color: '#333' }}>Connect Your Accounts</h2>
                <div style={{display: 'flex', gap: '20px'}}>
                    <button onClick={() => handleConnect('twitter')} style={{ padding: '12px 24px', backgroundColor: '#1DA1F2', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                        Connect to Twitter
                    </button>
                    <button onClick={() => handleConnect('linkedin')} style={{ padding: '12px 24px', backgroundColor: '#0A66C2', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                        Connect to LinkedIn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
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

    const API_BASE_URL = 'https://postpilotai-t0xt.onrender.com';

    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUserInfo) { setUserInfo(storedUserInfo); } 
        else { navigate('/login'); }
        const queryParams = new URLSearchParams(location.search);
        const success = queryParams.get('success');
        const error = queryParams.get('error');
        if (success) { setMessage(`${success.split('-')[0].charAt(0).toUpperCase() + success.split('-')[0].slice(1)} account successfully connected!`); }
        else if (error) { setMessage(`Failed to connect account. Error: ${error}`); }
    }, [location, navigate]);

    const handleConnect = (platform) => { if (userInfo && userInfo.token) { window.location.href = `${API_BASE_URL}/api/connect/${platform}?token=${userInfo.token}`; } };

    const handleGeneratePost = async () => {
        if (!businessContext) { alert("Please describe your business first."); return; }
        setIsLoading(true); setGeneratedTextPost(''); setEditableTextPost(''); setTextPostStatus('');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(`${API_BASE_URL}/api/ai/generate`, { businessContext }, config);
            setGeneratedTextPost(data.generatedPost);
            setEditableTextPost(data.generatedPost);
        } catch { setGeneratedTextPost("Sorry, we couldn't generate a post right now."); }
        finally { setIsLoading(false); }
    };

    const handlePostToTwitter = async () => {
        if (!editableTextPost) { alert("Please generate a post first."); return; }
        setTextPostStatus('Posting...');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(`${API_BASE_URL}/api/post/twitter`, { content: editableTextPost }, config);
            setTextPostStatus(data.message);
        } catch { setTextPostStatus("Failed to post tweet. Please try again."); }
    };
    
    const handleSchedulePost = async () => {
        if (!editableTextPost || !scheduleTime) { alert("Please generate a post and select a schedule time."); return; }
        setTextPostStatus('Scheduling...');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(`${API_BASE_URL}/api/post/schedule`, { content: editableTextPost, scheduledAt: scheduleTime, platform: 'twitter' }, config);
            setTextPostStatus(data.message);
        } catch { setTextPostStatus("Failed to schedule post. Please try again."); }
    };

    const handleGenerateImagePost = async () => {
        if (!imageTheme) { alert("Please provide a theme for the image post."); return; }
        setIsLoading(true); setGeneratedCaption(''); setEditableCaption(''); setGeneratedImagePrompt(''); setGeneratedImage(''); setImagePostStatus('');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(`${API_BASE_URL}/api/ai/generate-image`, { theme: imageTheme }, config);
            setGeneratedCaption(data.caption);
            setEditableCaption(data.caption);
            setGeneratedImagePrompt(data.image_prompt);
        } catch { setGeneratedCaption("Sorry, we couldn't generate a caption right now."); }
        finally { setIsLoading(false); }
    };

    const handleGenerateActualImage = async () => {
        if (!generatedImagePrompt) { alert("Please generate an image idea (prompt) first."); return; }
        setIsLoading(true); setGeneratedImage(''); setImagePostStatus('');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(`${API_BASE_URL}/api/ai/generate-actual-image`, { image_prompt: generatedImagePrompt }, config);
            setGeneratedImage(`data:image/png;base64,${data.imageBase64}`);
        } catch { alert("Sorry, we couldn't generate the image right now. Please try again."); }
        finally { setIsLoading(false); }
    };
    
    const handlePostImageToTwitter = () => {
        if (!generatedImage || !editableCaption) { alert("Please generate a caption and an image first."); return; }
        setImagePostStatus('Posting image...');
        setTimeout(() => { setImagePostStatus("Image post simulated successfully!"); }, 2000);
    };
    
    const handlePostToLinkedIn = async () => {
        if (!editableTextPost) { alert("Please generate a post first."); return; }
        setTextPostStatus('Posting to LinkedIn...');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(`${API_BASE_URL}/api/post/linkedin`, { content: editableTextPost }, config);
            setTextPostStatus(data.message);
        } catch { setTextPostStatus("Failed to post on LinkedIn. Please try again."); }
    };

    return (
        <div className="dashboard-container">
            {/* --- LEFT (MAIN) COLUMN --- */}
            <main className="dashboard-main">
                <h1 style={{fontSize: '2.25rem', fontWeight: 'bold'}}>Dashboard</h1>
                <p style={{color: '#a0aec0', marginBottom: '2rem'}}>Welcome, {userInfo ? userInfo.name : 'Guest'}! Let's create some magic.</p>

                {message && (<div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: message.includes('successfully') ? 'rgba(56, 161, 105, 0.2)' : 'rgba(224, 78, 78, 0.2)', color: message.includes('successfully') ? '#38a169' : '#e53e3e', fontWeight: 'bold', marginBottom: '2rem' }}>{message}</div>)}

                {/* Text Post Card */}
                <div className="card">
                    <h2 className="card-title">Generate a Text Post</h2>
                    <h3 className="card-subtitle">1. Describe Your Business</h3>
                    <textarea value={businessContext} onChange={(e) => setBusinessContext(e.target.value)} placeholder="e.g., I own a small, cozy coffee shop in Nagpur..." className="textarea-input" />
                    
                    <h3 className="card-subtitle">2. Generate a Post Idea</h3>
                    <button onClick={handleGeneratePost} disabled={isLoading} className="btn btn-green">
                        {isLoading ? 'Generating...' : 'Generate Text Post'}
                    </button>
                    
                    {generatedTextPost && (
                        <div className="generated-post-container">
                            <h4>Generated Post (Click to edit):</h4>
                            <textarea value={editableTextPost} onChange={(e) => setEditableTextPost(e.target.value)} className="textarea-input" />
                            <div className="actions-container">
                                <input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="datetime-input" />
                                <button onClick={handleSchedulePost} className="btn btn-yellow">Schedule</button>
                                <button onClick={handlePostToTwitter} className="btn btn-blue">Post to Twitter</button>
                                <button onClick={handlePostToLinkedIn} style={{backgroundColor: '#0A66C2'}} className="btn">Post to LinkedIn</button>
                            </div>
                            {textPostStatus && <p style={{ marginTop: '1rem', fontWeight: 'bold', color: textPostStatus.includes('successfully') ? 'green' : 'red' }}>{textPostStatus}</p>}
                        </div>
                    )}
                </div>

                {/* Image Post Card */}
                <div className="card">
                   <h2 className="card-title">Generate an Image Post</h2>
                   <h3 className="card-subtitle">1. Describe a Theme or Topic</h3>
                   <input type="text" value={imageTheme} onChange={(e) => setImageTheme(e.target.value)} placeholder="e.g., A programmer celebrating a successful project launch" className="text-input" />
                   
                   <h3 className="card-subtitle">2. Generate Ideas</h3>
                   <button onClick={handleGenerateImagePost} disabled={isLoading} style={{backgroundColor: '#5a67d8'}} className="btn">
                       {isLoading ? 'Generating Ideas...' : 'Generate Caption + Image Idea'}
                   </button>
                   
                   {generatedCaption && (
                       <div className="generated-post-container">
                           <h4>Generated Caption (Click to edit):</h4>
                           <textarea value={editableCaption} onChange={(e) => setEditableCaption(e.target.value)} className="textarea-input" />
                           <h4 style={{marginTop: '15px'}}>Image Idea (Prompt for AI):</h4>
                           <p style={{ fontStyle: 'italic', color: '#a0aec0' }}>{generatedImagePrompt}</p>
                           <h3 className="card-subtitle">3. Create the Image</h3>
                           <button onClick={handleGenerateActualImage} disabled={isLoading} className="btn btn-blue">
                              {isLoading ? 'Creating Image...' : 'Generate Actual Image'}
                           </button>
                       </div>
                   )}

                   {generatedImage && (
                       <div style={{ marginTop: '1.5rem' }}>
                           <h4>Your Generated Image:</h4>
                           <img src={generatedImage} alt="AI Generated Art" style={{ maxWidth: '512px', width: '100%', height: 'auto', borderRadius: '0.5rem', marginTop: '1rem' }} />
                           <div className="actions-container">
                               <button onClick={handlePostImageToTwitter} className="btn btn-blue">Post Image + Caption to Twitter</button>
                               {imagePostStatus && <p style={{fontWeight: 'bold', color: imagePostStatus.includes('successfully') ? 'green' : 'red'}}>{imagePostStatus}</p>}
                           </div>
                       </div>
                   )}
                </div>
            </main>

            {/* --- RIGHT (SIDEBAR) COLUMN --- */}
            <aside className="dashboard-sidebar">
                <div className="card">
                    <h2 className="card-title">Connected Accounts</h2>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                         <button onClick={() => handleConnect('twitter')} className="btn btn-blue">Connect to Twitter</button>
                         <button onClick={() => handleConnect('linkedin')} style={{backgroundColor: '#0A66C2'}} className="btn">Connect to LinkedIn</button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Dashboard;
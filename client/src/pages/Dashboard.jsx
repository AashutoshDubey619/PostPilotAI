import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [businessContext, setBusinessContext] = useState('');
    const [generatedPost, setGeneratedPost] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [postStatus, setPostStatus] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');

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
        if (success) { setMessage('Twitter account successfully connected!'); }
        else if (error) { setMessage(`Failed to connect Twitter account. Error: ${error}`); }
    }, [location, navigate]);

    const handleConnectTwitter = () => {
        if (userInfo && userInfo.token) {
            window.location.href = `http://localhost:5001/api/connect/twitter?token=${userInfo.token}`;
        }
    };
    
    const handleGeneratePost = async () => {
        if (!businessContext) { alert("Please describe your business first."); return; }
        setIsLoading(true);
        setGeneratedPost('');
        setPostStatus('');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5001/api/ai/generate', { businessContext }, config);
            setGeneratedPost(data.generatedPost);
        } catch (error) {
            setGeneratedPost("Sorry, we couldn't generate a post right now.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePostToTwitter = async () => {
        if (!generatedPost) { alert("Please generate a post first."); return; }
        setPostStatus('Posting...');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5001/api/post/twitter', { content: generatedPost }, config);
            setPostStatus(data.message);
        } catch (error) {
            setPostStatus("Failed to post tweet. Please try again.");
        }
    };

    const handleSchedulePost = async () => {
        if (!generatedPost || !scheduleTime) { alert("Please generate a post and select a schedule time."); return; }
        setPostStatus('Scheduling...');
        try {
            const token = userInfo ? userInfo.token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5001/api/post/schedule', { content: generatedPost, scheduledAt: scheduleTime, platform: 'twitter' }, config);
            setPostStatus(data.message);
        } catch (error) {
            setPostStatus("Failed to schedule post. Please try again.");
        }
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Welcome, {userInfo ? userInfo.name : 'Guest'}!</h1>
            <p>This is your dashboard. Let's create and post some amazing content.</p>

            {message && (<div style={{ padding: '15px', borderRadius: '8px', color: message.includes('successfully') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</div>)}
            
            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Step 1: Describe Your Business</h3>
                <textarea value={businessContext} onChange={(e) => setBusinessContext(e.target.value)} placeholder="e.g., I own a small, cozy coffee shop in Nagpur..." style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                
                <h3 style={{ marginTop: '20px', color: '#333' }}>Step 2: Generate a Post Idea</h3>
                <button onClick={handleGeneratePost} disabled={isLoading} style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                    {isLoading ? 'Generating...' : 'Generate Post Idea'}
                </button>
                
                {generatedPost && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eef2f7', borderRadius: '8px', color : 'black'}}>
                        <h4>Generated Post:</h4>
                        <p style={{ whiteSpace: 'pre-wrap' , color : 'black'}}>{generatedPost}</p>
                        
                        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                            <input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            <button onClick={handleSchedulePost} style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                                Schedule Post
                            </button>
                            <button onClick={handlePostToTwitter} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#1DA1F2', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                                Post Now
                            </button>
                        </div>
                        {postStatus && <p style={{ marginTop: '10px', fontWeight: 'bold', color: postStatus.includes('successfully') ? 'green' : 'red' }}>{postStatus}</p>}
                    </div>
                )}
            </div>
            
            <div style={{ marginTop: '40px' }}>
                <h3>Connect Your Accounts</h3>
                <button onClick={handleConnectTwitter} style={{ padding: '12px 24px', backgroundColor: '#1DA1F2', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                    Connect to Twitter
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
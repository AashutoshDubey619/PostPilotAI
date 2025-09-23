import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Calendar ke liye moment.js ko setup karna
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // LocalStorage se token nikalna
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) {
                    navigate('/login');
                    return;
                }
                
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                
                // Backend se saare posts fetch karna
                const { data } = await axios.get('http://localhost:5001/api/post/all', config);

                // Posts ke data ko calendar ke format me badalna
                const formattedEvents = data.map(post => ({
                    title: post.content.substring(0, 30) + '...', // Post ka chhota sa hissa
                    start: new Date(post.scheduledAt),
                    end: new Date(post.scheduledAt), // Start aur end time same rakhenge
                    allDay: false,
                    resource: post, // Poora post object save kar rahe hain
                }));
                
                setEvents(formattedEvents);

            } catch (error) {
                console.error("Could not fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [navigate]);

    if (loading) {
        return <div>Loading calendar...</div>;
    }

    return (
        <div style={{ padding: '50px', height: '100vh', backgroundColor: '#f9f9f9' }}>
            <h1 style={{ color: '#333' }}>Content Calendar</h1>
            <p style={{ color: '#555' }}>Here's a view of your scheduled and posted content.</p>
            <div style={{ height: '80%' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                />
            </div>
        </div>
    );
};

export default CalendarPage;
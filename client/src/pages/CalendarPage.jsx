import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const API_BASE_URL = 'https://postpilotai-t0xt.onrender.com';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        // Corrected API endpoint to /api/post/all as per backend routes
        const response = await axios.get(`${API_BASE_URL}/api/post/all`, config);
const posts = response.data.map(post => ({
  title: post.content,
  // Convert UTC time to local time for correct display with timezone offset fix
  start: new Date(new Date(post.scheduledAt || post.createdAt).getTime() + new Date().getTimezoneOffset() * 60000),
  end: new Date(new Date(post.scheduledAt || post.createdAt).getTime() + new Date().getTimezoneOffset() * 60000),
}));
        setEvents(posts);
      } catch (error) {
        console.error('Failed to fetch posts for calendar:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="calendar-page-container">
      <h1>Content Calendar</h1>
      <p>Here's a view of your scheduled and posted content.</p>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        toolbar={true}
        popup={true}
        views={['month', 'week', 'day', 'agenda']}
      />
    </div>
  );
};

export default CalendarPage;

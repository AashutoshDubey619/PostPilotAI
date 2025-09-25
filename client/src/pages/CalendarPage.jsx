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
        const response = await axios.get(`${API_BASE_URL}/api/post/posts`, config);
        const posts = response.data.map(post => ({
          title: post.content,
          start: new Date(post.scheduledAt || post.createdAt),
          end: new Date(post.scheduledAt || post.createdAt),
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

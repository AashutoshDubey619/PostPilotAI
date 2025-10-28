# 🚀 PostPilot AI - Your Intelligent Social Media Co-Pilot  

An intelligent, full-stack social media management platform designed to **streamline your content creation workflow**.  
Built with the **MERN stack**, PostPilot AI empowers users to:  
- Connect their social media accounts  
- Generate creative **text and image content with AI**  
- **Schedule posts** for the future  
- Visualize their strategy on an **interactive calendar**  
**Context-Aware Generation**: Saves your key business context, eliminating the need to repeat instructions and ensuring long-term content consistency

---

## 🔴 Live Demo  
👉 [PostPilot AI Demo](https://post-pilot-ai-ten.vercel.app)  

> **Note:** The live AI features rely on free-tier API quotas.  
If the AI does not respond, it is likely due to the daily/monthly limit being reached.  
The **core architecture remains fully functional.**

---

## ✨ Core Features  

### 🔐 Full User Authentication  
- Secure registration and login system  
- JWT for protected routes  
- Password hashing with `bcryptjs`  

### 🌐 Multi-Platform Integration  
- Connect **Twitter** accounts using OAuth 2.0 with token refresh logic  
- Connect **LinkedIn** accounts using OAuth 2.0  

### 🤖 AI Content Studio  
- **Text Generation:** Generate engaging posts for any business context  
- **Image Generation:** AI-powered image creation with captions  
- **Editable Content:** Users can fully edit AI-generated drafts before posting  

### 📅 Direct & Scheduled Posting  
- **Post Now:** Instantly publish content to Twitter & LinkedIn  
- **Automatic Scheduling:** Schedule posts for future dates with `node-cron`  
- **Content Calendar:** Interactive calendar showing scheduled, posted & failed posts  

### 🎨 Polished UI/UX  
- Clean, modern, and fully responsive **dark-themed interface**  
- Built with custom CSS for a unique look  

---

## 🛠️ Tech Stack  

**Frontend:** React, React Router, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**Authentication:** JWT, bcryptjs  
**Social Media APIs:** Twitter API v2, LinkedIn API  
**AI:** Simulated (for demo reliability)  
**Scheduling:** node-cron  
**Deployment:** Vercel (Frontend), Render (Backend)  


git clone <your-repository-link>
cd humanity-hackathon

# Post Pilot AI

An AI-powered social media management tool designed to automate and optimize posting on platforms like LinkedIn and Twitter (X). Built as part of the Humanity Hackathon, this full-stack application leverages AI to generate engaging content, schedule posts, and manage social media accounts seamlessly.

## Live Demo

Check out the live application here: [https://post-pilot-ai-one.vercel.app/](https://post-pilot-ai-one.vercel.app/)

## Features

- **AI-Generated Content**: Utilize Google Generative AI to create compelling social media posts.
- **Multi-Platform Support**: Connect and post to LinkedIn and Twitter (X).
- **User Authentication**: Secure login and registration system using JWT.
- **Post Scheduling**: Automated scheduling with cron jobs for timely posts.
- **Dashboard**: User-friendly interface to manage posts, accounts, and analytics.
- **Calendar Integration**: View and manage scheduled posts with a calendar view.
- **Responsive Design**: Built with React and Material-UI for a modern, mobile-friendly experience.

## Tech Stack

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **Material-UI**: React components implementing Google's Material Design.
- **React Router**: Declarative routing for React.
- **Axios**: HTTP client for API requests.
- **React Big Calendar**: Calendar component for scheduling.

### Backend
- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB.
- **JWT**: JSON Web Tokens for authentication.
- **bcryptjs**: Password hashing.
- **Google Generative AI**: AI service for content generation.
- **Twitter API v2**: Integration with Twitter for posting.
- **Node-cron**: Task scheduling.

### DevOps
- **Docker**: Containerization for easy deployment.
- **Docker Compose**: Orchestration of multi-container applications.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB (or use Docker for local setup)

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Humanity-Hackathon
   ```

2. **Environment Variables:**
   - Create a `.env` file in the `server` directory with the following variables:
     ```
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     GOOGLE_AI_API_KEY=<your-google-ai-api-key>
     TWITTER_API_KEY=<your-twitter-api-key>
     TWITTER_API_SECRET=<your-twitter-api-secret>
     TWITTER_ACCESS_TOKEN=<your-twitter-access-token>
     TWITTER_ACCESS_TOKEN_SECRET=<your-twitter-access-token-secret>
     LINKEDIN_CLIENT_ID=<your-linkedin-client-id>
     LINKEDIN_CLIENT_SECRET=<your-linkedin-client-secret>
     ```
   - For Docker, create `server/.env.docker` with the same variables.

3. **Install Dependencies:**
   - For the client:
     ```bash
     cd client
     npm install
     ```
   - For the server:
     ```bash
     cd ../server
     npm install
     ```

4. **Run with Docker Compose:**
   ```bash
   cd ..
   docker-compose up --build
   ```
   - This will start the server on port 6001 and the client on port 4000.

5. **Alternative: Run Locally**
   - Start the server:
     ```bash
     cd server
     npm run dev
     ```
   - Start the client:
     ```bash
     cd client
     npm run dev
     ```

## Usage

1. Register or log in to your account.
2. Connect your social media accounts (LinkedIn and Twitter).
3. Use the AI feature to generate post content.
4. Schedule posts using the calendar interface.
5. Monitor your posts and analytics on the dashboard.

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/connect/linkedin` - Connect LinkedIn account
- `GET /api/connect/twitter` - Connect Twitter account
- `POST /api/ai/generate` - Generate AI content
- `POST /api/post/schedule` - Schedule a post
- `GET /api/post` - Get user posts

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the ISC License.

## Acknowledgments

- Built for the Humanity Hackathon.
- Thanks to the open-source community for the amazing tools and libraries.

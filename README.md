🚀 Custom URL Shortener API
📌 Overview
This project is a scalable URL Shortener API with advanced analytics, user authentication via Google Sign-In, and rate limiting. Users can create short URLs, group links under topics, and track detailed analytics. The solution is Dockerized and deployed to the cloud for scalability.

🏗️ Features
✅ Shorten long URLs into custom short links
✅ Google Sign-In authentication
✅ Track detailed analytics (clicks, unique users, OS, device type, etc.)
✅ Group URLs under specific topics (Acquisition, Activation, Retention)
✅ Rate limiting to prevent abuse
✅ Redis caching for fast performance
✅ Fully Dockerized for easy deployment

🛠️ Tech Stack
Backend: Node.js, Express.js
Database: MongoDB
Authentication: Google OAuth
Caching: Redis
Deployment: Docker + Railway/Render
🔧 Installation & Setup
1. Clone the repository
sh
Copy
Edit
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
2. Install dependencies
sh
Copy
Edit
npm install
3. Set up environment variables
Create a .env file in the root directory and add:

ini
Copy
Edit
MONGO_URI=your_mongo_connection_string
REDIS_URL=your_redis_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
4. Start the server
sh
Copy
Edit
npm start
📡 API Endpoints & Usage
1️⃣ User Authentication
Google Sign-In:

Endpoint: POST /api/auth/google
Response: { token: "jwt_token" }
2️⃣ Create Short URL
Endpoint: POST /api/shorten
Request Body:
json
Copy
Edit
{
  "longUrl": "https://example.com",
  "customAlias": "my-custom-url",
  "topic": "activation"
}
Response:
json
Copy
Edit
{
  "shortUrl": "https://short.ly/my-custom-url",
  "createdAt": "2025-03-07T10:00:00Z"
}
3️⃣ Redirect to Original URL
Endpoint: GET /api/shorten/{alias}
Response: Redirects to the original URL
4️⃣ Get URL Analytics
Endpoint: GET /api/analytics/{alias}
Response:
json
Copy
Edit
{
  "totalClicks": 120,
  "uniqueUsers": 80,
  "clicksByDate": [
    { "date": "2025-03-01", "clicks": 10 }
  ],
  "osType": [
    { "osName": "Windows", "uniqueClicks": 50, "uniqueUsers": 30 }
  ],
  "deviceType": [
    { "deviceName": "Mobile", "uniqueClicks": 70, "uniqueUsers": 40 }
  ]
}
For Topic-Based Analytics and Overall Analytics, follow similar structures.

🚀 Deployment
The API is deployed on Railway/Render.
🔗 Live API URL: https://your-deployed-url.com

You can test the API using Postman, Swagger, or any API client.

🛑 Rate Limiting
To prevent abuse, users are limited to X requests per hour.
If the limit is exceeded, a 429 Too Many Requests response is returned.

📝 Challenges & Solutions
Challenge 1: Handling Large Traffic with Redis Caching
Issue: Direct database queries were slow when fetching analytics.
Solution: Implemented Redis caching to store frequently accessed data, reducing DB load.
Challenge 2: Google Authentication Security
Issue: Ensuring secure authentication with Google Sign-In.
Solution: Used OAuth 2.0 with JWT and set proper expiration times.
📖 API Documentation (Swagger)
To make testing easier, we provide an interactive API reference.

1️⃣ Start the server
2️⃣ Open Swagger UI at: http://localhost:4444/api-docs

🤝 Contributing
Want to improve the project? Feel free to fork the repo, create a branch, and submit a pull request.


📌 Project Description (for GitHub)
Trustify is a full-stack platform that connects customers with service providers while tracking and scoring “trust” through a custom trust engine. It includes role-based authentication (admin/provider/customer), booking workflows, and real-time updates via sockets.

🚀 Key Features
Role-based dashboards (Admin, Provider, Customer)
Booking management (create, approve, cancel, track)
Trust scoring engine to evaluate provider reliability
Real-time updates via WebSockets (socket.io)
Auth + security (JWT-based login + middleware)
Seed data scripts for quick setup
🧱 Tech Stack
Frontend: React + Vite
Backend: Node.js + Express
Database: MongoDB (via Mongoose)
Real-time: socket.io
Email Service: nodemailer (mailService util)
⚙️ How to Run
Install dependencies:
cd client && npm install
cd server && npm install
Start servers:
npm run dev (client)
npm start (server)

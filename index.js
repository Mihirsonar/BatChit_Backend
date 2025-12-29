// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/auth.js';
import conversationRoutes from './Routes/Conversation.js';  
import messageRoutes from './Routes/Message.js';
import { connectDB } from './Config/db.js';

import http from 'http';
import { initSocket } from './Socket.js';

import userRoutes from './Routes/User_route.js';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const start = async () => {
  try {
    await connectDB(); 

    app.use('/api/auth/user', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/conversation', conversationRoutes);
    app.use('/api/message', messageRoutes);

    // app.listen(port, () => {
    //   console.log(`Server is running on port: ${port}`);
    // });

    const server = http.createServer(app);
    initSocket(server);

  server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

export default app;

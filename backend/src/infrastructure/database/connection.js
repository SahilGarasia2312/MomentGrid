'use strict';

const mongoose = require('mongoose');

/**
 * connectDB — establishes MongoDB connection via Mongoose.
 * Called once at server startup.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    throw new Error(`MongoDB connection failed: ${err.message}`);
  }
};

module.exports = connectDB;

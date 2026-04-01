const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // 3 second timeout instead of waiting forever
      connectTimeoutMS: 3000,
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`⚠ MongoDB not available - running in demo mode`);
    console.log(`Error details: ${error.message}`);
    return null; // Don't throw, just return null
  }
};

module.exports = connectDB;

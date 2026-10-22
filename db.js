// db.js
const mongoose = require('mongoose');

const DB_NAME = 'LabAttendanceDB_Iloreta';

let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME,
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // allow a retry on the next request
    throw err;
  }
  return cached.conn;
}

module.exports = connectToDatabase;
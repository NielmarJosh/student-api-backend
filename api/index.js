// api/index.js
const mongoose = require('mongoose');
const connectToDatabase = require('../db');

const RecordSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// Third argument = collection name inside LabAttendanceDB_Iloreta
const Record =
  mongoose.models.Record || mongoose.model('Record', RecordSchema, 'records');

module.exports = async (req, res) => {
  // CORS so the GitHub Pages site can call this API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const records = await Record.find({}).sort({ createdAt: -1 }).limit(100);
      return res.status(200).json(records);
    }

    if (req.method === 'POST') {
      const { title, content } = req.body || {};
      const newRecord = await Record.create({ title, content });
      return res.status(201).json(newRecord);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error); // visible in Vercel > Logs
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Title and content are required (title max 100, content max 1000 characters).' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};
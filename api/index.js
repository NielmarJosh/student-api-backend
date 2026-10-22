// api/index.js
// api/index.js
const connectToDatabase = require('../db');
const mongoose = require('mongoose');

// Schema na flexible (strict: false) para sa mga attendance records
const AttendanceSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

// Nakatutok ito sa iyong LabAttendanceDB_Iloreta database at 'records' collection
const Attendance =
  mongoose.models.Attendance ||
  mongoose.model('Attendance', AttendanceSchema, 'records');

module.exports = async (req, res) => {
  // CORS Headers para makipag-usap ang GitHub Pages frontend mo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    // 1. GET: Basahin at ipakita ang lahat ng attendance records
    if (req.method === 'GET') {
      const records = await Attendance.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json(records);
    }

    // 2. POST: Mag-save ng bagong attendance record mula sa website
    if (req.method === 'POST') {
      const newRecord = await Attendance.create(req.body);
      return res.status(201).json(newRecord);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database connection failed' });
  }
};

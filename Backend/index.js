const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const { MongoClient, ObjectId } = require('mongodb');

// Use local MongoDB connection string
const uri = 'mongodb://localhost:27017/mernJobBoard'; // Local MongoDB

// Create a MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Nodemailer setup for email sending
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'salmam.mohyadiin@gmail.com',
    pass: 'whbr prza iafx ktpp', // Your app-specific password for Gmail
  },
});

app.post('/send-confirmation', (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    from: 'salmam.mohyadiin@gmail.com',
    to: email,
    subject: 'Job Application Confirmation',
    text: 'Shaqada wa applied gareysay waan kula soo xidhiidhi doona insh allah ama Nagala so xidhiid +252 617157083',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Failed to send email');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent successfully');
  });
});

async function run() {
  try {
    // Connect to the local MongoDB server
    await client.connect();

    // Define your database and collections
    const db = client.db("mernJobBoard");
    const jobCollections = db.collection("demoJobs");
    const userCollections = db.collection("userCollection");
    const ApplicantCollection = db.collection("ApplicantCollection");

    // Routes for applicants
    app.post("/user/Applicant", async (req, res) => {
      const { email } = req.body;

      if (!email) {
        return res.status(400).send({
          message: "Email is required.",
          status: false,
        });
      }

      const existingEmail = await ApplicantCollection.findOne({ email });
      if (existingEmail) {
        return res.status(400).send({
          message: "Email already exists.",
          status: false,
        });
      }

      const newApplicant = {
        email,
        createdAt: new Date(),
      };

      const result = await ApplicantCollection.insertOne(newApplicant);
      if (result.insertedId) {
        return res.status(200).send({
          message: "Applicant registered successfully.",
          status: true,
        });
      } else {
        return res.status(500).send({
          message: "Cannot register applicant. Please try again.",
          status: false,
        });
      }
    });

    app.get("/get/applicants", async (req, res) => {
      const applicants = await ApplicantCollection.find({}).toArray();
      res.send(applicants);
    });

    // User registration
    app.post("/user/register", async (req, res) => {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).send({
          message: "Username, email, and password are required.",
          status: false,
        });
      }

      const existingUser = await userCollections.findOne({ email });
      if (existingUser) {
        return res.status(400).send({
          message: "User already exists.",
          status: false,
        });
      }

      const newUser = {
        username,
        email,
        password,
        createdAt: new Date(),
      };

      const result = await userCollections.insertOne(newUser);
      if (result.insertedId) {
        return res.status(200).send({
          message: "User registered successfully.",
          status: true,
        });
      } else {
        return res.status(500).send({
          message: "Cannot register user. Please try again.",
          status: false,
        });
      }
    });

    // Get all users
    app.get("/get-user", async (req, res) => {
      const users = await userCollections.find({}).toArray();
      res.send(users);
    });

    // Other routes (for jobs, login, job posting, etc.) remain unchanged, just ensure the correct collections are used with the new local connection

    // Ping MongoDB to confirm successful connection
    console.log("Pinged your Database. You successfully connected to MongoDB!");
  } finally {
    // Ensure client is closed when finished
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

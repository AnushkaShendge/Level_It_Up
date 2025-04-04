require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/dbConn');
const verifyJWT = require('./middleware/verifyJwt');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');

const port = process.env.PORT || 4000;
connectDB();
app.use(credentials);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/auth', require('./routes/authRoutes'));
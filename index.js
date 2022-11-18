const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const moviesRoute = require('./routes/movies')
const listRoute = require("./routes/lists")

dotenv.config();

// database connection
mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_PASS}@cluster0.ne3llg8.mongodb.net/?retryWrites=true&w=majority`)
    .then(() =>console.log('DB Connection Sucessful'))
    .catch(err => console.log(err))

app.use(express.json());

app.use("/api/auth", authRoute); 
app.use("/api/users", userRoute); 
app.use("/api/movies", moviesRoute);
app.use("/api/lists",listRoute);

app.listen(8800, () => console.log('Backend Server is running'))
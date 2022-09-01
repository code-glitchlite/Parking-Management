const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')

const { connectDB } = require('./db/db.js');
const slotRoutes = require('./routes/slot.routes.js')

dotenv.config();

const app = express();

app.use(cors(
    {
        origin: 'http://localhost:3000'
    }
))
app.use(express.json())

app.use('/slots', slotRoutes);
// app.use('/users', userRoutes)


const server = () => {
    try {
        connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`✔ Server running on port: ${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

server();
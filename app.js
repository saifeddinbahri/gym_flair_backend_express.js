import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoute.js';
import equipRoutes from './routes/equipRoute.js';
import courRoutes from './routes/courRoute.js';
import coachRoutes from './routes/coachRoute.js';
import abonnRoutes from './routes/abonnementRoute.js'
import abonnerRoutes from './routes/abonnerRoute.js'
import reservationRoutes from './routes/reservationRoute.js'
import eventRoutes from './routes/eventRoute.js'
import viewRoutes from './routes/viewRoutes.js'

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 5000

const app = express();
app.set('view engine', 'ejs')
app.use(express.json());
app.use(cors());
app.use(cookieParser())
app.use('/image', express.static('uploads'));
app.use(express.static('public'))

app.use('/views', viewRoutes)
app.use('/user',userRoutes);
app.use('/event', eventRoutes);
app.use('/equipment',equipRoutes);
app.use('/cour',courRoutes);
app.use('/coach',coachRoutes);
app.use('/abonnement',abonnRoutes);
app.use('/subscribe',abonnerRoutes);
app.use('/reservation',reservationRoutes);















//connect to the database
mongoose.connect(MONGODB_URI)
.then(()=>{
    console.log('connected to the database')
    app.listen(PORT,()=>{
        console.log("server is running")
    })
}).catch(err=>{
    console.log('Error connecting to database:',err.message)
})























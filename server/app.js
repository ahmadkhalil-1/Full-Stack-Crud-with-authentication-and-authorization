import express from 'express'
import connectDB from './config/db.js';
import userRoute from './routes/userRoute.js'
import todoRoute from './routes/todoRoutes.js'
import 'dotenv/config'
import cors from 'cors';

const app = express()
const port = process.env.PORT;

//Middlewares
app.use(express.json());
app.use(cors());

//Database 
connectDB();

//Routes
app.use('/api/auth', userRoute);
app.use('/api/auth', todoRoute);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
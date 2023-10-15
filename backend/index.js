import express, { request, response } from "express";
import cors from 'cors'; // Add this import
// import { PORT, URI } from "./config.js";
import mongoose from 'mongoose';
import todoRoutes from './routes/todoRoute.js';

const app = express();
app.use(express.json());

// Middleware for handling cors origin
// Method 1: allow all origins with default of cors(*)
app.use(cors());


app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome to the Main Page');
});

app.use('/todos', todoRoutes);

mongoose
    .connect(process.env.URI)
    .then(() => {
        console.log('App connected to database.');
        app.listen(process.env.PORT || 5555, () => {
            console.log(`App is listening to Port: ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
    
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mediGuideRouter from './api/mediGuideApi';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());
app.use('/api/mediguide', mediGuideRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
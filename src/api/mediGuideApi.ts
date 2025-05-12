import express, { Request, Response } from 'express';
import { MediGuideModel } from '../Models/MediGuideModel';

const router = express.Router();

// Initialize MediGuide instance
let mediGuideInstance: MediGuideModel | null = null;

const initializeMediGuide = async () => {
    if (!mediGuideInstance) {
        mediGuideInstance = await MediGuideModel.getInstance();
    }
    return mediGuideInstance;
};

// Get current question
router.get('/question', async (_req: Request, res: Response): Promise<void> => {
    try {
        const mediGuide = await initializeMediGuide();
        const question = mediGuide.getCurrentQuestion();
        res.json({ success: true, question });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to get question' });
    }
});

// Process answer
router.post('/answer', async (req: Request, res: Response): Promise<void> => {
    try {
        const { answer } = req.body;
        if (!answer) {
            res.status(400).json({ success: false, error: 'Answer is required' });
            return;
        }

        const mediGuide = await initializeMediGuide();
        const result = await mediGuide.processAnswer(answer);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to process answer' });
    }
});

// Reset questionnaire
router.post('/reset', async (_req: Request, res: Response): Promise<void> => {
    try {
        const mediGuide = await initializeMediGuide();
        mediGuide.resetQuestionnaire();
        const question = mediGuide.getCurrentQuestion();
        res.json({ success: true, question });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to reset questionnaire' });
    }
});

export default router;
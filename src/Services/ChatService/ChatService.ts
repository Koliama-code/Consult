import { MediGuideModel } from "../../Models/MediGuideModel";

interface ConversationEntry {
    timestamp: string;
    type: 'question' | 'answer' | 'diagnostic';
    content: string;
}

export class ChatService {
    private static instance: ChatService;
    private mediGuide: MediGuideModel | null = null;
    private conversationHistory: ConversationEntry[] = [];

    private constructor() {}

    public static async getInstance(): Promise<ChatService> {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public async initialize() {
        try {
            this.mediGuide = await MediGuideModel.getInstance();
        } catch (error) {
            console.error("ChatService initialization error:", error);
            throw error;
        }
    }

    private addToHistory(type: 'question' | 'answer' | 'diagnostic', content: string) {
        const entry: ConversationEntry = {
            timestamp: new Date().toISOString(),
            type,
            content
        };
        this.conversationHistory.push(entry);
        console.log("Conversation History Updated:", this.conversationHistory);
    }

    public async getQuestion(): Promise<string> {
        try {
            if (!this.mediGuide) {
                throw new Error("MediGuide not initialized");
            }
            const question = this.mediGuide.getCurrentQuestion();
            this.addToHistory('question', question);
            return question;
        } catch (error) {
            console.error("Error getting question:", error);
            throw error;
        }
    }

    public async submitAnswer(answer: string): Promise<{
        question: string | null;
        diagnostic?: string;
    }> {
        try {
            if (!this.mediGuide) {
                throw new Error("MediGuide not initialized");
            }
            this.addToHistory('answer', answer);
            
            const result = await this.mediGuide.processAnswer(answer);
            
            if (result.diagnostic) {
                this.addToHistory('diagnostic', result.diagnostic);
            }
            if (result.question) {
                this.addToHistory('question', result.question);
            }
            
            return result;
        } catch (error) {
            console.error("Error submitting answer:", error);
            throw error;
        }
    }

    public async reset(): Promise<void> {
        try {
            if (!this.mediGuide) {
                throw new Error("MediGuide not initialized");
            }
            this.mediGuide.resetQuestionnaire();
            this.conversationHistory = [];
            console.log("Conversation history reset");
        } catch (error) {
            console.error("Error resetting chat:", error);
            throw error;
        }
    }

    public getConversationHistory(): ConversationEntry[] {
        return this.conversationHistory;
    }
}
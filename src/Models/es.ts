import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { WebBrowser } from "langchain/tools/webbrowser";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import dotenv from 'dotenv';



dotenv.config();



interface SymptomData {
    principal: string;
    duree: string;
    intensite: string;
    symptomesAssocies: string[];
    antecedents: string;
    medicaments: string;
    allergies: string;
}


interface MedicalSource {
    url: string;
    relevance: number;
    content: string;
}

interface EnhancedSymptomData extends SymptomData {
    additionalResources: MedicalSource[];
}

export class MediGuideModel {
    private static instance: MediGuideModel;
    private model: ChatFireworks;
    private systemPrompt: SystemMessage;
    private browser: WebBrowser;
    private currentStep: number = 0;
    private symptomData: Partial<SymptomData> = {};
    private readonly questions = [
        "Quel est votre symptôme principal ? (ex: maux de tête, douleur abdominale...)",
        "Depuis combien de temps ressentez-vous ce symptôme ?",
        "Sur une échelle de 1 à 10, quelle est l'intensité de votre symptôme ?",
        "Quels autres symptômes associez-vous à ce problème ? (liste séparée par des virgules)",
        "Avez-vous des antécédents médicaux pertinents ?",
        "Prenez-vous actuellement des médicaments ? Lesquels ?",
        "Avez-vous des allergies connues ?"
    ];

    private constructor() {
        const apiKey = process.env.FIREWORKS_API_KEY;
        if (!apiKey) {
            throw new Error("FIREWORKS_API_KEY is not set in environment variables");
        }

        this.model = new ChatFireworks({
            apiKey,
            model: "accounts/fireworks/models/llama-v3-70b-instruct",
            temperature: 0.7,
            maxTokens: 2000,
        });

        this.systemPrompt = new SystemMessage(`Tu es un assistant médical virtuel professionnel. 
        Après avoir recueilli 7 informations clés tout en sachant que les utilisateurs 
        sont en Afrique, précisement en RDC,alors ton résultat ne se refère au contexte de ce milieu, tu dois:
        1. Synthétiser les informations
        2. Proposer un diagnostic différentiel
        3. Recommander des actions appropriées
        4. Préciser quand consulter un médecin 
        5. Recommandation des médecins spécialistes selon les diagnostics

        Sois empathique et factuel. Utilise des termes médicaux précis mais expliqués.`);
    }

    public static async getInstance(): Promise<MediGuideModel> {
        if (!MediGuideModel.instance) {
            MediGuideModel.instance = new MediGuideModel();
        }
        return MediGuideModel.instance;
    }

    public getCurrentQuestion(): string {
        return this.currentStep < this.questions.length ? this.questions[this.currentStep] : "";
    }

    public async processAnswer(answer: string): Promise<{ question: string | null; diagnostic?: string }> {
        if (!answer.trim()) {
            throw new Error("Answer cannot be empty");
        }

        if (this.currentStep >= this.questions.length) {
            return { question: null };
        }

        this.saveAnswer(answer);
        this.currentStep++;

        if (this.currentStep < this.questions.length) {
            return { question: this.getCurrentQuestion() };
        } else {
            const diagnostic = await this.generateDiagnostic();
            return { question: null, diagnostic };
        }
    }

    private saveAnswer(answer: string): void {
        switch (this.currentStep) {
            case 0: this.symptomData.principal = answer; break;
            case 1: this.symptomData.duree = answer; break;
            case 2: this.symptomData.intensite = answer; break;
            case 3: this.symptomData.symptomesAssocies = answer.split(',').map(s => s.trim()); break;
            case 4: this.symptomData.antecedents = answer; break;
            case 5: this.symptomData.medicaments = answer; break;
            case 6: this.symptomData.allergies = answer; break;
        }
    }

    private async searchMedicalResources(symptoms: string): Promise<MedicalSource[]> {
        const sources: MedicalSource[] = [];
        
        for (const baseUrl of this.medicalSources) {
            try {
                const loader = new CheerioWebBaseLoader(baseUrl);
                const docs = await loader.load();
                
                // Split text into manageable chunks
                const splitter = new RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                    chunkOverlap: 200,
                });
                const splits = await splitter.splitDocuments(docs);

                // Process and filter relevant content
                const relevantContent = splits.filter(split => 
                    this.isRelevantToSymptoms(split.pageContent, symptoms)
                );

                if (relevantContent.length > 0) {
                    sources.push({
                        url: baseUrl,
                        relevance: this.calculateRelevance(relevantContent[0].pageContent, symptoms),
                        content: relevantContent[0].pageContent
                    });
                }
            } catch (error) {
                console.error(`Error fetching from ${baseUrl}:`, error);
            }
        }

        return sources.sort((a, b) => b.relevance - a.relevance);
    }

    private isRelevantToSymptoms(content: string, symptoms: string): boolean {
        const symptomKeywords = symptoms.toLowerCase().split(' ');
        const contentLower = content.toLowerCase();
        return symptomKeywords.some(keyword => contentLower.includes(keyword));
    }

    private calculateRelevance(content: string, symptoms: string): number {
        const symptomKeywords = symptoms.toLowerCase().split(' ');
        const contentLower = content.toLowerCase();
        return symptomKeywords.reduce((score, keyword) => {
            return score + (contentLower.split(keyword).length - 1);
        }, 0);
    }

    private async generateDiagnostic(): Promise<string> {
        // Search for additional medical information
        const additionalResources = await this.searchMedicalResources(
            `${this.symptomData.principal} ${this.symptomData.symptomesAssocies?.join(' ')}`
        );

        const enhancedPrompt = `Sur la base des informations suivantes:
        - Symptôme principal: ${this.symptomData.principal}
        - Durée: ${this.symptomData.duree}
        - Intensité: ${this.symptomData.intensite}/10
        - Symptômes associés: ${this.symptomData.symptomesAssocies?.join(', ')}
        - Antécédents: ${this.symptomData.antecedents}
        - Médicaments: ${this.symptomData.medicaments}
        - Allergies: ${this.symptomData.allergies}

        Informations supplémentaires des sources médicales:
        ${additionalResources.map(source => `
        Source: ${source.url}
        ${source.content.substring(0, 500)}...
        `).join('\n')}

        Fournis:
        1. Un diagnostic différentiel en 3 points maximum
        2. Des recommandations adaptées
        3. Le degré d'urgence (consultation immédiate/sous 48h/surveillance)
        4. Des conseils pour le soulagement des symptômes
        5. Sources médicales consultées pour plus d'informations`;

        try {
            const response = await this.model.invoke([
                this.systemPrompt, 
                new HumanMessage(enhancedPrompt)
            ]);
            return response.content as string;
        } catch (error) {
            console.error("Error generating diagnostic:", error);
            throw new Error("Failed to generate diagnostic");
        }
    }

    public resetQuestionnaire(): void {
        this.currentStep = 0;
        this.symptomData = {};
    }
}



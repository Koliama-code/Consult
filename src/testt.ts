
// testMediGuide.ts
import { MediGuideModel } from './Models/MediGuideModel';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

interface ConversationEntry {
    questionNumber: number;
    question: string;
    answer: string;
    timestamp: Date;
}

interface MedicalSession {
    sessionId: string;
    startTime: Date;
    endTime?: Date;
    patientResponses: ConversationEntry[];
    diagnostic?: string;
}

const rl = readline.createInterface({ input, output });
const mediGuide = await MediGuideModel.getInstance();

// Créer une nouvelle session
const currentSession: MedicalSession = {
    sessionId: Date.now().toString(),
    startTime: new Date(),
    patientResponses: []
};

console.log("Questionnaire médical (répondez à 7 questions)\n");

async function conductInterview() {
    let question = mediGuide.getCurrentQuestion();
    let questionNumber = 1;
    
    while (question) {
        const answer = await rl.question(question + '\n> ');
        
        // Enregistrer la conversation
        currentSession.patientResponses.push({
            questionNumber,
            question,
            answer,
            timestamp: new Date()
        });

        const result = await mediGuide.processAnswer(answer);
        
        if (result.diagnostic) {
            console.log("\n=== DIAGNOSTIC PRELIMINAIRE ===");
            console.log(result.diagnostic);
            currentSession.diagnostic = result.diagnostic;
            currentSession.endTime = new Date();
            
            // Afficher le résumé de la session
            console.log("\n=== RÉSUMÉ DE LA CONSULTATION ===");
            console.log(`Début de la consultation: ${currentSession.startTime.toLocaleString()}`);
            console.log(`Nombre de questions: ${currentSession.patientResponses.length}`);
            console.log("\nHistorique des échanges:");
            currentSession.patientResponses.forEach(entry => {
                console.log(`\nQuestion ${entry.questionNumber}:`);
                console.log(`Q: ${entry.question}`);
                console.log(`R: ${entry.answer}`);
            });
            break;
        }

        questionNumber++;
        question = result.question || "";
    }

    rl.close();
    return currentSession;
}

// Exécuter l'entretien et sauvegarder les résultats
conductInterview().then(session => {
    // Ici vous pouvez ajouter la logique pour sauvegarder la session
    // Par exemple dans un fichier ou une base de données
    console.log("\nSession terminée et sauvegardée.");
}).catch(error => {
    console.error("Erreur lors de la consultation:", error);
});
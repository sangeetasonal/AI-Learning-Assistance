import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import * as geminiService from "../utils/geminiService.js";
import { findRelevantChunks } from "../utils/textChunker.js";
import ChatHistory from "../models/ChatHistory.js";

// generate flashcards from document
// POST /api/ai/generate-flashcards

export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404,
      });
    }

    // Generate flashcards using Gemini
    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count)
    );

    // Save to database
    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map(card => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });

    res.status(201).json({
      success: true,
      data: flashcardSet,
      message: 'Flashcards generated successfully',
    });
  } catch (error) {
    next(error);
  }
};


//generate quiz from document 
//POST /api/ai/generate-quiz
export const generateQuiz = async (req,res, next) => {
try{
    const { documentId, numQuestion = 5, title } = req.body;

    if(!documentId){
       return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400,
       });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    })

    if( !document){
       return res.status(400).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 400,
       });
    }


    // generate quiz using gemini
    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestion)
    );

    //save to database
    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0 
    });

      res.status(201).json({
        success: true,
        data: quiz,
        message: 'Quiz generated successfully'
      });


  } catch (error) {
    next(error)
  }

};


//generate document summary
// POST /api/ai/generate-summary
export const generateSummary = async (req, res, next) => {
try{
   const { documentId } = req.body;

   if (!documentId) {
     return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400,
       });
   }

   const document = await Document.findOne({
    _id: documentId,
    userId: req.user._id,
    status: 'ready'
   });

   if (!document){
     return res.status(400).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 400,
       });
   }

   // generate summary using gemini
   const summary = await geminiService.generateSummary(document.extractedText);

   res.status(200).json({
    success: true,
    data: {
      documentId: document._id,
      title: document.title,
      summary
    },
    message: 'Summary generated successfully'
   });

  } catch (error) {
    next(error)
  }
};

//chat with document
//POST /api/ai/chat
// POST /api/ai/chat
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    // 1️⃣ Validation
    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and question',
        statusCode: 400,
      });
    }

    // 2️⃣ Find document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready',
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
        statusCode: 404,
      });
    }

    // 3️⃣ Find relevant chunks (NO fallback)
    const relevantChunks = findRelevantChunks(
      document.chunks,
      question,
      3
    );

    console.log(
      'RAW RELEVANT CHUNKS:',
      relevantChunks.map(c => ({
        chunkIndex: c.chunkIndex,
        score: c.score,
      }))
    );

    // ❌ Question not related to document
    if (!relevantChunks || relevantChunks.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          question,
          answer:
            'The uploaded document does not contain information related to this question.',
          relevantChunks: [],
          chatHistoryId: null,
        },
        message: 'No relevant context found in document',
      });
    }

    // 4️⃣ Extract chunk indices
    const chunkIndices = relevantChunks
      .map(c => c.chunkIndex)
      .filter(i => typeof i === 'number');

    // 5️⃣ Get or create chat history
    let chatHistoryDoc = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id,
    });

    if (!chatHistoryDoc) {
      chatHistoryDoc = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: [],
      });
    }

    // 6️⃣ Generate answer using Gemini
    const answer = await geminiService.chatWithContext(
      question,
      relevantChunks
    );

    // 7️⃣ Save chat history
    chatHistoryDoc.messages.push(
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
        relevantChunks: [],
      },
      {
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices,
      }
    );

    await chatHistoryDoc.save();

    // 8️⃣ Response
    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistoryDoc._id,
      },
      message: 'Response generated successfully',
    });

  } catch (error) {
    next(error);
  }
};



// explain concept from document
//POST /api/ai/explain-concept
export const explainConcept = async (req, res, next) => {
try{
 const { documentId, concept } = req.body;

    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and concept',
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error:'Document not found or not ready',
        statusCode: 404
      });
    }

    // find  relevant chunks or the concept 
   let relevantChunks = findRelevantChunks(document.chunks, concept, 3);

if (!relevantChunks || relevantChunks.length === 0) {
  relevantChunks = []; // no fallback, truly no match
}


const context = relevantChunks.map(c => c.content).join('\n\n');

    
    //generate explanation using Gemini
    const explanation = await geminiService.explainConcept(concept, context);

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c => c.chunkIndex)
      },
      message: 'Explanation generated successfully'
    });

  } catch (error) {
    next(error)
  }
};

//get chat history for a document
//POST /api/ai/chat-history/:documentId
export const getChatHistory = async (req, res, next) => {
try{
const { documentId} = req.params;

    if (!documentId ) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
        statusCode: 400,
      });
    }

    const ChatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: documentId
    }).select('message'); // only retrieve the message array

    if (!ChatHistory) {
      return res.status(200).json({
        success: true,
        data: [], // return an empty array if no chat history found
        message: 'No chat history found for this document'
      })
    }

    res.status(200).json({
      success: true,
      data: ChatHistory.message,
      message: 'Chat history retrieve successfully'
    })
  } catch (error) {
    next(error)
  }
};


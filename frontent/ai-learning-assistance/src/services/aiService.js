// import axiosInstance from '../utils/axiosInstance';
// import { API_PATHS } from '../utils/apiPaths';

// const generateFlashcards = async (documentId, options) => {
//     try {
//         const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
//             documentId,
//             ...options
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to generate flashcards' };
//     }   
// };

// const generateQuiz = async (documentId, options) => {
//     try {
//         const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, { 
//             documentId,
//             ...options
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to generate quiz' };
//     }
// };

// const generateSummary = async (documentId) => {
//     try {
//         const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, { documentId });
//         return response.data;
//     }   
//     catch (error) {
//         throw error.response?.data || { message: 'Failed to generate summary' };
//     }
// };

// const chat = async (documentId, message) => {
//     try {
//         const response = await axiosInstance.post(API_PATHS.AI.CHAT, { documentId, question: message });// remove history from payload
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to send message' };
//     }
// };

// const explainConcept = async (documentId, concept) => {
//     try {
//         const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, { documentId, concept });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to explain concept' };
//     }
// };

// const getChatHistory = async (documentId) => {

//     try {
//         const response = await axiosInstance.get(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
//         return response.data;
//     }       
//     catch (error) {
//         throw error.response?.data || { message: 'Failed to fetch chat history' };
//     }
// };

// const aiService = {
//     generateFlashcards,
//     generateQuiz,
//     generateSummary,
//     chat,
//     explainConcept,
//     getChatHistory
// };

// export default aiService;

import apiClient from "../utils/apiClient";
import { API_PATHS } from "../utils/apiPaths";

/**
 * Generate Flashcards
 */
const generateFlashcards = (documentId, options = {}) => {
  return apiClient(API_PATHS.AI.GENERATE_FLASHCARDS, {
    method: "POST",
    body: JSON.stringify({
      documentId,
      ...options,
    }),
  });
};

/**
 * Generate Quiz
 */
const generateQuiz = (documentId, options = {}) => {
  return apiClient(API_PATHS.AI.GENERATE_QUIZ, {
    method: "POST",
    body: JSON.stringify({
      documentId,
      ...options,
    }),
  });
};

/**
 * Generate Summary
 */
const generateSummary = (documentId) => {
  return apiClient(API_PATHS.AI.GENERATE_SUMMARY, {
    method: "POST",
    body: JSON.stringify({ documentId }),
  });
};

/**
 * Chat with document (no history in payload, backend handles it)
 */
const chat = (documentId, message) => {
  return apiClient(API_PATHS.AI.CHAT, {
    method: "POST",
    body: JSON.stringify({
      documentId,
      question: message,
    }),
  });
};

/**
 * Explain concept
 */
const explainConcept = (documentId, concept) => {
  return apiClient(API_PATHS.AI.EXPLAIN_CONCEPT, {
    method: "POST",
    body: JSON.stringify({
      documentId,
      concept,
    }),
  });
};

/**
 * Get chat history
 */
const getChatHistory = (documentId) => {
  return apiClient(API_PATHS.AI.GET_CHAT_HISTORY(documentId));
};

export default {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
};

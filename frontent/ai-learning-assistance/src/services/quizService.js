// import axiosInstance from '../utils/axiosInstance';
// import { API_PATHS } from '../utils/apiPaths';

// const getQuizzesForDocument = async (documentId) => {
//     try {
//         const response = await axiosInstance.get(API_PATHS.QUIZ.GET_QUIZZES_FOR_DOC(documentId));
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to fetch quizzes for document' };
//     }
// };

// const getQuizById = async (quizId) => {
//     try {
//         const response = await axiosInstance.get(API_PATHS.QUIZ.GET_QUIZ_BY_ID(quizId));    
//         return response.data;
//     }
//     catch (error) {
//         throw error.response?.data || { message: 'Failed to fetch quiz' };
//     }   
// };

// const submitQuiz = async (quizId, answers) => {
//     try {
//         const response = await axiosInstance.post(API_PATHS.QUIZ.SUBMIT_QUIZ(quizId), { answers });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to submit quiz' };
//     }
// };


// const getQuizResults = async (quizId) => {
//     try {
//         const response = await axiosInstance.get(API_PATHS.QUIZ.GET_QUIZ_RESULTS(quizId));
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to fetch quiz results' };
//     }
// };

// const deleteQuiz = async (quizId) => {
//     try {
//         const response = await axiosInstance.delete(API_PATHS.QUIZ.DELETE_QUIZ(quizId));
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to delete quiz' };
//     }
// };

// const quizService = {
//     getQuizzesForDocument,
//     getQuizById,
//     submitQuiz,
//     getQuizResults,
//     deleteQuiz
// };

// export default quizService;

import apiClient from "../utils/apiClient";
import { API_PATHS } from "../utils/apiPaths";

const getQuizzesForDocument = (documentId) => {
  return apiClient(API_PATHS.QUIZZES.GET_QUIZZES_FOR_DOC(documentId));
};

const getQuizById = (quizId) => {
  return apiClient(API_PATHS.QUIZZES.GET_QUIZZES_BY_ID(quizId));
};

const submitQuiz = (quizId, answers) => {
  return apiClient(API_PATHS.QUIZZES.SUBMIT_QUIZ(quizId), {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
};

const getQuizResults = (quizId) => {
  return apiClient(API_PATHS.QUIZZES.GET_QUIZ_RESULTS(quizId));
};

const deleteQuiz = (quizId) => {
  return apiClient(API_PATHS.QUIZZES.DELETE_QUIZ(quizId), {
    method: "DELETE",
  });
};

export default {
  getQuizzesForDocument,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz,
};

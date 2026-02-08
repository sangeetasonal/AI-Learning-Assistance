import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const getAllFlashcards = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARD_SETS);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch flashcards' };
    }       
};

const getFlashcardsForDocument = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId));          
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch flashcards for document' };
    }
};

const reviewFlashcard = async (cardId, cardIndex) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId), { cardIndex });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to review flashcard' };
    }
};

const toggleStar = async (cardId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
        return response.data;
    }   catch (error) {
        throw error.response?.data || { message: 'Failed to toggle star' };
    }
};

const deleteFlashcardSet = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete flashcard set' };
    }
};

const flashcardService = {
    getAllFlashcards,
    getFlashcardsForDocument,
    reviewFlashcard,
    toggleStar,
    deleteFlashcardSet
};

export default flashcardService;
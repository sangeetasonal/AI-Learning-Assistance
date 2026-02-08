import express from 'express';
import {
    getFlashcards,
    getAllFlashcardsSets,
    reviewFlashcard,
    toggleStarFlashcard,
    deleteFlashcardSets,
} from '../controllers/flashcardController.js';
import protect from '../middleware/auth.js';


const router = express.Router();
//protected routes
router.use(protect);    

router.get('/', getAllFlashcardsSets);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashcard);
router.put('/:cardId/star', toggleStarFlashcard);
router.delete('/:id', deleteFlashcardSets);

export default router;
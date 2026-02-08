import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import {chunkText} from '../utils/textChunker.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';

//upload pdf document
//@route POST /api/documents/upload
export const uploadDocument = async (req, res, next) => {
    try {
         if (!req.file) {
        return res.status(400).json({
            success: false,
            error: 'Please upload a PDF file',
            StatusCode : 400
        });
    }

    const { title } = req.body;

    if (!title) {
        //delete uploaded file if title is not provided
        await fs.unlink(req.file.path);
        return  res.status(400).json({
            success: false,
            error: 'Please provide a title for the document',
            StatusCode : 400
        });
    }

    //construct the URL for the uploaded file
    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

    //create document record 
    const document = await Document.create({
        userId: req.user._id,
        title,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        status: 'processing'
    });

    //process PDF  in background
    processPDF(document._id, req.file.path).catch((err) => {
        console.error('Error processing PDF:', err);
    });

    res.status(201).json({
        success: true,
        data: document,
        message: 'Document uploaded successfully and is being processed'
    });

    } catch (error) {
        //clean up uploaded file in case of error
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        next(error);
    }
};

//helper function to process PDF
const processPDF = async (documentId, filePath) => {
    try {
        //extract text from PDF
        const { text} = await extractTextFromPDF(filePath);

        //create chunks
        const chunks = chunkText(text, 500 , 50); 

        //update document record
        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks: chunks,
            status: 'ready'
        });

        console.log(`Document ${documentId} processed successfully`);
    } catch (error) {
        console.error(`Error processing document ${documentId}:`, error);
        await Document.findByIdAndUpdate(documentId, {
            status: 'error'
        });
    }
};

//get all documents
//@route GET /api/documents
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: 'flashcards',
          localField: '_id',
          foreignField: 'documentId',
          as: 'flashcardSets',
        },
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: 'documentId',
          as: 'quizzes',
        },
      },
      {
        $addFields: {
          flashcardCount: { $size: '$flashcardSets' },
          quizCount: { $size: '$quizzes' },
        },
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0,
        },
      },
      {
        $sort: { uploadDate: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};


//get single documents with chunks
//@route GET /api/documents/:id
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
      });
    }

    const flashcardCount = await Flashcard.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });

    const quizCount = await Quiz.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });

    document.lastAccessed = Date.now();
    await document.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: {
        ...document.toObject(),
        flashcardCount,
        quizCount,
      },
    });
  } catch (error) {
    next(error);
  }
};


//delete document
//@route DELETE /api/documents/:id
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found',
        statusCode: 404,
      });
    }

    // Delete file from filesystem
    await fs.unlink(document.filePath).catch(() => {});

    // Delete document
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};



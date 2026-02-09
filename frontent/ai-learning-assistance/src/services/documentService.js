// import axiosInstance from '../utils/axiosInstance';
// import { API_PATHS } from '../utils/apiPaths';

// const getDocuments = async () => {
//     try {
//         const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
//         return response.data?.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to fetch documents' };
//     }
// };

// const uploadDocument = async (formData) => {
//     try {
//         const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to upload document' };
//     }
// };

// const deleteDocument = async (id) => {
//     try {
//         const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id));
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || { message: 'Failed to delete document' };
//     }   
// };

// const getDocumentById = async (id) => {
//     try {
//         const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id));
//         return response.data;
//     }   
//     catch (error) {
//         throw error.response?.data || { message: 'Failed to fetch document' };
//     }
// };


// const documentService = {
//     getDocuments,
//     uploadDocument,
//     deleteDocument,
//     getDocumentById,
// };

// export default documentService;

import apiClient from "../utils/apiClient";
import { API_PATHS } from "../utils/apiPaths";

/**
 * GET all documents
 */
const getDocuments = async () => {
  const data = await apiClient(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
  return data?.data;
};

/**
 * UPLOAD document (multipart/form-data)
 * IMPORTANT: do NOT set Content-Type manually
 */
const uploadDocument = async (formData) => {
  return apiClient(API_PATHS.DOCUMENTS.UPLOAD, {
    method: "POST",
    body: formData,
    headers: {
      // Let the browser set multipart boundary automatically
      Accept: "application/json",
    },
  });
};

/**
 * DELETE document
 */
const deleteDocument = (id) => {
  return apiClient(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id), {
    method: "DELETE",
  });
};

/**
 * GET document by ID
 */
const getDocumentById = (id) => {
  return apiClient(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id));
};

export default {
  getDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentById,
};

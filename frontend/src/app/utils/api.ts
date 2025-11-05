import axios from 'axios';

const API_URL = 'http://localhost:8080/api/documents'; // URL da sua API no backend

export const api = {
  getDocuments: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  createDocument: async (newDoc: any) => {
    const response = await axios.post(API_URL, newDoc);
    return response.data;
  },

  updateDocument: async (id: string, updatedDoc: any) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedDoc);
    return response.data;
  },

  deleteDocument: async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};
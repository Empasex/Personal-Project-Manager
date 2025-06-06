import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/projects';

const noCacheHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export const fetchProjects = async (userId) => {
    const response = await axios.get(`${API_URL}?userId=${userId}`);
    return response.data;
};

export const createProject = async (project) => {
    const response = await axios.post(API_URL, project);
    return response.data;
};

export const updateProject = async (projectId, project) => {
    const response = await axios.put(`${API_URL}/${projectId}`, project);
    return response.data;
};

export const deleteProject = async (projectId, userId) => {
    await axios.delete(`${API_URL}/${projectId}?userId=${userId}`);
};
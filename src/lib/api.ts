import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const signup = async (username: string, email: string, password: string) => {
  const response = await api.post('/signup', { username, email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const createBlog = async (title: string, content: string) => {
  const response = await api.post('/blogs', { title, content });
  return response.data;
};

export const getBlogs = async () => {
  const response = await api.get('/blogs');
  return response.data;
};

export const deleteBlog = async (id: number) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};

export const likeBlog = async (id: number, action: 'like' | 'dislike') => {
  const response = await api.post(`/blogs/${id}/like`, { action });
  return response.data;
};

export const reportBlog = async (id: number, reason: string) => {
  const response = await api.post(`/blogs/${id}/report`, { reason });
  return response.data;
};

export const getReports = async () => {
  const response = await api.get('/admin/reports');
  return response.data;
};

export default api;
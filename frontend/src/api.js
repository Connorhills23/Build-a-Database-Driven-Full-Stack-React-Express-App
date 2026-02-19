import axios from "axios";

const API_URL =
  "https://build-a-database-driven-full-stack-react-9cwd.onrender.com";

export const getUsers = () => axios.get(`${API_URL}/users`);
export const addUser = (username, email) =>
  axios.post(`${API_URL}/users`, { username, email });

export const getCategories = () => axios.get(`${API_URL}/categories`);
export const addCategory = (name) =>
  axios.post(`${API_URL}/categories`, { name });

export const getTodos = (userId) => axios.get(`${API_URL}/todos/${userId}`);
export const addTodo = (todo) => axios.post(`${API_URL}/todos`, todo);
export const updateTodo = (id, todo) =>
  axios.put(`${API_URL}/todos/${id}`, todo);
export const deleteTodo = (id) => axios.delete(`${API_URL}/todos/${id}`);

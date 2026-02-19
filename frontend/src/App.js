import React, { useEffect, useState } from "react";
import {
  getUsers,
  getCategories,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "./api";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // ------------------------
  // Fetch users and categories
  // ------------------------
  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedUser) fetchTodosByUser(selectedUser);
  }, [selectedUser]);

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
    if (res.data.length) setSelectedUser(res.data[0].id);
  };

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const fetchTodosByUser = async (userId) => {
    const res = await getTodos(userId);
    setTodos(res.data);
  };

  // ------------------------
  // Handlers
  // ------------------------
  const handleAddTodo = async () => {
    if (!task || !selectedUser) return;

    await addTodo({
      task,
      user_id: selectedUser,
      priority,
      due_date: dueDate || null,
      category_id: categoryId || null,
    });

    setTask("");
    setPriority("medium");
    setDueDate("");
    setCategoryId("");
    fetchTodosByUser(selectedUser);
  };

  const handleToggleComplete = async (todo) => {
    await updateTodo(todo.id, { ...todo, completed: !todo.completed });
    fetchTodosByUser(selectedUser);
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodo(id);
    fetchTodosByUser(selectedUser);
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "";
  };

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className="container">
      <h1>Todo App Build a Database Driven Full Stack React & Express App</h1>

      {/* User Selection */}
      <div className="select-user">
        <label>Select User: </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>
      </div>

      {/* Add Todo Form */}
      <div className="add-todo">
        <input
          placeholder="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>

      {/* Todo List */}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div
              className={`todo-task ${todo.completed ? "completed" : ""} priority-${todo.priority}`}
              onClick={() => handleToggleComplete(todo)}
            >
              {todo.task}
              {todo.due_date && ` (Due: ${todo.due_date})`}
              {todo.category_id && (
                <span className="category-badge">
                  {getCategoryName(todo.category_id)}
                </span>
              )}
            </div>
            <button
              className="delete-btn"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

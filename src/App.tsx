import React, { useState, useEffect } from 'react';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from './components/Header/Header';

type Priority = 'low' | 'medium' | 'high';
type Status = 'not_started' | 'in_progress' | 'completed';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  status: Status; 
  createdAt: Date;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('not_started');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | "">('');
  const [filterStatus, setFilterStatus] = useState<Status | "">('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;

    const todo: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      priority: priority,
      status: status,
      createdAt: new Date(),
    };

    setTodos((prevTodos) => [...prevTodos, todo]);
    setNewTodo('');
    setPriority('medium');
    setStatus('not_started');
    setIsPopupOpen(false);
  };

  const toggleComplete = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            status: todo.completed ? 'not_started' as Status : 'completed' as Status
          }
        : todo
    );
    setTodos(updatedTodos);
  };
  
  

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  const openPopup = () => {
    setEditingTodo(null);
    setIsPopupOpen(true);
  };

  const openEditPopup = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.text);
    setPriority(todo.priority);
    setStatus(todo.status);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleEditTodo = () => {
    if (newTodo.trim() === '') return;

    const updatedTodos = todos.map(todo =>
      todo.id === editingTodo?.id ? { ...todo, text: newTodo, priority: priority, status: status } : todo
    );
    setTodos(updatedTodos);
    setNewTodo('');
    setPriority('medium');
    setStatus('not_started');
    setIsPopupOpen(false);
    setEditingTodo(null);
  };

  return (
    <div className="App">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterStatus={filterStatus} // Pass filterStatus to Header
        setFilterStatus={setFilterStatus} // Pass setFilterStatus to Header
      />

      <button className="add-todo-btn" onClick={openPopup}>
        Add task
      </button>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{editingTodo ? 'Edit Task' : 'Add New Task'}</h2>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add new task..."
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button onClick={editingTodo ? handleEditTodo : handleAddTodo}>
              {editingTodo ? 'Save Changes' : 'Add New'}
            </button>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <ul className="todo-list">
        {todos
          .filter(todo => 
            todo.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterPriority === '' || todo.priority === filterPriority) &&
            (filterStatus === '' || todo.status === filterStatus) // Apply filter by status
          )
          .map(todo => (
            <li key={todo.id} className={`todo-card ${todo.priority} ${todo.status} ${todo.completed ? 'completed' : ''}`}>
              <div>
                <span onClick={() => toggleComplete(todo.id)}>{todo.text}</span>
                <div className="meta">
                  <span className="tag">{todo.priority}</span>
                  <span className="status">{todo.status}</span>
                  <span className="date">
                    {new Date(todo.createdAt).toLocaleDateString()} - {new Date(todo.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="actions">
                <button onClick={() => openEditPopup(todo)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => deleteTodo(todo.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;

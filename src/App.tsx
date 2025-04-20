import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

type Priority = 'low' | 'medium' | 'high';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | "">(''); // Cập nhật kiểu cho filterPriority
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // State để mở/đóng popup
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null); // State để theo dõi task đang được chỉnh sửa

  // Khi component mount, tải todos từ localStorage
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Cập nhật todos vào localStorage mỗi khi todos thay đổi
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
      createdAt: new Date(),
    };

    setTodos((prevTodos) => [...prevTodos, todo]);
    setNewTodo('');
    setPriority('medium'); // reset về mặc định sau khi thêm
    setIsPopupOpen(false); // Đóng popup khi thêm thành công
  };

  const toggleComplete = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  const openPopup = () => {
    setEditingTodo(null); // Reset nếu không có task nào đang sửa
    setIsPopupOpen(true);
  };

  const openEditPopup = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.text); // Set lại nội dung cũ vào input
    setPriority(todo.priority); // Set lại độ ưu tiên cũ vào dropdown
    setIsPopupOpen(true); // Mở popup sửa
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleEditTodo = () => {
    if (newTodo.trim() === '') return;

    const updatedTodos = todos.map(todo =>
      todo.id === editingTodo?.id ? { ...todo, text: newTodo, priority: priority } : todo
    );
    setTodos(updatedTodos);
    setNewTodo('');
    setPriority('medium');
    setIsPopupOpen(false);
    setEditingTodo(null); // Reset state editingTodo
  };

  return (
    <div className="App">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />

      <button className="add-todo-btn" onClick={openPopup}>
        Add task
      </button>

      {/* Popup */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{editingTodo ? 'edit Task' : 'add new Task'}</h2>
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
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <button onClick={editingTodo ? handleEditTodo : handleAddTodo}>
              {editingTodo ? 'Save change' : 'Add new'}
            </button>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <ul className="todo-list">
        {todos
          .filter(todo => todo.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterPriority === '' || todo.priority === filterPriority))
          .map(todo => (
            <li key={todo.id} className={`todo-card ${todo.priority} ${todo.completed ? 'completed' : ''}`}>
              <div>
                <span onClick={() => toggleComplete(todo.id)}>{todo.text}</span>
                <div className="meta">
                  <span className="tag">{todo.priority}</span>
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

import { useState, useEffect } from 'react';
import { Check, Plus, Trash2, ListTodo } from 'lucide-react';
import './index.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks-demo');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, done

  useEffect(() => {
    localStorage.setItem('tasks-demo', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTasks([...tasks, { text: inputValue.trim(), done: false, id: Date.now() }]);
    setInputValue('');
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.done;
    if (filter === 'done') return task.done;
    return true;
  });

  return (
    <div className="app-container">
      <div className="header">
        <h1>Taskify</h1>
        <p>Stay organized, focused, and get things done.</p>
      </div>

      <form className="input-group" onSubmit={addTask}>
        <input 
          type="text" 
          placeholder="What needs to be done?" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">
          <Plus size={20} />
        </button>
      </form>

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''} 
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={filter === 'done' ? 'active' : ''} 
          onClick={() => setFilter('done')}
        >
          Done
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <ListTodo size={48} />
          <p>You have no tasks yet. Add one above!</p>
        </div>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task, index) => {
            // Find original index to pass to toggle/delete to avoid issues with filtered array
            const originalIndex = tasks.findIndex(t => t === task);
            return (
              <li key={task.id || originalIndex} className={`task-item ${task.done ? 'completed' : ''}`}>
                <div className="task-content" onClick={() => toggleTask(originalIndex)}>
                  <div className="task-checkbox">
                    {task.done && <Check size={16} strokeWidth={3} />}
                  </div>
                  <span className="task-text">{task.text}</span>
                </div>
                <button 
                  className="delete-btn" 
                  onClick={() => deleteTask(originalIndex)}
                  aria-label="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;

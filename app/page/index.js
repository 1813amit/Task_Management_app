import { useState } from 'react';
import './task.css';

const TaskManager = ({ initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'low' });
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle adding a new task
  const addTask = () => {
    const updatedTasks = [...tasks, { ...newTask, completed: false }];
    setTasks(updatedTasks);
    setNewTask({ title: '', description: '', priority: 'low' });
  };

  // Function to edit a task
  const editTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = newTask;
    setTasks(updatedTasks);
  };

  // Function to delete a task
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Function to toggle task completion
  const toggleCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  // Function to sort tasks by priority (high -> medium -> low)
  const sortTasks = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    setTasks(sortedTasks);
  };

  // Function to filter tasks based on the search term
  const filterTasks = (task) => {
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="container">
      <h1>Task Management App</h1>
      <div className="add-task">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        ></textarea>
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <button onClick={sortTasks} className="sort-btn">Sort by Priority</button>

      <ul className="task-list">
        {tasks.filter(filterTasks).map((task, index) => (
          <li key={index} className={`task ${task.priority} ${task.completed ? 'completed' : ''}`}>
            <div>
              <strong>{task.title}</strong> - {task.description} ({task.priority} priority)
            </div>
            <button onClick={() => toggleCompletion(index)}>
              {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
            </button>
            <button onClick={() => editTask(index)}>Edit</button>
            <button onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Server-side rendering function to fetch tasks
export async function getServerSideProps() {
  const initialTasks = [
    { title: 'Task 1', description: 'This is task 1', priority: 'high', completed: false },
    { title: 'Task 2', description: 'This is task 2', priority: 'medium', completed: true },
    { title: 'Task 3', description: 'This is task 3', priority: 'low', completed: false },
  ];
  return { props: { initialTasks } };
}

export default TaskManager;

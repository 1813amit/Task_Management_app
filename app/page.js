"use client"; // This is a Client Component

import { useState } from 'react';
import './task.css';

export default function Home() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Task 1', description: 'Description 1', priority: 'high', completed: false },
    { id: 2, title: 'Task 2', description: 'Description 2', priority: 'medium', completed: true },
    { id: 3, title: 'Task 3', description: 'Description 3', priority: 'low', completed: false },
  ]);

  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'low' });
  const [editableTaskId, setEditableTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to add or update task
  const addOrUpdateTask = () => {
    if (!newTask.title.trim() || !newTask.description.trim()) {
      alert('Title and description cannot be empty.');
      return;
    }

    if (editableTaskId === null) {
      const newId = tasks.length ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
      const updatedTasks = [...tasks, { ...newTask, id: newId, completed: false }];
      setTasks(updatedTasks);
    } else {
      const updatedTasks = tasks.map((task) =>
        task.id === editableTaskId ? { ...newTask, id: editableTaskId, completed: task.completed } : task
      );
      setTasks(updatedTasks);
      setEditableTaskId(null);
    }

    setNewTask({ title: '', description: '', priority: 'low' });
  };

  // Function to start editing a task
  const startEditTask = (id) => {
    setEditableTaskId(id);
    const taskToEdit = tasks.find((task) => task.id === id);
    setNewTask({ title: taskToEdit.title, description: taskToEdit.description, priority: taskToEdit.priority });
  };

  // Function to delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Function to delete all tasks
  const deleteAllTasks = () => {
    setTasks([]);
  };

  // Function to toggle task completion
  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Sort tasks by priority and completed status
  const getSortedTasks = () => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return tasks
      .filter(filterTasks)
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  };

  // Function to filter tasks based on the search term
  const filterTasks = (task) => {
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <div className="task-manager">
        <h1>Task Manager</h1>

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
          <button onClick={addOrUpdateTask}>
            {editableTaskId === null ? 'Add Task' : 'Save Task'}
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={deleteAllTasks}
          style={{
            margin: '10px 0',
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Delete All Tasks
        </button>

        <ul className="task-list">
          {getSortedTasks().map((task) => (
            <li key={task.id} className={`${task.completed ? 'completed' : 'pending'} ${task.priority}`}>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>

              <button
                onClick={() => toggleCompletion(task.id)}
                style={{
                  backgroundColor: task.completed ? '#0056b3' : 'gray',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {task.completed ? 'Completed' : 'Pending'}
              </button>

              <button onClick={() => startEditTask(task.id)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

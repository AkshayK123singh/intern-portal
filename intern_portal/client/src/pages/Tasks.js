// /client/src/pages/Tasks.js
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import './Tasks.css';

const Tasks = () => {
    const { currentUser, updateUserState } = useUser();
    const [tasks, setTasks] = useState(currentUser.tasks);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    const toggleTaskCompletion = async (taskId) => {
        const taskToUpdate = tasks.find(t => t.id === taskId);
        try {
            await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { completed: !taskToUpdate.completed });
            
            const updatedUserTasks = currentUser.tasks.map(task => 
                task.id === taskId ? { ...task, completed: !task.completed } : task
            );
            
            updateUserState({...currentUser, tasks: updatedUserTasks});
            setTasks(updatedUserTasks);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle) return;
        try {
            const newTask = { title: newTaskTitle, deadline: '2025-08-30' };
            const response = await axios.post('http://localhost:5000/api/tasks', newTask);
            
            const newUserTasks = [...currentUser.tasks, response.data];
            updateUserState({...currentUser, tasks: newUserTasks});
            setTasks(newUserTasks);
            setNewTaskTitle('');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
            
            const newUserTasks = currentUser.tasks.filter(t => t.id !== taskId);
            updateUserState({...currentUser, tasks: newUserTasks});
            setTasks(newUserTasks);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    if (!currentUser) {
        return <div className="loading">Loading tasks...</div>;
    }

    return (
        <div className="page-container tasks-page">
            <header className="page-header">
                <h2>My Tasks</h2>
                <p>Track your assignments and progress.</p>
            </header>
            
            <form className="add-task-form" onSubmit={handleAddTask}>
                <input 
                    type="text" 
                    placeholder="Add a new task..." 
                    value={newTaskTitle} 
                    onChange={(e) => setNewTaskTitle(e.target.value)} 
                    required 
                />
                <button type="submit">Add Task</button>
            </form>

            <div className="task-board">
                <div className="task-column">
                    <h3><i className="fas fa-list-ul"></i> To Do ({pendingTasks.length})</h3>
                    <div className="task-list">
                        {pendingTasks.map(task => (
                            <div key={task.id} className="task-card">
                                <h4>{task.title}</h4>
                                <p className="task-deadline">Deadline: {task.deadline}</p>
                                <div className="task-actions">
                                    <button onClick={() => toggleTaskCompletion(task.id)} className="action-btn done-btn"><i className="fas fa-check"></i></button>
                                    <button onClick={() => handleDeleteTask(task.id)} className="action-btn delete-btn"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="task-column">
                    <h3><i className="fas fa-check-circle"></i> Completed ({completedTasks.length})</h3>
                    <div className="task-list">
                        {completedTasks.map(task => (
                            <div key={task.id} className="task-card completed">
                                <h4>{task.title}</h4>
                                <p className="task-deadline">Completed!</p>
                                <div className="task-actions">
                                    <button onClick={() => toggleTaskCompletion(task.id)} className="action-btn undo-btn"><i className="fas fa-undo"></i></button>
                                    <button onClick={() => handleDeleteTask(task.id)} className="action-btn delete-btn"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
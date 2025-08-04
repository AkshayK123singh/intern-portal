// /server/controllers/taskController.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/tasks.json');

const readData = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading tasks data file:", error);
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing data file:", error);
    }
};

exports.getAllTasks = (req, res) => {
    const tasks = readData();
    res.json(tasks);
};

exports.createTask = (req, res) => {
    const tasks = readData();
    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        ...req.body,
        completed: false
    };
    tasks.push(newTask);
    writeData(tasks);
    res.status(201).json(newTask);
};

exports.updateTask = (req, res) => {
    const tasks = readData();
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...req.body };
        writeData(tasks);
        res.json(tasks[index]);
    } else {
        res.status(404).send('Task not found');
    }
};

exports.deleteTask = (req, res) => {
    let tasks = readData();
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
    if (tasks.length < initialLength) {
        writeData(tasks);
        res.status(200).send('Task deleted successfully');
    } else {
        res.status(404).send('Task not found');
    }
};
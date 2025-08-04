// /server/controllers/projectController.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/projects.json');

const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading data file at ${filePath}:`, error);
        return [];
    }
};

const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Error writing data file at ${filePath}:`, error);
    }
};

exports.getAllProjects = (req, res) => {
    const projects = readData(dataPath);
    res.json(projects);
};

exports.createProject = (req, res) => {
    const projects = readData(dataPath);
    const { name, description } = req.body;
    
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    
    const newProject = {
        id: newId,
        name,
        description,
        status: "In Progress",
        deadline: "2025-12-31"
    };

    projects.push(newProject);
    writeData(dataPath, projects);
    res.status(201).json(newProject);
};
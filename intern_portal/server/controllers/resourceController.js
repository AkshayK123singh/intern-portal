// /server/controllers/resourceController.js
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/resources.json');

const readData = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading resources data file:", error);
        return [];
    }
};

exports.getAllResources = (req, res) => {
    const resources = readData();
    res.json(resources);
};
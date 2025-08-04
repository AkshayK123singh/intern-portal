// /server/controllers/userController.js
const fs = require('fs');
const path = require('path');
const userDataPath = path.join(__dirname, '../data/users.json');
const tasksDataPath = path.join(__dirname, '../data/tasks.json');
const projectsDataPath = path.join(__dirname, '../data/projects.json');

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

const hydrateUser = (user) => {
    const allTasks = readData(tasksDataPath);
    const allProjects = readData(projectsDataPath);
    return {
        ...user,
        tasks: user.tasks.map(taskId => allTasks.find(t => t.id === taskId)).filter(Boolean),
        projects: user.projects.map(projectId => allProjects.find(p => p.id === projectId)).filter(Boolean)
    };
};

const getRandomProfilePicture = () => {
    const pictures = [
        "https://randomuser.me/api/portraits/men/1.jpg",
        "https://randomuser.me/api/portraits/women/2.jpg",
        "https://randomuser.me/api/portraits/men/3.jpg",
        "https://randomuser.me/api/portraits/women/4.jpg",
        "https://randomuser.me/api/portraits/men/5.jpg",
        "https://randomuser.me/api/portraits/women/6.jpg",
        "https://randomuser.me/api/portraits/men/7.jpg",
        "https://randomuser.me/api/portraits/women/8.jpg",
        "https://randomuser.me/api/portraits/men/9.jpg",
        "https://randomuser.me/api/portraits/women/10.jpg"
    ];
    return pictures[Math.floor(Math.random() * pictures.length)];
};

exports.getAllUsers = (req, res) => {
    const users = readData(userDataPath).map(hydrateUser);
    res.json(users);
};

exports.getUserById = (req, res) => {
    const users = readData(userDataPath);
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(hydrateUser(user));
    } else {
        res.status(404).send('User not found');
    }
};

exports.createUser = (req, res) => {
    const users = readData(userDataPath);
    const { username, role } = req.body;
    
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    const newUser = { 
        id: newId, 
        username,
        role,
        email: `${username.replace(' ', '.').toLowerCase()}@example.com`,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        referralCode: `${username.substring(0, 4).toUpperCase()}2025`,
        donationsRaised: 0, 
        referralCount: 0,
        rewardsUnlocked: [], 
        profilePicture: getRandomProfilePicture(),
        tasks: [], 
        projects: [] 
    };

    users.push(newUser);
    writeData(userDataPath, users);
    res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
    const users = readData(userDataPath);
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        const rewards = {
            5000: "Certificate of Excellence",
            15000: "Company Merchandise",
            25000: "Top Performer Badge",
            30000: "Leadership Award"
        };

        let updatedUser = { ...users[index], ...req.body };
        
        const updatedDonations = updatedUser.donationsRaised;
        for (const [amount, reward] of Object.entries(rewards)) {
            if (updatedDonations >= parseInt(amount) && !updatedUser.rewardsUnlocked.includes(reward)) {
                updatedUser.rewardsUnlocked.push(reward);
            }
        }

        if (req.body.taskToAssign) {
            const taskId = parseInt(req.body.taskToAssign);
            if (!updatedUser.tasks.includes(taskId)) {
                updatedUser.tasks.push(taskId);
            }
        }
        
        if (req.body.projectToAssign) {
            const projectId = parseInt(req.body.projectToAssign);
            if (!updatedUser.projects.includes(projectId)) {
                updatedUser.projects.push(projectId);
            }
        }

        if (req.body.projectToRemove) {
            const projectId = parseInt(req.body.projectToRemove);
            updatedUser.projects = updatedUser.projects.filter(pId => pId !== projectId);
        }
        
        users[index] = updatedUser;
        writeData(userDataPath, users);
        
        // --- The key fix is here ---
        // Return the fully hydrated user object
        res.json(hydrateUser(updatedUser));

    } else {
        res.status(404).send('User not found');
    }
};

exports.deleteUser = (req, res) => {
    let users = readData(userDataPath);
    const initialLength = users.length;
    users = users.filter(u => u.id !== parseInt(req.params.id));
    if (users.length < initialLength) {
        writeData(userDataPath, users);
        res.status(200).send('User deleted successfully');
    } else {
        res.status(404).send('User not found');
    }
};
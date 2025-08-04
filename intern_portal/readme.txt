
For the best user experience, consider using Windows Subsystem for Linux (WSL) to install the dependencies.

Installation & Running the Application
Installation Steps
Clone the repository:


---->git clone <https://github.com/AkshayK123singh/intern-portal>   or download the code directly from the repository 
Navigate to the project folder:


----->cd intern_portal


Install backend dependencies:
------>cd server
------>npm install


Install frontend dependencies:
------>cd ../client
------>npm install
Running the Application
The application consists of two parts (frontend and backend) that must run simultaneously.


Start the Backend Server
Open a new terminal, navigate to the /intern_portal/server directory, and run:
---->npm start
The terminal should show: Server running on port 5000.


Start the Frontend Application
Open a second terminal, navigate to the /intern_portal/client directory, and run:
----->npm start
The application will automatically open in your browser at http://localhost:3000.



If you encounter a blank page, ensure both the backend and frontend are running simultaneously in separate terminal windows.

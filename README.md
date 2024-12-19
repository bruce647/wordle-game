Wordle Game
A web-based Wordle game built with Vite and React for the frontend, and PHP with SQL for the backend.
![974be914d9dca86d28c0553ae41860d](https://github.com/user-attachments/assets/ab50c8b7-52e1-4cc0-a686-b23b7b031192)

Tech Stack
Frontend: Vite, React
Backend: PHP, SQL 
Styling: TailwindCSS
Features
A fully playable Wordle game.
Responsive design for various screen sizes.
Backend to handle word generation and store game data (optional for saving scores, user history, etc.).
Installation
Frontend Setup
Clone the repository:

bash
Copy code
git clone https://github.com/bruce647/wordle-game.git
Navigate to the frontend directory:

bash
Copy code
cd wordle-game/frontend
Install the dependencies using npm:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm run dev
The frontend will be available at http://localhost:3000.

Backend Setup
Navigate to the backend directory:

bash
Copy code
cd wordle-game/server
Set up a local PHP server (or configure your server environment).

Configure the database:

Create a database in your SQL server.
Import the provided SQL schema (found in server/sql).
Configure database connection details in the PHP files.

Usage
Frontend: The game interface allows users to guess words based on the clues provided. It will make API calls to the backend for word generation and game logic.

Backend: The PHP server handles word generation, tracks game progress, and stores user data if needed.

Contributing
If you'd like to contribute to this project:

Fork the repository.
Create a new branch for your feature or bug fix.
Commit your changes.
Push your branch to your fork.
Submit a pull request.
License
This project is licensed under the MIT License - see the LICENSE file for details.

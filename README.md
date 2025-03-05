# FullStack Auth Project

A full-stack web application that provides secure user authentication and enquiry functionality. The application allows users to sign up, log in, and log out. Once logged in, users are redirected to a welcome home page and can access an enquiry form that sends an email to a designated recipient using Nodemailer.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Backend Endpoints](#backend-endpoints)
- [Enquiry Functionality](#enquiry-functionality)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Secure signup, login, and logout functionality.
- **Session Management:** Sessions maintained on the backend with Express and on the frontend via localStorage.
- **Protected Routes:** Only authenticated users can access protected pages (Home, Enquiry).
- **Enquiry Form:** Allows logged-in users to send enquiries that are emailed to a designated recipient.
- **Responsive UI:** Clean, modern design using React Bootstrap components.

## Technologies Used

- **Frontend:**
  - React with Next.js
  - React Bootstrap for UI components
  - Axios for API calls
- **Backend:**
  - Node.js with Express.js
  - MySQL (hosted on AWS RDS) for data storage
  - Nodemailer for sending enquiry emails
  - dotenv for managing environment variables

## Project Structure

```
fullstack-auth-project/
├── backend/
│   ├── index.js          # Express server and API endpoints
│   ├── package.json
│   └── .env              # Backend environment variables
├── frontend/
│   ├── pages/
│   │   ├── _app.js       # Custom App for global CSS (Bootstrap, globals.css)
│   │   ├── home.js       # Home page (protected)
│   │   ├── login.js      # Login page
│   │   ├── signup.js     # Signup page
│   │   └── enquiry.js    # Enquiry form page (protected)
│   ├── components/
│   │   └── Navbar.js     # Reusable Navbar component (appears on protected pages)
│   ├── utils/
│   │   └── api.js        # Axios instance for API calls
│   ├── package.json
│   └── styles/
│       └── globals.css   # Global CSS styles
└── README.md             # Project documentation (this file)
```

## Installation

### Prerequisites

- Node.js (v20+)
- npm (v10+)
- MySQL (AWS RDS or local instance)
- Git (optional)

### Clone the Repository

```bash
git clone <repository_url>
cd fullstack-auth-project
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder with the following variables:
   ```env
   DB_HOST=your_aws_rds_host
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=fullstack_auth_db
   DB_PORT=3306
   SESSION_SECRET=your_session_secret
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   node index.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create or update `pages/_app.js` to include Bootstrap CSS:
   ```jsx
   // pages/_app.js
   import 'bootstrap/dist/css/bootstrap.min.css';
   import '../styles/globals.css';

   function MyApp({ Component, pageProps }) {
     return <Component {...pageProps} />;
   }

   export default MyApp;
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Your frontend should now be accessible at [http://localhost:3000](http://localhost:3000).

## Configuration

### Environment Variables

- **Backend (.env):**
  - `DB_HOST`: AWS RDS endpoint (or your MySQL host)
  - `DB_USER`: MySQL username
  - `DB_PASSWORD`: MySQL password
  - `DB_NAME`: Database name (`fullstack_auth_db`)
  - `DB_PORT`: MySQL port (usually `3306`)
  - `SESSION_SECRET`: A strong, random secret for session management (generate one using Node's crypto module)
  - `PORT`: Port on which the backend runs (default `5000`)

### Email Setup (Nodemailer)

- In your backend's `index.js`, update the Nodemailer configuration:
  ```js
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yourgmailaccount@gmail.com',          // Your Gmail address
      pass: 'your_app_specific_password',            // Use an app password if 2FA is enabled
    },
  });
  ```
- For production, secure these credentials using environment variables.

## Running the Application

- **Start the Backend:**
  ```bash
  cd backend
  node index.js
  ```
- **Start the Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```
The application will run with the backend on [http://localhost:5000](http://localhost:5000) and the frontend on [http://localhost:3000](http://localhost:3000).

## Backend Endpoints

- **POST /api/signup:**  
  Registers a new user.  
  Request Body: `{ username, email, password }`

- **POST /api/login:**  
  Authenticates a user and creates a session.  
  Request Body: `{ email, password }`

- **POST /api/logout:**  
  Logs out the user and destroys the session.

- **GET /api/home:**  
  Protected route that returns a welcome message if the user is authenticated.

- **POST /api/enquiry:**  
  Receives enquiry form data and sends an email to `mohammadraheman7864@gmail.com`.  
  Request Body: `{ name, email, message }`

## Enquiry Functionality

- **Enquiry Form:**  
  Located on the `/enquiry` page. The form collects the user's name, email, and message.
- **Email Sending:**  
  When the form is submitted, the data is sent to the `/api/enquiry` endpoint.  
  Nodemailer processes the request and sends an email with the enquiry details to the designated recipient.

## Security Considerations

- **Credentials:**  
  Store all sensitive credentials in environment variables and avoid hardcoding them.
- **Session Management:**  
  Use a strong `SESSION_SECRET` and secure cookies in production.
- **Email Authentication:**  
  Use Gmail App Passwords or OAuth2 for secure email sending with Nodemailer.
- **HTTPS:**  
  Use HTTPS in production to secure data transmission.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

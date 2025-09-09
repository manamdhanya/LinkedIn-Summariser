# Resume Summariser

A Node.js + Express web application that generates concise summaries of profiles.  
The project is structured with controllers, routes, services, models, middleware and EJS views for a clean and modular design.

---

## 🚀 Features

- Summarises profile data into easy-to-read text  
- Follows MVC architecture (Models, Views, Controllers)  
- Uses **EJS templates** for rendering views  
- Scalable project structure with separate service and middleware layers  

---

## 📂 Project Structure

```bash
LinkedIn-Summariser/
│── app.js             # Main application entry point
│── connect.js         # Database / connection setup
│── package.json       # Dependencies and scripts
│── package-lock.json  # Dependency lock file
│── .gitignore         # Ignored files
├── controllers/       # Handles incoming requests and responses
├── middleware/        # Custom middleware functions
├── models/            # Data schemas or structures
├── routes/            # API / web routes
├── service/           # Core business logic
└── views/             # EJS templates for frontend rendering
```


## 🛠️ Tech Stack

- **Node.js** – Runtime environment  
- **Express.js** – Web framework  
- **EJS** – View templating  
- **MongoDB (or other DB)** – For storing and retrieving profile data (configured in `connect.js`)  

## ⚙️ Installation

1. Clone the repository:
   ```
   git clone https://github.com/manamdhanya/LinkedIn-Summariser.git
   cd LinkedIn-Summariser
   ```

3. Install dependencies:
   ```
   npm install
   ```
   
5. Run the server:
   ```
    npm start
   ```
   or
   
   ```
    node app.js
   ```
   

## ▶️ Usage

1. Open your browser and visit:

   ```
   http://localhost:5002
   ```
2. Enter LinkedIn profile details
3. Upload the resume document
4. Get a summarised output of the profile

# Node.js Note Management API

This Node.js API provides functionality for managing notes, including user authentication, CRUD operations on notes, sharing notes, and searching notes.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>

1. Install Dependencies:

npm install

2. Set Up Environment Variables:

Create a .env file in the root directory and add the following configuration:

.env

MONGO_URL=<your-mongodb-url>

JWT_SECRET=<your-jwt-secret>

PORT=<your-preferred-port>

3. Usage
Run the application:

npm start

The API will be accessible at http://localhost:<your-preferred-port>.


#API Endpoints
##GET /api/notes:
Get a list of all notes for the authenticated user.

##GET /api/notes/:id:
Get a note by ID for the authenticated user.

##POST /api/notes:
Create a new note for the authenticated user.

##PUT /api/notes/:id:
Update an existing note by ID for the authenticated user.

##DELETE /api/notes/:id:
Delete a note by ID for the authenticated user.

##POST /api/notes/:id/share:
Share a note with another user for the authenticated user.

##GET /api/search?q=:query:
Search for notes based on keywords for the authenticated user.


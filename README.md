# Express.js TypeScript Image File CRUD API

This project is an Express.js CRUD API built with TypeScript, allowing users to perform Create, Read, Update, and Delete operations. It handles multiple image uploads with user-based restrictions, implements signup and sign-in functionality, and utilizes token-based authentication for protected routes.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This API provides a robust backend to manage user-related data, including image uploads, while implementing secure authentication through tokens.

### Technologies Used

- Express.js
- TypeScript
- JWT for authentication
- Multer to handle multipart/form-data
- CORS to control Resource Sharing

---

## Features

- **CRUD Operations:** Perform Create, Read, Update, and Delete operations on user data.
- **Multiple Image Uploads:** Allows users to upload as much as four images at a time. Users are restricted to a max storage of 10 photos.
- **Signup and Sign-in:** User authentication through signup and sign-in endpoints.
- **Token-Based Authentication:** Secure API endpoints using JWT tokens.

---

## Prerequisites

- Node.js and npm installed
- MongoDB or any preferred database setup and connection details

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Brayzonn/saver.git

2. Navigate to the project directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```


## Usage

### Development
 Start the development server with nodemon

   ```bash
   npm run dev
   ```
# Production
 Start the development server with nodemon

   ```bash
   npm start
   ```

## Endpoints

### All Routes

| Endpoint             | Description             | Authentication | Response                     |
|----------------------|-------------------------|----------------|------------------------------|
| `GET /api/getimages` | Retrieve all user images.| Required      | JSON objects of user in Header and imagepaths |
| `POST /api/signup` | Register a new user.      | Not required   | JSON object with response message|
| `POST /api/signin` | Authenticate user.        | Not required   | JSON object with user details and token |
| `POST /api/uploadimages` | Upload max 4 images at once and total 10 images per user          | Required       | JSON object with response message
| `DELETE /api/deleteimage`| delete an image     | Required       | JSON object with response message

## Authentication
This API uses token-based authentication for protected routes. Users need to sign in to obtain a token, which should be included in the header of authenticated requests.


## Contributing
Contributions are welcome! Fork the repository, create a new branch, make your changes, and open a pull request.


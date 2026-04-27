# Wanderlust Airbnb Clone

## Project Overview
Wanderlust is a web application that mimics the functionality of Airbnb, providing a platform for users to book lodging and offer their properties for rent. This project aims to deliver a seamless user experience, leveraging modern web technologies.

## Features
- User registration and authentication
- Property listing and bookings
- User profiles and transaction history
- Advanced search filters for lodging
- Secure payment processing
- Reviews and ratings system

## Tech Stack
- **Frontend:** React.js, Redux, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Heroku / AWS

## Installation
### Prerequisites
- Node.js (v12 or above)
- MongoDB

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Sahil-Lathiya/Wanderlust-Clone.git
   cd Wanderlust-Clone
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory and add the necessary configurations.
4. Start the application:
   ```bash
   npm start
   ```

## Usage
- Access the application at `http://localhost:3000` after starting the server.
- Follow the on-screen instructions to register or log in.

## Project Structure
```
/Wanderlust-Clone
|-- /client          # Frontend code
|-- /server          # Backend code
|-- /models          # Database models
|-- /routes          # API routes
|-- /config          # Configuration files
|-- README.md        # Documentation
```

## Database Models
- **User:** Represents the user with fields for name, email, password, and profile information.
- **Property:** Contains details about the listings such as title, description, price, location, and images.
- **Booking:** Records user bookings with references to the user and property.
- **Review:** Captures user reviews associated with properties.

## API Routes
- **User Routes:** `/api/users`
- **Property Routes:** `/api/properties`
- **Booking Routes:** `/api/bookings`
- **Review Routes:** `/api/reviews`

## Authentication
- Users can sign up and sign in using JWT for secure sessions.
- Passwords are hashed for security using bcrypt.

## Deployment
The application can be deployed using platforms like Heroku or AWS. Follow the specific instructions on the respective documentation for deploying Node.js applications. 

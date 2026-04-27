# Wanderlust Clone

## Project Overview
Wanderlust Clone is a web application designed for users to explore and create travel listings, read and write reviews, and manage user authentication through a seamless interface.

## Tech Stack
- **Node.js**: The application server is built using Node.js, providing a scalable network application.
- **Express**: We utilize Express.js to simplify routing and middleware management.
- **MongoDB**: The data is stored in a MongoDB database to ensure a flexible schema design, allowing for easy data manipulation.
- **EJS**: Embedded JavaScript templating is used for rendering dynamic web pages.
- **Passport.js**: For user authentication, Passport.js offers a simple and reliable way to manage user sessions.

## Features
- **Listings**: Users can view and create travel listings.
- **Reviews**: Users are able to write reviews on listings they've visited.
- **User Authentication**: Registration and login functionality to ensure a personalized experience for users.

## Deployment
The application is deployed on **Render**, enabling high availability and ease of access for users.

## Project Structure
```
Wanderlust-Clone/
├── models/
│   ├── User.js
│   ├── Listing.js
│   ├── Review.js
├── routes/
│   ├── api/
│   │   ├── listings.js
│   │   ├── reviews.js
│   │   ├── users.js
│   ├── index.js
├── views/
│   ├── listings/  
│   ├── reviews/
│   ├── users/
└── app.js
```

## Database Models
### User
- **username**: String
- **password**: String
- **email**: String

### Listing
- **title**: String
- **description**: String
- **location**: String
- **userId**: Ref to User model

### Review
- **content**: String
- **userId**: Ref to User model
- **listingId**: Ref to Listing model

## API Routes
- **GET /api/listings**: Retrieves all listings.
- **POST /api/listings**: Creates a new listing.
- **GET /api/reviews**: Retrieves all reviews for a listing.
- **POST /api/reviews**: Adds a new review.

## Authentication with Passport.js
- User registration and login is managed via Passport.js, ensuring secure and efficient user sessions.
- Sessions are stored in the database to maintain state across server requests.

## Cloudinary Integration
Images for listings are uploaded and managed using Cloudinary to provide robust media hosting and transformation abilities.

## Environment Variables Setup
Ensure to set the following environment variables:
- `MONGODB_URI`
- `SESSION_SECRET`
- `CLOUDINARY_URL`

## Installation and Usage
1. Clone the repository: `git clone https://github.com/Sahil-Lathiya/Wanderlust-Clone`
2. Navigate to the project folder: `cd Wanderlust-Clone`
3. Install dependencies: `npm install`
4. Set up your environment variables in a `.env` file.
5. Run the application: `npm start`

Visit `http://localhost:3000` to view the application in your browser.
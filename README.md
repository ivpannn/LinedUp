# LinedUp

A mobile queue management app that lets users join restaurant queues remotely and allows admins to manage queue flow in real time.


## Features

### User
- Register and Login
- Browse restaurants with estimated wait times
- Join queue system
- Queue cancellation
- Queue status tracking
- View your queue number and estimated wait time

### Admin
- View all active queues for the day
- Call the next queue in line
- Mark a queue as completed
- View completed queues for the day
- Queue numbers reset automatically every day at midnight

## Tech Stack

Frontend:
- React Native Expo
- TypeScript
- Axios

Backend:
- Node.js
- Express
- Prisma ORM
- PostgreSQL

## Installation

### Backend

cd server

npm install

npx prisma migrate dev

npm run dev

### Mobile

cd mobile

npm install

npx expo start
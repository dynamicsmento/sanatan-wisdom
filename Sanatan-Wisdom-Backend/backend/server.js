require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const seedDatabase = require('./config/seed');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception Error: ${err.message}`);
  console.error('Shutting down server due to uncaught exception...');
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

// Connect to Database and Seed data
connectDB().then(async () => {
  await seedDatabase();
  
  // Start server
  const server = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    console.error('Shutting down server due to unhandled promise rejection...');
    server.close(() => {
      process.exit(1);
    });
  });
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

// Start the server using the configured app (routes + static serving)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

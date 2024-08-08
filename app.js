import 'dotenv/config'
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import connectDB from './db/connect.js';

import listingRouter from './routes/listingRouter.js';
import contestRouter from './routes/contestRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
  (async () => {
    try {
      await connectDB(process.env.MONGO_URL);
    } catch (error) {
      console.log(error);
    }
  })()

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use("/", listingRouter);
app.use('/contests', contestRouter);
app.use('/', userRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
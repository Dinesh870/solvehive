import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cookieParser from "cookie-parser";
import methodOverride from 'method-override';

import connectDB from "./db/connect.js";
import listingRouter from "./routes/listingRouter.js";
import contestRouter from "./routes/contestRouter.js";
import userRouter from "./routes/userRouter.js";
import ExpressError from "./utils/error.js";
import { isLoggedOut } from "./utils/utils.js";
import feedbackRouter from "./routes/feedbackRouter.js";
import problemOfTheDayRouter from "./routes/problemOfTheDayRouter.js";

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

// Middleware to override the HTTP method
app.use(methodOverride('_method'));

// Connect to MongoDB
(async () => {
  try {
    await connectDB(process.env.MONGO_URL);
  } catch (error) {
    console.log(error);
  }
})();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse cookies
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static(join(__dirname, "public")));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.get("/",(req, res) => {
  const isTrue = isLoggedOut(req, res);
  res.render("listings/home.ejs", { isTrue });
});

// Route handlers
app.use("/problems", listingRouter);
app.use("/contests", contestRouter);
app.use("/", userRouter);
app.use("/", feedbackRouter);
app.use('/', problemOfTheDayRouter);

// Handle 404 errors
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {  
  const { status = 500, message = "Internal Server Error" } = err;
  res.status(status).render("./listings/error.ejs", { status, message });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

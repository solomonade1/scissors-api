import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import { connectDb } from "./config/dbConnect.js";
import urlRouter from "./routes/url.routes.js";
import authRoute from "./routes/auth.route.js";
import clickRoute from "./routes/clicks.route.js";
// import scheduleActive from "./utils/schedule/activeSchedule.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;
// Configure CORS to allow requests from your Nuxt 3 application (http://localhost:3000)
const corsOptions = {
  origin: process.env.CLIENT_URL, // Replace with your client's URL in production
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies to be sent along with the request
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,  // Change this to a secure random key
  resave: false,
  saveUninitialized: true,
  cookie: {
    domain: process.env.CLIENT_URL,
    sameSite: 'None',
    secure: true, // Make sure this is set to true for HTTPS
  },
}));

// //schedule active property of the URL
// scheduleActive()

app.use("/api/v1", urlRouter);
app.use("/api/v1", authRoute);
app.use("/api/v1", clickRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went Wrong !!!";
  const errorStack = err.stack;

  return res.status(errorStatus).json({
    status: errorStatus,
    message: errorMessage,
    stack: errorStack,
  });
});

app.listen(PORT, () => {
  connectDb();
  console.log(`App is running on Port ${PORT}`);
});

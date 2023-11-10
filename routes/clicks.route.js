import express from "express";
import { getUserUrlsClicks } from "../controller/clicks.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const clickRoute = express.Router();

clickRoute.get("/clicks/url", verifyToken, getUserUrlsClicks);

export default clickRoute;

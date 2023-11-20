import express from "express";
import {
  createUrl,
  deleteUrlById,
  getAllUlr,
  getSingleUrl,
  getUnRegisterUserUrls,
  getUserUrls,
  getUserUrlsClickInfo,
  redirectUrl,
  shortenUrl,
  unRegisterUrl,
  updateUrl,
  updateUrlNow,
} from "../controller/url.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
import { loginLimiter, sessionLimiter } from "../utils/limiter.js";
const urlRouter = express.Router();

urlRouter.post("/url", verifyToken, loginLimiter, createUrl);
urlRouter.post("/url/unregister", sessionLimiter, unRegisterUrl);
urlRouter.get("/url/all", verifyToken, getAllUlr);
//urlRouter.get("/:urlId", redirectUrl)
urlRouter.get("/:urlId", shortenUrl);
urlRouter.get("/url/single/:id", verifyToken, getSingleUrl);
urlRouter.get("/url/users", verifyToken, getUserUrls);
urlRouter.get("/url/infos/:id", verifyToken, getUserUrlsClickInfo);
urlRouter.get("/url/users/unregister", sessionLimiter, getUnRegisterUserUrls);
urlRouter.put("/url/update/:id", verifyToken, updateUrl);
urlRouter.put("/url/updatenow/:id", verifyToken, updateUrlNow);
urlRouter.delete("/url/delete/:id", verifyToken, deleteUrlById);

export default urlRouter;

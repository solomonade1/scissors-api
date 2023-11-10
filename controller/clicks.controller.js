import Click from "../models/Click.model.js";

export const getUserUrlsClicks = async (req, res, next) => {
  const userName = req.user;
  try {
    console.log("USERNAME =>", userName);
    res.status(200).json(userName);
  } catch (error) {
    next(error);
  }
};

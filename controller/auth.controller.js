import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/createError.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) return next(createError(404, "Usename or Email taken!!!"));
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    // console.log("IP=> ", req.ip)
    const user = await User.findOne({ $or: [{ username }, { email }] });
    // const email = await User.findOne({email: req.body.email})
    if (!user) return next(createError(404, "User not found!"));
    bcrypt
      .compare(password, user.password)
      .then((result) => {
        if (result) {
          //   console.log("authentication successful");
          // do stuff
          const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT
          );
          const { password, isAdmin, ...otherDetails } = user._doc;
          res
            .cookie("access_token", token, {
              httpOnly: true,
            })
            .status(200)
            .json(otherDetails);
        } else {
          //   console.log("authentication failed. Password doesn't match");
          // do other stuff
          next(createError(400, "Wrong Password or Username"));
        }
      })
      .catch((err) => console.error(err));
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  try {
    // Clear the access token cookie to log the user out
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    // Get the access_token cookie from the request
    const token = req.cookies.access_token;

    if (!token) {
      // If the cookie is not present, the user is not authenticated
      return next(createError(401, "You are not authorized!, Please Login"));
    }

    // Verify the token to get the user's ID and other information
    const decoded = jwt.verify(token, process.env.JWT);

    if (!decoded.id) {
      return next(createError(401, "You are not authorized!"));
    }

    // Use the user's ID to fetch their information from the database
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(createError(404, "User not Found!!!"));
    }
    const { password, isAdmin, ...otherDetails } = user._doc;

    // User is authenticated, you can use 'user' for further processing
    res.status(200).json(otherDetails);
  } catch (err) {
    next(err);
  }
};

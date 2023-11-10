import Url from "../models/Url.model.js";
import Click from "../models/Click.model.js";
import User from "../models/User.model.js";
import { nanoid } from "nanoid";
import { validateUrl } from "../utils/validateUrl.js";
import { createError } from "../utils/createError.js";
import QRCode from "qrcode";
import IP from "ip";
import axios from "axios";

export const createUrl = async (req, res, next) => {
  const { originalUrl } = req.body;
  const { urlAlias } = req.body;
  const base = process.env.BASE;
  const urlId = nanoid(5);
  const userIp = req.ip;
  const userId = req.user.id;

  try {
    const validUrl = validateUrl(originalUrl);

    if (!validUrl) {
      return next(createError(400, "Url not Valid!!!"));
    }
    if (validUrl) {
      if (urlAlias?.length !== 0) {
        const aliasExist = await Url.findOne({ urlId: req.body.urlAlias });
        if (aliasExist) {
          return next(createError(400, "Short Url alrady Exist!!!"));
        }
      }

      let url = await Url.findOne({ originalUrl });
      if (url) {
        return next(
          createError(400, "Short Url for this URL already created!!!")
        );
      } else {
        const alias = req.body.urlAlias;

        if (!alias) {
          const shortUrl = `${base}/${urlId}`;
          const shortUrlExist = await Url.findOne({ shortUrl: shortUrl });

          if (shortUrlExist) {
            return next(
              createError(400, "Alias already exist, Create another one")
            );
          }
          const qrCode = await QRCode.toDataURL(shortUrl);
          if (!qrCode) {
            return next(createError(404, "QR code not generated!!!"));
          }
          url = new Url({
            userId: userId,
            originalUrl,
            shortUrl,
            urlId,
            qrCode,
            createdByIp: userIp,
            clickOrigins: {},
          });

          await url.save();
          res.status(201).json(url);
        } else {
          const shortUrl = `${base}/${alias}`;
          const qrCode = await QRCode.toDataURL(shortUrl);
          if (!qrCode) {
            return next(createError(404, "QR code not generated!!!"));
          }
          url = new Url({
            userId: userId,
            originalUrl,
            shortUrl,
            urlId: alias,
            qrCode,
            createdByIp: userIp,
            clickOrigins: {},
          });
          await url.save();
          res.json(url);
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

export const unRegisterUrl = async (req, res, next) => {
  const { originalUrl } = req.body;
  const { urlAlias } = req.body;
  const base = process.env.BASE;
  const urlId = nanoid(5);
  const userIp = req.ip;

  try {
    const validUrl = validateUrl(originalUrl);

    if (!validUrl) {
      return next(createError(400, "Url not Valid!!!"));
    }
    if (validUrl) {
      const countUrl = await Url.countDocuments({
        userId: null,
        createdByIp: userIp,
      });
      if (countUrl >= 5) {
        return next(
          createError(
            400,
            "You have reached the maximum limit of shortened URLs for unregistered users."
          )
        );
      } else {
        if (urlAlias?.length !== 0) {
          const aliasExist = await Url.findOne({ urlId: req.body.urlAlias });
          if (aliasExist) {
            return next(createError(400, "Short Url alrady Exist!!!"));
          }
        }

        let url = await Url.findOne({ originalUrl });
        if (url) {
          return res.status(200).json({
            message: "URL already Created!",
            data: url,
          });
        } else {
          const alias = req.body.urlAlias;
          if (!alias) {
            const shortUrl = `${base}/${urlId}`;
            const shortUrlExist = await Url.findOne({ shortUrl: shortUrl });
            if (shortUrlExist) {
              return next(
                createError(400, "Alias already exist, Create another one")
              );
            }
            const qrCode = await QRCode.toDataURL(shortUrl);
            if (!qrCode) {
              return next(createError(404, "QR code not generated!!!"));
            }
            // console.log(qrCode)
            url = new Url({
              userId: null,
              originalUrl: originalUrl,
              shortUrl,
              urlId,
              qrCode,
              createdByIp: userIp,
              clickOrigins: {},
            });
            await url.save();
            res.status(201).json(url);
          } else {
            const shortUrl = `${base}/${alias}`;
            const qrCode = await QRCode.toDataURL(shortUrl);
            if (!qrCode) {
              return next(createError(404, "QR code not generated!!!"));
            }
            url = new Url({
              userId: null,
              originalUrl,
              shortUrl,
              urlId: alias,
              qrCode,
              createdByIp: userIp,
              clickOrigins: {},
            });
            await url.save();
            res.json(url);
          }
        }
      }
    }
  } catch (err) {
    next(err);
  }
};
export const updateUrl = async (req, res, next) => {
  const { originalUrl } = req.body;
  const { urlAlias } = req.body;
  const base = process.env.BASE;
  const urlId = nanoid(5);
  const userIp = req.ip;
  const userId = req.user.id;

  try {
    const validUrl = validateUrl(originalUrl);
    let url = await Url.findOne({ originalUrl, _id: { $ne: req.params.id } });
    if (url) {
      return next(
        createError(400, "Short Url for this URL already created!!!")
      );
    }
    if (!validUrl) {
      return next(createError(400, "Url not Valid!!!"));
    }
    if (validUrl && urlAlias?.length !== 0) {
      const aliasExist = await Url.findOne({
        urlId: req.body.urlAlias,
        _id: { $ne: req.params.id },
      });
      if (aliasExist) {
        return next(createError(400, "Short Url alrady Exist!!!"));
      }
      const alias = req.body.urlAlias;

      if (!alias) {
        const shortUrl = `${base}/${urlId}`;
        const shortUrlExist = await Url.findOne({
          shortUrl: shortUrl,
          _id: { $ne: req.params.id },
        });

        if (shortUrlExist) {
          return next(
            createError(400, "Alias already exist, Create another one")
          );
        }
        const qrCode = await QRCode.toDataURL(shortUrl);
        if (!qrCode) {
          return next(createError(404, "QR code not generated!!!"));
        }
        const urlUpdate = await Url.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              ...req.body,
              qrCode,
              urlId, // Update urlId here
            },
          },
          { new: true }
        );

        res.status(200).json(urlUpdate);
      } else {
        const shortUrl = `${base}/${alias}`;
        const qrCode = await QRCode.toDataURL(shortUrl);
        if (!qrCode) {
          return next(createError(404, "QR code not generated!!!"));
        }
        const urlUpdate = await Url.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              ...req.body,
              qrCode,
              urlId: alias, // Update urlId here
            },
          },
          { new: true }
        );

        res.status(200).json(urlUpdate);
      }
    }
  } catch (error) {
    next(error);
  }
};

export const updateUrlNow = async (req, res, next) => {
  const { originalUrl, urlAlias } = req.body;
  const base = process.env.BASE;
  const filter = { _id: req.params.id }; // Define the filter based on the URL's _id

  try {
    const validUrl = validateUrl(originalUrl);

    if (!validUrl) {
      return next(createError(400, "URL is not valid!"));
    }

    if (urlAlias?.length !== 0) {
      const aliasExist = await Url.findOne({ urlId: req.body.urlAlias });

      if (aliasExist) {
        return next(createError(400, "Short URL already exists!"));
      }
    }

    // Check if the original URL is already associated with another URL (excluding the current URL being updated)
    let url = await Url.findOne({ originalUrl, _id: { $ne: req.params.id } });

    if (url) {
      return next(
        createError(400, "Short URL for this original URL already created!")
      );
    } else {
      const alias = req.body.urlAlias;

      if (!alias) {
        const updateUrl = await Url.findOneAndUpdate(
          filter,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json(updateUrl);
      } else {
        const shortUrl = `${base}/${alias}`;

        const updateUrl = await Url.findOneAndUpdate(
          filter,
          { $set: { ...req.body, shortUrl } },
          { new: true }
        );
        res.status(200).json(updateUrl);
      }
    }
  } catch (err) {
    next(err);
  }
};

export const redirectUrl = async (req, res, next) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });

    if (url) {
      await Url.updateOne(
        {
          urlId: req.params.urlId,
        },
        { $inc: { clicks: 1 } }
      );
      return res.redirect(url.originalUrl);
      // return res.status(201).json(url)
    } else {
      return next(createError(400, "url not Found!!!"));
    }
    // if (url) {
    //   await Url.updateOne(
    //     {
    //       urlId: req.params.urlId,
    //     },
    //     { $inc: { clicks: 1 } }
    //   );
    //   return res.redirect(url.origUrl);
    // } else res.status(404).json("Not found");
  } catch (err) {
    next(err);
  }
};

export const shortenUrl = async (req, res, next) => {
  // console.log(req.user)
  try {
    const url = await Url.findOne({
      urlId: req.params.urlId,
    });
    if (!url) {
      return next(createError(404, "You are yet to create short Url!"));
    }

    if (url) {
      const api_key = process.env.GEO_API_KEY;
      const iplocation = IP.address();
      const geoLocation = await axios.get(
        `https://ipgeolocation.abstractapi.com/v1/?api_key=${api_key}`
      );

      const geoLocationData = geoLocation.data;

      if (geoLocationData) {
        const newClick = new Click({
          ip: iplocation,
          urlId: url.urlId,
          userId: url.userId,
          region: geoLocationData.region,
          country: geoLocationData.country,
          city: geoLocationData.city,
          continent: geoLocationData.continent,
          urlAlias: url.urlAlias,
          countryFlag: geoLocationData.flag.svg,
          currency: geoLocationData.currency.currency_name,
        });
        try {
          const savedClick = await newClick.save();

          try {
            const updateUrl = await Url.findByIdAndUpdate(
              url._id,
              {
                $push: { clickInfo: savedClick._id },
                $inc: { clicks: 1 },
                lastActive: Date.now(),
              },
              { new: true }
            );

            if (
              updateUrl.lastActive <
              new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
            ) {
              url.status = "inactive";
              await updateUrl.save();
            }
          } catch (err) {
            next(err);
          }

          return res.redirect(url.originalUrl);
        } catch (err) {
          next(err);
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

export const getSingleUrl = async (req, res, next) => {
  const urlId = req.params.id;
  try {
    const url = await Url.findById(urlId);
    res.status(200).json(url);
  } catch (error) {
    next(error);
  }
};

export const getAllUlr = async (req, res, next) => {
  try {
    console.log("user =>", req.user);
    const urls = await Url.find();
    res.status(200).json(urls);
  } catch (err) {
    next(err);
  }
};

export const getUserUrls = async (req, res, next) => {
  const userId = req.user.id;
  try {
    // console.log("user =>", req.user);
    const urls = await Url.find({
      userId: userId,
    });
    res.status(200).json(urls);
  } catch (err) {
    next(err);
  }
};

export const getUserUrlsClickInfo = async (req, res, next) => {
  try {
    const url = await Url.findById(req.params.id);
    const urlInfos = await Promise.all(
      url.clickInfo.map((info) => {
        return Click.findById(info).populate("userId");
      })
    );

    res.status(200).json(urlInfos);
  } catch (err) {
    next(err);
  }
};

export const getUnRegisterUserUrls = async (req, res, next) => {
  const userId = req.ip;
  try {
    //  console.log("user =>", userId);
    const urls = await Url.find({
      createdByIp: userId,
      userId: null,
    });
    res.status(200).json(urls);
  } catch (err) {
    next(err);
  }
};

export const deleteUrlById = async (req, res, next) => {
  try {
    // Find the URL by its ID and remove it
    const url = await Url.findByIdAndDelete(req.params.id);

    if (!url) {
      return next(createError(404, "URL not found"));
    }

    res.status(204).send("Url Deleted Successfully!!!"); // Respond with a 204 No Content status code to indicate successful deletion
  } catch (error) {
    next(error);
  }
};

import mongoose from "mongoose";

const ClickSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    urlId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    continent: {
      type: String,
      required: true,
    },
    urlAlias: {
      type: String,
    },
    countryFlag: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Click", ClickSchema);

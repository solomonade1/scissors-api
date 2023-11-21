import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    urlId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      // ref: 'User' // Reference the User model
    },
    createdById: {
      type: String,
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    urlAlias: {
      type: String,
    },
    qrCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      required: true,
      default: "active",
    },
    clickInfo: {
      type: [String]
    },

    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    lastActive: Date,
  },
  {
    timestamps: true,
  }
);

// UrlSchema.methods.setInactiveIfInactiveFor10Days = function () {
//   const tenDaysAgo = new Date();
//   tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
//   if (this.lastActive < tenDaysAgo && this.status === "active") {
//     this.status = "inactive";
//     return this.save();
//   }
//   return Promise.resolve(this);
// };

export default mongoose.model("Url", UrlSchema);

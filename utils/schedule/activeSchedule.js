import Url from "../../models/Url.model.js";
import cron from "node-cron";

const scheduleActive = async () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3); // Subtract 3 days
  try {
    await Url.updateMany(
      {
        status: "active",
        createdAt: { $lte: currentDate },
      },
      {
        $set: { status: "inactive" },
      }
    );
  } catch (error) {
    console.error("Error updating documents:", error);
  }
};
// Schedule the task to run every day at 12:00 (noon)
cron.schedule("0 12 * * *", scheduleActive);

export default scheduleActive;

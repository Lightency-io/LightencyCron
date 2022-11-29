const express = require("express");
const burrow = require("../../../utils/mainnet/borrowFromBurrowCron");
const router = express.Router();

var CronJob = require("cron").CronJob;

//@author Firas Belhiba
//@Route GET api/fundenergy
// @Description
// @Access Private
router.post("/", async (req, res) => {
  const { id, amount, minutes, hours, days } = req.body;
  try {
    burrow(id, amount);
    // console.log("Before job instantiation");
    // var now = new Date();

    // if (minutes) now.setMinutes(now.getMinutes() + minutes); // timestamp
    // if (hours) now.setHours(now.getHours() + hours); // timestamp
    // if (days) now.setHours(now.getHours() + days * 24); // timestamp

    // let date = new Date(now);
    // date.setSeconds(date.getSeconds() + 30);
    // const job = new CronJob(date, function () {
    //   const d = new Date();
    //   console.log("Specific date:", date, ", onTick at:", d);
    //   borrow();
    // });
    // await job.start();
    return res.json({ result: "The burrow cron is set succefully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

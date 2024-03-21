import { User } from "../models/UserModel.js";
import { ExerciseLog } from "../models/ExerciseModel.js";

export async function logExercise(req, res) {
  try {
    console.log("req.body: ", req.body);

    let date = new Date(req.body.date);
    let activityType = req.body.activityType;
    let duration = req.body.duration;
    let intensity = req.body.intensity;
    let caloriesBurned = req.body.caloriesBurned;
    let notes = req.body.notes;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const newActivity = {
      activityType: activityType,
      duration: duration,
      intensity: intensity,
      caloriesBurned: caloriesBurned,
      notes: notes,
    };

    // Create a new date object for the current day
    let currentDay = new Date(date);
    currentDay.setHours(0, 0, 0, 0);

    // Find the exercise log for the current day
    let exerciseLog = await ExerciseLog.findOne({
      userId: req.params.id,
      date: {
        $gte: currentDay,
        $lt: new Date(currentDay.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (exerciseLog) {
      exerciseLog.activities.push(newActivity);
    } else {
      exerciseLog = new ExerciseLog({
        userId: req.params.id,
        date: date,
        activities: [newActivity],
      });
    }

    await exerciseLog.save();

    res.status(200).send({
      message: "Exercise log updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error logging exercise" });
  }
}

export async function fetchExerciseActivities(req, res) {
  try {
    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Create a new date object for the selected day
    let selectedDay = new Date(req.params.date);
    selectedDay.setHours(23, 59, 59, 999);

    console.log("selectedDay: ", selectedDay);

    // Create a new date object for the day one week before the selected day
    let oneWeekBefore = new Date(
      selectedDay.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    console.log("oneWeekBefore: ", oneWeekBefore);

    // Find the exercise logs for the last week from the selected day
    let exerciseLogs = await ExerciseLog.find({
      userId: req.params.id,
      date: {
        $gte: oneWeekBefore,
        $lte: selectedDay,
      },
    });

    console.log("exerciseLogs: ", exerciseLogs);

    if (exerciseLogs) {
      let activities = exerciseLogs.reduce((acc, log) => {
        let activitiesWithDate = log.activities.map((activity) => ({
          ...activity._doc,
          date: log.date,
        }));

        return acc.concat(activitiesWithDate);
      }, []);

      res.status(200).send({ activities });
    } else {
      res.status(200).send({ activities: [] });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "Error fetching exercise activities" });
  }
}

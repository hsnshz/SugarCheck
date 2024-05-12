import { User } from "../models/UserModel.js";
import { MealLogs } from "../models/MealModel.js";

export async function addMealLog(req, res) {
  try {
    console.log("req.body: ", req.body);

    let timestamp = new Date(req.body.timestamp);
    let mealName = req.body.mealName;
    let calories = req.body.calories;
    let carbohydrates = req.body.carbohydrates;
    let fats = req.body.fats;
    let proteins = req.body.proteins;
    let fiber = req.body.fiber;
    let notes = req.body.notes;
    let image = req.body.image;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const newMeal = {
      timestamp: timestamp,
      mealName: mealName,
      calories: calories,
      carbohydrates: carbohydrates,
      fats: fats,
      proteins: proteins,
      fiber: fiber,
      notes: notes,
      image: image,
    };

    // Create a new date object for the current day
    let currentDay = new Date(timestamp);
    currentDay.setHours(0, 0, 0, 0);

    // Find the meal log for the current day
    let mealLog = await MealLogs.findOne({
      userId: req.params.id,
      date: {
        $gte: currentDay,
        $lt: new Date(currentDay.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (mealLog) {
      mealLog.meals.push(newMeal);
    } else {
      mealLog = new MealLogs({
        userId: req.params.id,
        date: timestamp,
        meals: [newMeal],
      });
    }

    await mealLog.save();

    console.log("mealLog: ", mealLog);

    res.status(200).send({
      mealLog,
      message: "Meal added successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function fetchLoggedMeals(req, res) {
  try {
    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const mealLogs = await MealLogs.find({ userId: req.params.id });

    res.status(200).send({
      mealLogs,
      message: "Meal logs fetched successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function fetchMealLog(req, res) {
  try {
    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const date = new Date(req.params.date);
    let startOfDay, endOfDay;

    if (req.params.mode === "date") {
      startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
      endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    } else if (req.params.mode === "week") {
      const firstDayOfWeek = date.getDate() - date.getDay();
      const lastDayOfWeek = firstDayOfWeek + 6;

      startOfDay = new Date(date.setUTCDate(firstDayOfWeek));
      endOfDay = new Date(date.setUTCDate(lastDayOfWeek));
      endOfDay.setUTCHours(23, 59, 59, 999);
    }

    // Find the meal logs for the current day or week
    let mealLogs = await MealLogs.find({
      userId: req.params.id,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).sort({ date: -1 });

    if (!mealLogs) {
      return res
        .status(404)
        .send({ error: "No meal logs found for the day or week" });
    }

    res.status(200).send({
      mealLogs,
      message: "Meal logs fetched successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function updateMealLog(req, res) {
  try {
    console.log("req.body: ", req.body);
    console.log("req.params: ", req.params);

    let userId = req.params.id;
    let mealLogId = req.params.mealLogId;
    let mealId = req.params.mealId;

    let timestamp = new Date(req.body.timestamp);
    let mealName = req.body.mealName;
    let calories = req.body.calories;
    let carbohydrates = req.body.carbohydrates;
    let fats = req.body.fats;
    let proteins = req.body.proteins;
    let fiber = req.body.fiber;
    let notes = req.body.notes;
    let image = req.body.image;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== userId) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const mealLog = await MealLogs.findById({ _id: mealLogId });

    if (!mealLog) {
      return res.status(404).send({ error: "Meal log not found" });
    }

    const mealIndex = mealLog.meals.findIndex(
      (meal) => meal._id.toString() === mealId
    );

    if (mealIndex === -1) {
      return res.status(404).send({ error: "Meal not found" });
    }

    mealLog.meals[mealIndex].mealName = mealName;
    mealLog.meals[mealIndex].calories = calories;
    mealLog.meals[mealIndex].carbohydrates = carbohydrates;
    mealLog.meals[mealIndex].fats = fats;
    mealLog.meals[mealIndex].proteins = proteins;
    mealLog.meals[mealIndex].fiber = fiber;
    mealLog.meals[mealIndex].notes = notes;
    mealLog.meals[mealIndex].image = image;
    mealLog.meals[mealIndex].timestamp = timestamp;

    await mealLog.save();

    res.status(200).send({
      mealLog,
      message: "Meal updated successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function deleteMealLog(req, res) {
  try {
    console.log("req.params: ", req.params);

    let userId = req.params.id;
    let mealLogId = req.params.mealLogId;
    let mealId = req.params.mealId;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== userId) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const mealLog = await MealLogs.findById({ _id: mealLogId });

    if (!mealLog) {
      return res.status(404).send({ error: "Meal log not found" });
    }

    const mealIndex = mealLog.meals.findIndex(
      (meal) => meal._id.toString() === mealId
    );

    if (mealIndex === -1) {
      return res.status(404).send({ error: "Meal not found" });
    }

    mealLog.meals.splice(mealIndex, 1);

    if (mealLog.meals.length === 0) {
      await MealLogs.findByIdAndDelete({ _id: mealLogId });
      return res.status(200).send({
        message: "Meal log deleted successfully",
      });
    }

    await mealLog.save();

    res.status(200).send({
      mealLog,
      message: "Meal deleted successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

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
    let notes = req.body.notes;

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
      notes: notes,
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

    res.status(200).send({
      mealLog,
      message: "Meal added successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function fetchMealLog(req, res) {}

export async function updateMealLog(req, res) {}

export async function deleteMealLog(req, res) {}

import { User } from "../models/UserModel.js";
import { MealFavorites } from "../models/MealModel.js";

export async function addFavoriteRecipe(req, res) {
  try {
    console.log("req.body: ", req.body);
    let favoriteRecipeURL = req.body.url;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    await MealFavorites.create({
      userId: req.user.userId,
      recipeURL: favoriteRecipeURL,
    });

    res.status(200).send({
      message: "Favorite recipe added successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function deleteFavoriteRecipe(req, res) {
  try {
    console.log("req.body: ", req.body);
    let favoriteRecipeURL = req.body.url;

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Delete the MealFavorites document if it exists
    await MealFavorites.findOneAndDelete({
      userId: req.user.userId,
      recipeURL: favoriteRecipeURL,
    });

    res.status(200).send({
      message: "Favorite recipe removed successfully",
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function checkFavoriteRecipe(req, res) {
  try {
    let recipeURL = req.query.url;
    console.log("recipeURL: ", req.query.url);

    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Check if the MealFavorites document exists
    const favorite = await MealFavorites.findOne({
      userId: req.user.userId,
      recipeURL: recipeURL,
    });

    res.status(200).send({
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

export async function getAllFavoriteRecipes(req, res) {
  try {
    // Check if the authenticated user is the same as the user to be updated
    if (req.user.userId !== req.params.id) {
      return res.status(403).send({ error: "Authorization failed." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Fetch all the MealFavorites documents for this user
    const favorites = await MealFavorites.find({
      userId: req.user.userId,
    });

    res.status(200).send({
      favorites: favorites,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send(error);
  }
}

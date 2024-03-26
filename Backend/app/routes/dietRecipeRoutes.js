import { Router } from "express";
const router = Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  addFavoriteRecipe,
  deleteFavoriteRecipe,
  checkFavoriteRecipe,
  getAllFavoriteRecipes,
} from "../controllers/dietRecipeController.js";

router.post("/favorite-recipe/:id", authMiddleware, addFavoriteRecipe);
router.delete(
  "/delete-favorite-recipe/:id",
  authMiddleware,
  deleteFavoriteRecipe
);
router.get("/check-favorite-recipe/:id", authMiddleware, checkFavoriteRecipe);
router.get("/all-favorite-recipes/:id", authMiddleware, getAllFavoriteRecipes);

export default router;

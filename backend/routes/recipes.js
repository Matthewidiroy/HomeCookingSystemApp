const express = require("express");
const router = express.Router();
const recipesController = require("../controllers/recipes");

router.get(
  "/recipeForTomorrowIngredients",
  recipesController.getRecipeForTomorrowIngredients
);
router.get("/recipeOfTheDay", recipesController.getRecipeOfTheDay);
router.get("/random", recipesController.getRandomRecipe);
router.get("/ingredients", recipesController.getRecipesByIngredients);
router.post("/review", recipesController.rateRecipe);
router.get("/review", recipesController.getAvgRating);
router.get("/:id", recipesController.getRecipe);
router.get("/", recipesController.getRecipes);
router.post("/", recipesController.postRecipe);
router.put("/:id", recipesController.putRecipe);
router.delete("/:id", recipesController.deleteRecipe);
router.delete("/", recipesController.deleteUserRecipe);
router.use((request, response) => response.status(404).end());

module.exports = router;

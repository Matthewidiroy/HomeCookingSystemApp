const express = require("express");
const router = express.Router();
const ingredientsController = require("../controllers/ingredients");

router.get("/", ingredientsController.getIngredients);

module.exports = router;

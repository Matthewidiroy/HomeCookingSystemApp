const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const recipesRoutes = require("./routes/recipes");
const usersRoutes = require("./routes/users");
const ingredientsRoutes = require("./routes/ingredients");
const server = express();

server.use(bodyParser.json());
server.use(cors());

// Połączenie z bazą danych MongoDB
mongoose.connect("mongodb://localhost:27017/recipeApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

server.use("/recipes", recipesRoutes);
server.use("/users", usersRoutes);
server.use("/ingredients", ingredientsRoutes);

server.listen(8000, () => console.log("Server for recipe is started..."));

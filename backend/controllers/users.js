const { MongoClient } = require("mongodb");
const { fetchRecipeData } = require("./fetchRecipeData");
const { recipesData } = require("./recipes");
const User = require("../models/User");

const uri = "mongodb://localhost:27017/recipeApp";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fetchUserData() {
  try {
    await client.connect();

    const collection = client.db("recipeApp").collection("users");
    const usersData = await collection.find({}).toArray();

    return usersData;
  } finally {
    await client.close();
  }
}

exports.fetchUserData = fetchUserData;
exports.updateUserData = updateUserData;

async function updateUserData(id, userData) {
  result = await User.updateOne({ _id: id }, { $set: userData });
}
exports.postUser = async (request, response, next) => {
  try {
    const { login, password } = request.body;

    const usersData = await fetchUserData();
    const user = usersData.find((u) => u.login === login);

    if (!user) {
      response.status(404).json({
        message: "Użytkownik o podanym loginie nie istnieje",
      });
      return;
    }

    const isPasswordCorrect = user.password === password;
    if (!isPasswordCorrect) {
      response.status(401).json({
        message: "Hasło lub login się nie zgadza",
      });
      return;
    }

    response.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie POST w endpointcie /users",
    });
  }
};

exports.registerUser = async (request, response, next) => {
  try {
    const { login, password } = request.body;

    const usersData = await fetchUserData();
    const user = usersData.find((u) => u.login === login);

    if (user) {
      return response.status(404).json({
        message: "Użytkownik o podanym loginie istnieje.",
      });
    }

    const newUser = new User({
      login,
      password,
      accessLevel: 0,
      recipes: [],
    });

    await newUser.save();
    response
      .status(201)
      .json({ message: "Użytkownik został pomyślnie zarejestrowany." });
  } catch (error) {
    console.error("Błąd rejestracji użytkownika:", error);
    response
      .status(500)
      .json({ message: "Wystąpił błąd podczas rejestracji użytkownika" });
  }
};

exports.patchUser = async (request, response, next) => {
  try {
    const { login, recipeId } = request.body;

    const usersData = await fetchUserData();
    const recipesData = await fetchRecipeData();
    
    const recipe = recipesData.find((recipe) => recipe.id === recipeId);
    const user = usersData.find((user) => user.login === login);

    if (!recipe) {
      response.status(404).json({
        message: "Nie znaleziono przepisu o podanym Id",
      });
      return;
    } else if (!user) {
      response.status(404).json({
        message: "Nie znaleziono użytkownika o podanym loginie",
      });
      return;
    }

    const hasUserRecipeAlready = user.recipes.some(
      (id) => id.toString() === recipeId.toString()
    );
    // Sprawdzenie czy przepis już jest w ulubionych
    if (hasUserRecipeAlready) {
      response.status(200).json({
        message: "Przepis już jest w ulubionych",
        user,
      });
      return;
    }

    user.recipes.push(recipeId);
    await updateUserData(user._id, user);

    response.status(202).json({
      message: "Przepis został dodany do ulubionych",
      user,
    });
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie PATCH w endpointcie /users: " +
        error,
    });
  }
};

exports.getUser = async (request, response, next) => {
  try {
    const login = request.query.login;

    const usersData = await fetchUserData();
    const user = usersData.find((u) => u.login === login);

    if (!user) {
      response.status(404).json({
        message: "Użytkownik o podanym loginie nie istnieje",
      });

      return;
    }

    // const isPasswordCorrect = user.password === password;
    // if (!isPasswordCorrect) {
    //   response.status(401).json({
    //     message: "Hasło lub login się nie zgadza",
    //   });

    //   return;
    // }
    const recipesData = await fetchRecipeData();
    const favouriteRecipes = [];

    user.recipes?.map((recipeId, id) => {
      const recipeIndex = recipesData.findIndex(
        (allRecipes) => allRecipes._id.toString() == recipeId
      );

      if (recipeIndex === -1) {
        user.recipes.slice(id, 1);
      } else {
        favouriteRecipes.push(recipesData[recipeIndex]);
      }
    });

    await updateUserData(user._id, user);

    response.status(200).json({
      recipes: favouriteRecipes,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie POST w endpointcie /users, error" +
        error,
    });
  }
};

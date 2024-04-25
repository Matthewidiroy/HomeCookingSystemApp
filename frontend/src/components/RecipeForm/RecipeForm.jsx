import React, { useState, useCallback, useEffect } from 'react';
import bemCssModules from 'bem-css-modules';
import IngredientComboBox from '../IngredientComboBox/IngredientComboBox';
import request from '../../helpers/request';
import Recipe from '../Recipe/Recipe';
import styles from './RecipeForm.module.scss';
import TextField from '@mui/material/TextField';

const style = bemCssModules(styles);
const RecipeForm = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [randomRecipe, setRandomRecipe] = useState([]);
  const [name, setName] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
  const [ingredientsForTomorrow, setIngredientsForTomorrow] = useState(null);

  useEffect(() => {
    const filterRecipes = (recipes, name) => {
      if (name === "") return recipes;
  
      const filtered = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(name.toLowerCase())
      );
      return filtered;
    };
    setFilteredRecipes(filterRecipes(recipes, name));
  }, [recipes, name]);

  useEffect(() => {
    async function fetchIngredients() {
      const res = await request.get("http://localhost:8000/ingredients");
      setIngredients(res.data.ingredients);
    }

    async function fetchRecipeOfTheDay() {
      const res = await request.get("http://localhost:8000/recipes/recipeOfTheDay");
      setRecipeOfTheDay(res.data.recipe);
    }

    async function fetchIngredientsForTomorrow() {
      const res = await request.get("http://localhost:8000/recipes/recipeForTomorrowIngredients");
      setIngredientsForTomorrow(res.data.ingredients);
    }

    fetchIngredients();
    fetchRecipeOfTheDay();
    fetchIngredientsForTomorrow();
  }, []);

  const handleIngredientSelect = (selectedOptions) => {
    setRandomRecipe([]);
    setSelectedIngredients(selectedOptions);
    fetchRecipes(selectedOptions);
  };

  const fetchRecipes = useCallback(async (ings) => {
    const queryString = ings.map(ingredient => `ingredient=${encodeURIComponent(ingredient)}`).join('&');
    try {
      const res = await request.get('http://localhost:8000/recipes/ingredients?' + queryString);
        const data = res.data;
        setRecipes(data.recipes);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}, [])

const handleNameChange = (event) => {
  setName(event.target.value);
};

const handleRandomRecipe = () => {
  const randomIndex = Math.floor(Math.random() * renderedRecipes.length);
  setRandomRecipe(renderedRecipes[randomIndex]);
};

const handleShowAll = () => {
  setRandomRecipe([]);
}

const renderedRecipes = filteredRecipes?.map((recipe, id) => <Recipe key={"Recipe" + id} isUserContext={true} {...recipe} removeButton={false}/>);
const isRandomRecipe = randomRecipe.length !== 0

  return (<>
  <div style={{marginTop: 10, display: "flex"}}>
    <div style={{flex: 1}}>
    <h2 style={{marginBottom: 7}}>Przepis dnia</h2>
    {recipeOfTheDay ? <div style={{width: 300}}>{
      <Recipe isUserContext={true} {...recipeOfTheDay} removeButton={false} ></Recipe>
    }</div> : ""}
    </div>
    <div style={{flex: 1}}>
    <h2>Wymagane składniki na jutrzejszy przepis</h2>
    
    <ol style={{listStyleType: "disc", marginLeft: 20}}>
      {
        ingredientsForTomorrow && ingredientsForTomorrow.map((ingredient) => <li>{ingredient}</li>)
      }
    </ol>
    </div>

  </div>
  <div style={{marginTop: 10}}>
      <IngredientComboBox ingredients={ingredients} onSelect={handleIngredientSelect} />
      <TextField variant="standard" label="Wyszukaj po nazwie..." value={name} onChange={handleNameChange}/> 
      <div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
      <button onClick={handleRandomRecipe}> Wylosuj przepis </button>
      <button onClick={handleShowAll} style={{marginLeft: 30, display: isRandomRecipe ? "" : "none"}}> Pokaż wszystkie </button>
      </div>
      <div style={{marginTop: 15}}>
      <ul className={style('list')}>{isRandomRecipe ? randomRecipe: renderedRecipes}</ul>
      </div>
      </div>
    </>
  );
};

export default RecipeForm;
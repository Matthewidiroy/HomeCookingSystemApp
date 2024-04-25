import React, { useContext, useState } from 'react';

import RecipePopup from './RecipePopup';
import { StoreContext } from '../../../store/StoreProvider';
import request from '../../../helpers/request';

const RecipeDetails = (props) => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const { setRecipes } = useContext(StoreContext);
  const { _id, title } = props;

  const showPopup = () => setIsOpenPopup(true);
  const hidePopup = event => {
    if (event) {
      event.preventDefault();
    }

    setIsOpenPopup(false);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      console.log('ID przed usunięciem:', recipeId);

      const res = await request.delete(`/recipes/${recipeId}`);
      console.log('Status usunięcia:', res.status);

      if (res.status === 200) {
        setRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
      }
    } catch (error) {
      console.warn(error);
    }
  }

  return (
    <details>
      <summary>{title}</summary>
      <button onClick={showPopup}>Edytuj</button>
      <button onClick={async () => await handleDeleteRecipe(_id)}>Usuń</button>
      <RecipePopup isOpenPopup={isOpenPopup} hidePopup={hidePopup} {...props} />
    </details>
  );
};

export default RecipeDetails;

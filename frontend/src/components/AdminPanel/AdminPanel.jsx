import React, { useContext, useState } from 'react';

import RecipeDetails from './subcomponents/RecipeDetails';
import RecipePopup from './subcomponents/RecipePopup';
import { StoreContext } from '../../store/StoreProvider';

const AdminPanel = () => {
	const [isOpenPopup, setIsOpenPopup] = useState(false);
	const { recipes } = useContext(StoreContext);
	const showPopup = () => setIsOpenPopup(true);
	const hidePopup = event => {
		if (event) {
			event.preventDefault();
		}

		setIsOpenPopup(false);
	};

	const recipesElements = recipes.map(recipe => <RecipeDetails key={recipe.id} {...recipe} />);

	return (
		<section>
			{recipesElements}
			<button onClick={showPopup}>Dodaj nowy przepis</button>
			<RecipePopup is={true} isEditMode={false} isOpenPopup={isOpenPopup} hidePopup={hidePopup} />
		</section>
	);
};

export default AdminPanel;
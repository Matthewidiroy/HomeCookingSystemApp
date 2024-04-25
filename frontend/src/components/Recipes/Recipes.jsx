import React, { useContext } from 'react';
import bemCssModules from 'bem-css-modules';

import Recipe from '../Recipe/Recipe';
import { StoreContext } from '../../store/StoreProvider';

import { default as RecipesStyles } from './Recipes.module.scss';

const style = bemCssModules(RecipesStyles);

const Recipes = () => {
	const { recipes } = useContext(StoreContext);
		let recipesAddedByAdmin = recipes.filter(recipe => recipe.visibility === true);
		console.log("Recipes added by admin", recipesAddedByAdmin);
	let recipesElements = recipesAddedByAdmin.map(recipe => <Recipe key={recipe.id} {...recipe} />);
	
	return (
		<section className={style()}>
			<h1 className={style('title')}>Przepisy</h1>
			<ul className={style('list')}>
				{recipesElements}
			</ul>
		</section>
	);
};

export default Recipes;
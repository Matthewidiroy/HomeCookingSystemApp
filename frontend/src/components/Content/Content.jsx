import React, { useContext } from 'react';
import bemCssModules from 'bem-css-modules';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminPanel from '../AdminPanel/AdminPanel';
import Recipes from '../Recipes/Recipes';
import UserRecipes from '../UserRecipes/UserRecipes';
import { StoreContext } from '../../store/StoreProvider';

import { default as ContentStyles } from './Content.module.scss';
import RecipeForm from '../RecipeForm/RecipeForm';

const style = bemCssModules(ContentStyles);

const ADMIN_TYPE = 1;

const Content = () => {
	const { user } = useContext(StoreContext);

	const isUserLogged = Boolean(user);
	const isAdmin = user?.accessLevel === ADMIN_TYPE;

	return (
		<main className={style()}>
			<Routes>
				<Route path="/" element={<Recipes />} />
				{ isUserLogged && <Route path="/moje-artykuly-spozywcze" element={<RecipeForm />} /> }
				{ isUserLogged && <Route path="/my-recipes" element={<UserRecipes />} /> }
				{ isAdmin && <Route path="/manage-recipes" element={<AdminPanel />} /> }
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</main>
	);
};

export default Content;

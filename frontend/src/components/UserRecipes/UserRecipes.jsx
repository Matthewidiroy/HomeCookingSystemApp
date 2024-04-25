import React, { useContext, useState, useEffect, useCallback } from 'react';
import bemCssModules from 'bem-css-modules';

import Recipe from '../Recipe/Recipe';
import { StoreContext } from '../../store/StoreProvider';

import { default as UserRecipesStyles } from './UserRecipes.module.scss';

const style = bemCssModules(UserRecipesStyles);

const UserStyles = () => {
	const { user } = useContext(StoreContext);
	const [favouriteRecipes, setFavouriteRecipes] = useState([]);
	
	const fetchData = useCallback(async () => {
        try {
            const res = await fetch(`http://localhost:8000/users?login=${user.login}`, { method: "GET" });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            setFavouriteRecipes(data.recipes);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [user.login, setFavouriteRecipes]);

	useEffect(() => {
	
		fetchData();
	
	}, [setFavouriteRecipes, user.login, fetchData])

	const refreshRecipes = () => fetchData();

	const favouriteRecipesComponents = favouriteRecipes?.map(recipe => <Recipe isUserContext={true} key={recipe.id} {...recipe} removeButton={true} refreshRecipes={refreshRecipes}/>);

	return (
		<section className={style()}>
			<h2 className={style('title')}>Twoje ulubione przepisy</h2>
			<ul className={style('list')}>
				{favouriteRecipesComponents}
			</ul>
		</section>
	);
};

export default UserStyles;

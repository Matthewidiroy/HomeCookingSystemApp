import React, { useContext, useState } from 'react';
import bemCssModules from 'bem-css-modules';
import { useNavigate } from 'react-router-dom';  // Zmiana importu
import { StoreContext } from '../../store/StoreProvider';
import request from '../../helpers/request';

import { default as RecipeStyles } from './Recipe.module.scss';
import Rating from "./Rating";

const style = bemCssModules(RecipeStyles);
const textLength = 80;

const Recipe = ({ authors, _id, img, isUserContext = false, price, title, isAdmin, removeButton, refreshRecipes, description, ingredients }) => {
	const { user, setFavouriteRecipes } = useContext(StoreContext);
	const navigate = useNavigate();  // Zmiana użycia hooka]
	const [descriptionLength, setDescriptionLength] = useState(textLength);
	const allAuthors = authors.join(', ');
	const isUserLogged = Boolean(user);

	const handleOnClick = async () => {
		try {
			const res = await request.patch(
				'http://localhost:8000/users',
				{
					login: user.login,
					recipeId: _id,
				}
			);
			
			if (res.status === 202) {
				// setUser(data.user);
				
				setFavouriteRecipes(res.data.user.recipes);
				navigate('/my-recipes');  // Zmiana nawigacji
			}
		} catch (error) {
			console.warn(error);
		}
	};

	const handleRemove = async () => {
		console.log("Login: " + user.login +", recipeId: " + _id);
		const res = await request.delete(`http://localhost:8000/recipes`, {
      data: {
        login: user.login,
        recipeId: _id,
      },
    })
	console.log(res);
	refreshRecipes();
	;
	}

	const shouldBeBuyButtonVisible = isUserLogged && !isUserContext;
	const isFullDescription = descriptionLength === Infinity;
	const changeDescriptionLength = () => {
		console.log(descriptionLength);
		isFullDescription ? setDescriptionLength(80) : setDescriptionLength(Infinity)}
	return (
		<li style={{listStyleType: "none"}}>
			<article className={style()}>
				<h3 className={style('title')}>{title}</h3>
				<img alt={title} className={style('image')} src={img} />
				<p className={style('authors')}>{`Autorzy przepisu: ${allAuthors}`}</p>
				<p className={style('authors')}>{description ? shortenText(description, descriptionLength) : ""}</p>
				{description?.length > textLength && <button onClick={() => changeDescriptionLength()}> {isFullDescription ? "Pokaż mniej" : "Pokaż więcej"}</button>}
				<p className={style('authors')}>Składniki: {ingredients.map((ingredient, index) =>{
					if(index === ingredients.length - 1)
					return ingredient + ".";
					return ingredient + ", ";
					})}</p>
				<Rating recipeId={_id}/>
				{shouldBeBuyButtonVisible && <button onClick={handleOnClick}>Dodaj do ulubionych</button>}
				{removeButton && <button onClick={handleRemove}>Usuń z ulubionych</button>}
			</article>
		</li>
	);
};

export default Recipe;

function shortenText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    } else {
        return text.slice(0, maxLength) + "... ";
    }
}
import React, { useState, useContext} from 'react';
import bemCssModules from 'bem-css-modules';
import { Link } from 'react-router-dom';
import RecipePopup from '../../AdminPanel/subcomponents/RecipePopup';
import { default as AsideMenuStyles } from '../AsideMenu.module.scss';
import { StoreContext } from '../../../store/StoreProvider';
const style = bemCssModules(AsideMenuStyles);

const UserMenu = ({ isUserLogged}) => {

	const { user } = useContext(StoreContext);
	const accessLevel = user?.accessLevel
	console.log("Acces level", accessLevel);
	const [isOpenPopup, setIsOpenPopup] = useState(false);
	const showPopup = () => setIsOpenPopup(true);
	const hidePopup = event => {
		if (event) {
			event.preventDefault();
		}

		setIsOpenPopup(false);
	};
return (

	<>
		<p className={style('title')}>Panel użytkownika</p>
		<nav>
			<ul>
				<li className={style('link')}>
					<Link to="/">Przepisy kulinarne</Link>
				</li>
				
				{isUserLogged && <li className={style('link')}><Link to="/moje-artykuly-spozywcze">Moje artykuly spożywcze</Link></li>}
				{isUserLogged && <RecipePopup accessLevel = {accessLevel} isEditMode={false} isOpenPopup={isOpenPopup} hidePopup={hidePopup} />}
				{isUserLogged && <li className={style('link')}><Link to="/my-recipes">Moje ulubione przepisy</Link></li>}
				{isUserLogged && <button className={style('link')} onClick={showPopup}>Zaproponuj nowy przepis</button>}
			</ul>
		</nav>
	</>
);
}
export default UserMenu;
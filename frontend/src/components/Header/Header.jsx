import React, { useContext, useState } from "react";
import bemCssModules from "bem-css-modules";

import { StoreContext } from "../../store/StoreProvider";

import { default as HeaderStyles } from './Header.module.scss';

import LoginForm from "../Login/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";

const style = bemCssModules(HeaderStyles);

const Header = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const { user, setUser } = useContext(StoreContext);

    const handleLoginModalClose = () => setIsLoginModalOpen(false);
    const handleRegisterModalClose = () => setIsRegisterModalOpen(false);

    const handleLoginButtonClick = () => {
        if (Boolean(user)){
            setUser(null);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleRegisterButtonClick = () => setIsRegisterModalOpen(true);

    const loginButtonLabel = Boolean(user) ? 'Wyloguj się' : 'Zaloguj się';

    return (
        <header className={style()}>
            <div className={style('logo-wrapper')} />
            <h1 className={style('title')}>Domowy system kulinarny | Tworzymy niesamowite przepisy w internecie</h1>
            <button className={style('login-button')} onClick={handleLoginButtonClick}>{loginButtonLabel}</button>
            <LoginForm handleOnClose={handleLoginModalClose} isModalOpen={isLoginModalOpen} />
            {!user && <button className={style('register-button')} onClick={handleRegisterButtonClick}>Zarejestruj się</button>}
            <RegisterForm handleOnClose={handleRegisterModalClose} isModalOpen={isRegisterModalOpen} />
        </header>
    );
};

export default Header;

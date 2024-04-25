import React, { useState, useContext } from 'react';
import bemCssModules from 'bem-css-modules';
import request from '../../helpers/request';
import Modal from '../Modal/Modal';
import styles from './RegisterForm.module.scss';
import { StoreContext } from "../../store/StoreProvider";

const style = bemCssModules(styles);

const RegisterForm = ({ handleOnClose, isModalOpen }) => {
  const { setUser } = useContext(StoreContext);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [validateMessage, setValidateMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleOnChangeLogin = (event) => {
    setLogin(event.target.value);
    setValidateMessage('');
  };

  const handleOnChangePassword = (event) => {
    setPassword(event.target.value);
    setValidateMessage('');
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setIsButtonDisabled(true);
    
    try {
      const response = await request.post('http://localhost:8000/users/register', {
        login,
        password,
      });

      if (response.status === 201) {
        console.log('Rejestracja zakończona sukcesem');
        handleOnClose();
        setUser({login: login});
      } else {
        console.error('Błąd rejestracji:', response.data.message);
        setValidateMessage(response.data.message);
      }
    } catch (error) {
      console.error('Błąd rejestracji:', error.message);
      setValidateMessage('Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.');
    } finally {
      setIsButtonDisabled(false);
    }
  };
 
  return (
    <Modal handleOnClose={handleOnClose} isOpen={isModalOpen} shouldBeClosedOnOutsideClick={true}>
      <form className={style()} method="post" onSubmit={handleOnSubmit}>
        <div className={style('row')}>
          <label>
            Login:
            <input onChange={handleOnChangeLogin} type="text" value={login} />
          </label>
        </div>
        <div className={style('row')}>
          <label>
            Hasło:
            <input onChange={handleOnChangePassword} type="password" value={password} minLength={6} />
          </label>
        </div>
        <div className={style('row')}>
          <button type="submit" disabled={isButtonDisabled}>Zarejestruj się</button>
          <button onClick={handleOnClose} type="button">Anuluj</button>
        </div>
        {validateMessage && <p className={style('validate-message')}>{validateMessage}</p>}
      </form>
    </Modal>
  );
};

export default RegisterForm;

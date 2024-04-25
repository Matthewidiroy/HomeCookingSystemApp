import React, { useContext, useState } from 'react';
import bemCssModules from 'bem-css-modules';

import Modal from '../../Modal/Modal';
import { StoreContext } from '../../../store/StoreProvider';
import AutocompleteIngredients from "./Autocomplete";
import { default as RecipePopupStyles } from './RecipePopup.module.scss';

const style = bemCssModules(RecipePopupStyles);

const RecipePopup = ({
  authors = [],
  hidePopup,
  isEditMode = true,
  isOpenPopup,
  _id,
  img = '',
  title = '',
  isAdmin,
  descr = "",
  accessLevel,
}) => {
  const [formAuthors, setFormAuthors] = useState(authors);
  const [formAuthor, setAuthor] = useState('');
  const [formImg, setFormImg] = useState(img);
  const [formTitle, setFormTitle] = useState(title);
  const [visibility, setVisibility] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [description, setDescription] = useState(descr);

  const { setRecipes } = useContext(StoreContext);
  const { user } = useContext(StoreContext);
  isAdmin = user?.accessLevel === 1 ? true : false;

  const handleOnChangeAuthor = (event) => setAuthor(event.target.value);
  const handleOnChangeImg = (event) => setFormImg(event.target.value);
  const handleOnChangeTitle = (event) => setFormTitle(event.target.value);
  const handleOnChangeDescription = (event) => setDescription(event.target.value);
  const handleOnChangeVisibilityForUsers = (event) => setVisibility(event.target.value);

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const recipeObject = {
      authors: formAuthors,
      _id,
      img: formImg,
      title: formTitle,
      isAdmin: accessLevel ? true : false,
      visibility: visibility === 'true' ? true : false,
      ingredients: ingredients, // Dodaj to pole i uzupełnij zgodnie z danymi przepisu
      description: description,
    };

    try {
      let response;

      if(isEditMode) {
        response = await fetch('http://localhost:8000/recipes/' + _id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipeObject),
        });
      
      }
      else {
           // Użyj odpowiedniego endpointu i metody HTTP do dodania przepisu do bazy danych
        response = await fetch('http://localhost:8000/recipes', {
          method: 'POST', // Użyj POST do dodania nowego przepisu
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipeObject),
        });
      }
     
      if (!response.ok) {
        throw new Error('Błąd dodawania przepisu do bazy danych: '+  + response.status + " " +response.statusText);
      }

      // Pobierz zaktualizowane dane przepisów po dodaniu
      const data = await response.json();
      setRecipes(data.recipes);
      hidePopup();
    } catch (error) {
      console.clear();
      console.log(recipeObject);
      console.error('Błąd:', error.message);
    }
  };

  const addAuthor = (event) => {
    event.preventDefault();

    setFormAuthors((prev) => [...prev, formAuthor]);
    setAuthor('');
  };

  const deleteAuthor = (event) => {
    const authorToDelete = event.target.dataset.author;
    setFormAuthors((prev) => prev.filter((author) => author !== authorToDelete));
  };

  const authorsElements = formAuthors.map((author) => (
    <li key={author}>
      <p>{author}</p>
      <button data-author={author} onClick={deleteAuthor}>
        Usuń
      </button>
    </li>
  ));

  const correctLabel = isEditMode ? 'Aktualizuj przepis' : 'Utwórz przepis';

  return (
    <Modal handleOnClose={hidePopup} isOpen={isOpenPopup}>
      <div className={style()}>
        <form className={style('form')} method="submit" onSubmit={handleOnSubmit}>
          <div className={style('form-row')}>
            <label>
              Autor:
              <input className={style('input')} onChange={handleOnChangeAuthor} type="text" value={formAuthor} />
              <button onClick={addAuthor}>Dodaj autora</button>
            </label>
          </div>
          <div className={style('form-row')}>
            <label>
              Obrazek url:
              <input className={style('input')} onChange={handleOnChangeImg} type="text" value={formImg} />
            </label>
          </div>
          <div className={style('form-row')}>
            <label>
              <AutocompleteIngredients data = {setIngredients} setData={setIngredients} value={ingredients}/>
            </label>
          </div>
          <div className={style('form-row')}>
            <label>
              Tytuł:
              <input className={style('input')} onChange={handleOnChangeTitle} type="text" value={formTitle} />
            </label>
          </div>
          <div className={style('form-row')}>
            <label>
              Opis przygotowania:
              <textarea className={style('input')} onChange={handleOnChangeDescription} type="text" value={description} />
            </label>
          </div>
          {isAdmin && (
            <div className={style('form-row')}>
              <label>
                Zatwierdź jako administrator:
                <input className={style('input')} onChange={handleOnChangeVisibilityForUsers} type="text" value={visibility} />
              </label>
            </div>
          )}
          <button type="submit">{correctLabel}</button>
          <button onClick={hidePopup} type="button">
            Anuluj
          </button>
        </form>
        <p>Lista autorów:</p>
        <ul>{authorsElements}</ul>
      </div>
    </Modal>
  );
};

export default RecipePopup;

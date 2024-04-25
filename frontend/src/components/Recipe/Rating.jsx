import { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import bemCssModules from "bem-css-modules";
import request from '../../helpers/request';
import { StoreContext } from '../../store/StoreProvider'; 
import { default as RecipeModule } from './Recipe.module.scss';

const style = bemCssModules(RecipeModule);

export default function BasicRating({recipeId, login}) {
  const [value, setValue] = useState(2);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {user} = useContext(StoreContext);

  useEffect(() => {
    setIsSubmitted(false);
  }, [user])

  const handleUpdate = async (val) => {
    setValue(val);
    const res = await request.post('http://localhost:8000/recipes/review', {
        rating: val,
        recipeId: recipeId,
        login: user.login,
    });
    setValue(res.data.average); 
    setIsSubmitted(true);
  }

  useEffect(() => {
    async function fetchRating() {
      const average = await request.get("http://localhost:8000/recipes/review?recipeId=" + recipeId).then(res => res.data.average);
      setValue(average);
    }

    fetchRating();
  }, [recipeId, setValue])

  return (
    <Box 
      sx={{
        '& > legend': { mt: 2},
      }}
    >
        <p className={style()} style={{marginTop: 5, marginLeft: 13}}>Ocena</p>
        <div>
     
        <div style={{display: "flex", justifyContent: "center", marginTop: 5, marginBottom: 5}}>

    {
        isSubmitted || user?.login === undefined ?
        <Rating name="read-only" value={value} readOnly precision={0.5}/>
            :
        <Rating 
        name= {"simple-controlled"}
        value={value}
        onChange={(event, newValue) => {
            handleUpdate(newValue);
        }}
        precision={0.5}
      />
    }
       </div></div>
    </Box>
   
  );
}

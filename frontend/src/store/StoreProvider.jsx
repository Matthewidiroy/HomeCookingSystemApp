import React, {createContext, useEffect, useState} from "react";
import request from "../helpers/request";

export const StoreContext = createContext('st');

const StoreProvider = ({children}) =>{
   const [recipes, setRecipes] =useState([]);
   const [user, setUser] =useState(null);
   const [favouriteRecipes, setFavouriteRecipes] = useState([]);
   
   const fetchData = async () => {
    const { data }= await request.get('/recipes')
    setRecipes(data.recipes);
   };
   
   useEffect(() =>{
    fetchData()
   }, []);
   
   
   return(
        <StoreContext.Provider value={{
            recipes,
            setRecipes,
            user,
            setUser,
            favouriteRecipes,
            setFavouriteRecipes
        }}>
            {children}
        </StoreContext.Provider>
    );
};
export default StoreProvider;
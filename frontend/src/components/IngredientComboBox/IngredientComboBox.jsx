import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const IngredientComboBox = ({ ingredients, onSelect }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleIngredientSelect = (_, selectedOptions) => {
    setSelectedIngredients(selectedOptions);
    onSelect(selectedOptions);
  };
 
  return (
    <Autocomplete
      multiple
      id="ingredient-combo-box"
      options={ingredients}
      value={selectedIngredients}
      onChange={handleIngredientSelect}
      isOptionEqualToValue={(option, value) => option === value}
      renderInput={(params) => (
        <TextField {...params} variant="standard" label="Wybierz składniki..." />
      )}
    />
  );
};

export default IngredientComboBox;

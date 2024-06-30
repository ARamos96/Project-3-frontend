import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { CartContext } from "../../context/cart.context";

import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const { recipes } = useContext(CartContext);
  const [recipesToSearch, setRecipesToSearch] = useState([]);

  useEffect(() => {
    setRecipesToSearch(recipes);
  }, [recipes]);

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={recipesToSearch.map((recipe) => recipe.name)}
        onInputChange={(event, newInputValue) => {
          onSearch(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Recipe"
            InputProps={{
              ...params.InputProps,
              type: "search",
              className: "search-input",
            }}
          />
        )}
      />
    </Stack>
  );
}

export default SearchBar;

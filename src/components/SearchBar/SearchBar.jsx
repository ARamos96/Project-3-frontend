import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

import "./SearchBar.css";

const MONGO_URI = process.env.REACT_APP_SERVER_URL
  ? `${process.env.REACT_APP_SERVER_URL}/dishes`
  : "http://localhost:5005/dishes";

function SearchBar({ onSearch }) {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get(MONGO_URI)
      .then((res) => {
        setRecipes(res.data);
      })
      .catch((err) => {
        console.error("Error getting the recipes:", err);
      });
  }, []);

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={recipes.map((recipe) => recipe.name)}
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
              className: "search-input"
            }}
          />
        )}
      />
    </Stack>
  );
}

export default SearchBar;
import "./LoginPage.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";


// Styled component for the login button
const StyledButton = styled("button")({
  marginTop: "1rem",
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  padding: "10px 20px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#0d47a1",
  },
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    authService
      .login(requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/mealplan");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="LoginPage">
      <h1>
        Login
        </h1>

      <form onSubmit={handleLoginSubmit}>
        <TextField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
          fullWidth
          margin="normal"
          InputProps={{
            style: {
              borderColor: "yellow",
            },
          }}
          variant="outlined"
          required
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
          fullWidth
          margin="normal"
          InputProps={{
            style: {
              borderColor: "yellow",
            },
          }}
          variant="outlined"
          required
        />

        <button type="submit">
          Login
          </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>
        Don't have an account yet? <Link to={"/signup"}>Sign Up</Link>
      </p>
    </div>
  );
}

export default LoginPage;

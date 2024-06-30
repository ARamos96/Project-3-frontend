import "./SignupPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);

  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError(false);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError(false);
  };

  const handleName = (e) => setName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);

  const handlePasswordConfirmation = (e) => {
    setPasswordConfirmation(e.target.value);
    setPasswordConfirmationError(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!email) {
      setEmailError(true);
      valid = false;
    }

    if (!password) {
      setPasswordError(true);
      valid = false;
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError(true);
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      const requestBody = { email, password, name, lastName };
      const response = await authService.signup(requestBody);
      const authToken = response.data.token;
      localStorage.setItem("authToken", authToken);
      navigate("/mealplan");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleTogglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="SignupPage">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignupSubmit} className="form-control">
        <TextField
          error={emailError}
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleEmail}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: 'white' }}
          variant="outlined"
          inputProps={{ sx: { border: '1px solid yellow' } }}
        />
        <FormControl fullWidth margin="normal" variant="outlined" sx={{ backgroundColor: 'white' }}>
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            sx={{ backgroundColor: 'white' }}
            variant="outlined"
            inputProps={{ sx: { border: '1px solid yellow' } }}
          />
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined" sx={{ backgroundColor: 'white' }}>
          <InputLabel htmlFor="outlined-adornment-password-confirmation">Confirm Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-confirmation"
            type={showPasswordConfirmation ? 'text' : 'password'}
            value={passwordConfirmation}
            onChange={handlePasswordConfirmation}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordConfirmationVisibility}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
            sx={{ backgroundColor: 'white' }}
            variant="outlined"
            inputProps={{ sx: { border: '1px solid yellow' } }}
          />
        </FormControl>
        <TextField
          label="Name"
          type="text"
          name="name"
          value={name}
          onChange={handleName}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: 'white' }}
          variant="outlined"
          inputProps={{ sx: { border: '1px solid yellow' } }}
        />
        <TextField
          label="Last Name"
          type="text"
          name="lastName"
          value={lastName}
          onChange={handleLastName}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: 'white' }}
          variant="outlined"
          inputProps={{ sx: { border: '1px solid yellow' } }}
        />
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p>Already have an account? <Link to={"/login"}>Login</Link></p>
    </div>
  );
}

export default SignupPage;

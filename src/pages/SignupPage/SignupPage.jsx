import "./SignupPage.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthContext } from "../../context/auth.context";
import { showToast } from "../../utils/Toast";
import {
  trimObjectValues,
  validatePersonalDetails,
  validatePassword,
} from "../../utils/DataValidation";
import FormFunctions from "../../utils/FormFunctions";
const { handleInputChange } = FormFunctions();

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  useState(false);
  const { handleSignUp } = useContext(AuthContext);

  const navigate = useNavigate();

  const handlePasswordConfirmation = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim all empty strings from formData
    const trimmedFormData = trimObjectValues(formData);

    const personalDetails = {
      name: trimmedFormData.name,
      lastName: trimmedFormData.lastName,
      email: trimmedFormData.email,
    };

    const passwordForm = {
      oldPassword: trimmedFormData.password,
      newPassword: passwordConfirmation,
    };

    // Validate personal details data
    let hasErrorsPersonal = validatePersonalDetails(personalDetails);

    // Validate password
    let hasErrorsPassword = validatePassword(passwordForm);

    // Compare password with confirmed password
    if (trimmedFormData.password !== passwordConfirmation) {
      hasErrorsPassword =
        hasErrorsPassword +
        "\n" +
        "New password and confirm password must match exactly.\n".trim();
    }

    // In case of errors, warn user and return
    if (hasErrorsPersonal && hasErrorsPassword) {
      const bothErrors = hasErrorsPersonal + "\n" + hasErrorsPassword;
      showToast(bothErrors, "warning");
      return;
    } else if (hasErrorsPersonal) {
      showToast(hasErrorsPersonal, "warning");
      return;
    } else if (hasErrorsPassword) {
      showToast(hasErrorsPassword, "warning");
      return;
    }

    try {
      handleSignUp(trimmedFormData);
      navigate("/mealplan");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      if (errorMessage === "User already exists.") {
        showToast(errorMessage, "error");
      } else {
        showToast("Something went wrong. Please try again later.", "error");
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
      <form onSubmit={handleSubmit} className="form-control">
        <TextField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleInputChange(e, setFormData, formData)}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "white" }}
          variant="outlined"
          inputProps={{ sx: { border: "1px solid yellow" } }}
        />
        <FormControl
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ backgroundColor: "white" }}
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            name="password"
            onChange={(e) => handleInputChange(e, setFormData, formData)}
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
            sx={{ backgroundColor: "white" }}
            variant="outlined"
            inputProps={{ sx: { border: "1px solid white" } }}
          />
        </FormControl>
        <FormControl
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ backgroundColor: "white" }}
        >
          <InputLabel htmlFor="outlined-adornment-password-confirmation">
            Confirm Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password-confirmation"
            type={showPasswordConfirmation ? "text" : "password"}
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
                  {showPasswordConfirmation ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
            sx={{ backgroundColor: "white" }}
            variant="outlined"
            inputProps={{ sx: { border: "1px solid white" } }}
          />
        </FormControl>
        <TextField
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => handleInputChange(e, setFormData, formData)}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "white" }}
          variant="outlined"
          inputProps={{ sx: { border: "1px solid yellow" } }}
        />
        <TextField
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={(e) => handleInputChange(e, setFormData, formData)}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "white" }}
          variant="outlined"
          inputProps={{ sx: { border: "1px solid yellow" } }}
        />
        <button type="submit" className="submit-button">
          Sign Up
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </form>
      <p>
        Already have an account? <Link to={"/login"}>Login</Link>
      </p>
    </div>
  );
}

export default SignupPage;

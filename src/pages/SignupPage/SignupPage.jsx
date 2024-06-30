import "./SignupPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);
  const handlePasswordConfirmation = (e) =>
    setPasswordConfirmation(e.target.value);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setPasswordsMatch(false);
      return;
    }
    // Create an object representing the request body
    try {
      const requestBody = { email, password, name, lastName };

      // add for auto logi un once signed up

      const response = await authService.signup(requestBody);
      const authToken = response.data.token;
      localStorage.setItem("authToken", authToken);
      navigate("/mealplan");

      // Send a request to the server using axios
      /* 
    const authToken = localStorage.getItem("authToken");
    axios.post(
      `${process.env.REACT_APP_SERVER_URL}/auth/signup`, 
      requestBody, 
      { headers: { Authorization: `Bearer ${authToken}` },
    })
    .then((response) => {})
    */

      // Or using a service
    } catch (error) {
      // Handling errors
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    }
  };

  // Functions to handle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleTogglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation((prev) => !prev);
  };

  return (
    <div className="SignupPage">
      <h1>Sign Up</h1>

      <form onSubmit={handleSignupSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={handleEmail} />
        <label>Password:</label>
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handlePassword}
            className="form-input"
          />
          <input
            type="checkbox"
            className="password-toggle-checkbox"
            checked={showPassword}
            onChange={handleTogglePasswordVisibility}
          />
          
        </div>

        <label>Confirm Password:</label>
        <div className="password-input-container">
          <input
            type={showPasswordConfirmation ? "text" : "password"}
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmation}
            className="form-input"
          />
          <input
            type="checkbox"
            className="password-toggle-checkbox"
            checked={showPasswordConfirmation}
            onChange={handleTogglePasswordConfirmationVisibility}
          />
        </div>

        {!passwordsMatch && (
          <p className="error-message">
            Passwords do not match. Please try again.
          </p>
        )}
        <label>Name:</label>
        <input type="text" name="name" value={name} onChange={handleName} />
        <label>Last Name:</label>
        <input
          type="text"
          name="Last name"
          value={lastName}
          onChange={handleLastName}
        />
        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Already have account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  );
}

export default SignupPage;

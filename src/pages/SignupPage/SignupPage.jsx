import "./SignupPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
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
  if (error.response && error.response.data && error.response.data.message) {
    const errorDescription = error.response.data.message;
    setErrorMessage(errorDescription);
  } else {
    setErrorMessage("Something went wrong. Please try again later.");
  }
}
};

  return (
    <div className="SignupPage">
      <h1>Sign Up</h1>

      <form onSubmit={handleSignupSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={handleEmail} />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />

        <label>Name:</label>
        <input type="text" name="name" value={name} onChange={handleName} />

        <label>Last Name:</label>
        <input type="text" name="Last name" value={lastName} onChange={handleLastName} />

        <button type="submit">Sign Up
        <span></span><span></span><span></span><span></span>

        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Already have account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  );
}

export default SignupPage;

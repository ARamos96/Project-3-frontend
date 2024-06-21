import React, { useState, useEffect } from "react";
import authService from "../services/auth.service";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = () => {
    // Get the stored token from the localStorage
    const storedToken = localStorage.getItem("authToken");

    // If the token exists in the localStorage
    if (storedToken) {
      // Send a request to the server using axios
      /* 
        axios.get(
          `${process.env.REACT_APP_SERVER_URL}/auth/verify`,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        )
        .then((response) => {})
        */

      // Or using a service
      authService
        .verify()
        .then((response) => {
          // If the server verifies that JWT token is valid  ✅
          const user = response.data;
          // Update state variables
          setIsLoggedIn(true);
          setIsLoading(false);
          if (!localStorage.getItem("user")) {
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            setUser((prevUser) => ({
              ...prevUser,
              ...JSON.parse(localStorage.getItem("user")),
            }));
          }
        })
        .catch((error) => {
          // If the server sends an error response (invalid token) ❌
          // Update state variables
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {
      // If the token is not available
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    // Upon logout, remove the token and user from the localStorage
    removeToken();
    localStorage.removeItem("user");
    authenticateUser();
  };

  const setUserInStorage = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const getUserFromStorage = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  const handleUserPatch = async (changedFields, updateType) => {
    let response;
    if (updateType === "address") {
      response = await authService.patchAddress(
        changedFields,
        user.address._id
      );
    } else if (updateType === "paymentMethod") {
      response = await authService.patchPaymentMethod(
        changedFields,
        user.paymentMethod._id
      );
    } else if (updateType === "password") {
      response = await authService.patchPassword(changedFields, user._id);
    } else if (updateType === "personalDetails") {
      response = await authService.patchPersonalDetails(
        changedFields,
        user._id
      );
    }

    return response;
  };

  const handleUserPost = async (changedFields, updateType) => {
    let response;
    if (updateType === "address") {
      response = await authService.postAddress(changedFields);
    } else if (updateType === "paymentMethod") {
      response = await authService.postPaymentMethod(changedFields);
    } else if (updateType === "personalDetails") {
      response = await authService.postPersonalDetails(changedFields);
    }

    return response;
  };

  const handleUserUpdate = async (changedFields, updateType, isPost) => {
    try {
      let response;
      if (!isPost) {
        response = await handleUserPatch(changedFields, updateType);
      } else {
        response = await handleUserPost(changedFields, updateType);
      }
      updateUserStateAndLocalStorage(response.data, updateType);
    } catch (error) {
      console.error(`Error updating ${updateType}:`, error);
    }
  };

  const updateUserStateAndLocalStorage = (updatedUserData, updateType) => {
    // Control for nested fields
    if (updateType === "address") {
      setUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          address: {
            ...prevUser.address,
            ...updatedUserData,
          },
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        return updatedUser;
      });
    } else if (updateType === "paymentMethod") {
      setUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          paymentMethod: {
            ...prevUser.paymentMethod,
            ...updatedUserData,
          },
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        return updatedUser;
      });
    } else if (updateType === "personalDetails") {
      setUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          ...updatedUserData,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        return updatedUser;
      });
    }
  };

  useEffect(() => {
    // Run this code once the AuthProviderWrapper component in the App loads for the first time.
    // This effect runs when the application and the AuthProviderWrapper component load for the first time.
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        setUser,
        setUserInStorage,
        handleUserUpdate,
        getUserFromStorage,
        storeToken,
        authenticateUser,
        logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };

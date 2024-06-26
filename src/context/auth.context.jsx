import React, { useState, useEffect, useContext } from "react";
import authService from "../services/auth.service";
import { CartContext } from "./cart.context";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
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
          // If user is not in local storage, initialize user with JWT payload
          if (!localStorage.getItem("user")) {
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            // Otherwise, update user state with localStorage
            setUser((prevUser) => ({
              ...prevUser,
              ...JSON.parse(localStorage.getItem("user")),
            }));
            setIsUserLoaded(true);
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
    // Upon logout, remove the token, mealplan and user from the localStorage
    removeToken();
    localStorage.removeItem("user");
    authenticateUser();
    setIsUserLoaded(false);
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
      response = await authService.postAddress(changedFields, user._id);
    } else if (updateType === "paymentMethod") {
      response = await authService.postPaymentMethod(changedFields, user._id);
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
      updateUserStateAndLocalStorage(response.data, updateType, isPost);
    } catch (error) {
      console.error(`Error updating ${updateType}:`, error);
    }
  };

  // isPost can be boolean or a string indicating extra updates from checkout page
  const updateUserStateAndLocalStorage = (
    updatedUserData,
    updateType,
    isPost
  ) => {
    let updatedUser = {};

    // If the update was a post, remove redundant fields
    // (for getChangedFields() in ProfilePage) and continue
    if (isPost && typeof isPost === "boolean") {
      delete updatedUserData._id;
      delete updatedUserData.__v;
      delete updatedUserData.user;
    }

    setUser((prevUser) => {
      if (updateType === undefined) {
        updatedUser = {
          ...prevUser,
          ...updatedUserData,
        };
      } else if (updateType === "address") {
        updatedUser = {
          ...prevUser,
          address: {
            ...prevUser.address,
            ...updatedUserData,
          },
        };
      } else if (updateType === "paymentMethod") {
        updatedUser = {
          ...prevUser,
          paymentMethod: {
            ...prevUser.paymentMethod,
            ...updatedUserData,
          },
        };
      } else if (updateType === "personalDetails") {
        updatedUser = {
          ...prevUser,
          ...updatedUserData,
        };
      } else if (updateType === "subscription") {
        updatedUser = {
          ...prevUser,
          activeSubscription: {
            ...prevUser.activeSubscription,
            ...updatedUserData,
          },
        };
        // if user chooses to add address and/or payment method
        if (isPost === "addAddressToUser" && typeof isPost === "string") {
          updatedUser = {
            ...prevUser,
            address: {
              ...prevUser.address,
              ...updatedUserData.shippingAddress,
            },
          };
        }
        if (
          isPost === "addAddressAndPaymentMethodToUser" &&
          typeof isPost === "string"
        ) {
          updatedUser = {
            ...prevUser,
            address: {
              ...prevUser.address,
              ...updatedUserData.shippingAddress,
            },
            paymentMethod: {
              ...prevUser.paymentMethod,
              ...updatedUserData.paymentMethod,
            },
          };
        }
        if (isPost === "addPaymentMethodToUser" && typeof isPost === "string") {
          updatedUser = {
            ...prevUser,
            paymentMethod: {
              ...prevUser.paymentMethod,
              ...updatedUserData.paymentMethod,
            },
          };
        }
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    });
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
        isUserLoaded,
        setIsUserLoaded,
        setUser,
        setUserInStorage,
        handleUserUpdate,
        getUserFromStorage,
        storeToken,
        authenticateUser,
        logOutUser,
        updateUserStateAndLocalStorage,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };

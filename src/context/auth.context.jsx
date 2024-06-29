import React, { useState, useEffect } from "react";
import authService from "../services/auth.service";
import axios from "axios";
import { CartContext } from "./cart.context";

const AuthContext = React.createContext();
const USERMONGO_URI = `${process.env.REACT_APP_SERVER_URL}/user`;

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [favdishes, setFavdishes] = useState(
    JSON.parse(localStorage.getItem("favdishes")) || []
  );

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = () => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      authService
        .verify()
        .then((response) => {
          const user = response.data;
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
        .catch(() => {
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const removeMealPlan = () => {
    localStorage.removeItem("mealPlan");
  }

  const removeFavDishes = () => {
    localStorage.removeItem("favdishes");
  }

  const logOutUser = () => {
    removeToken();
    removeMealPlan();
    removeFavDishes();
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

  const updateUserStateAndLocalStorage = (
    updatedUserData,
    updateType,
    isPost
  ) => {
    let updatedUser = {};
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
      } else if (updateType === "favDishes") {
        updatedUser = {
          ...prevUser,
          favDishes: [...prevUser.favDishes, ...updatedUserData],
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

  const addFavDish = (dish) => {
    setFavdishes((prevFavdishes) => {
      const updatedFavdishes = [...prevFavdishes, dish];
      localStorage.setItem("favdishes", JSON.stringify(updatedFavdishes));
      return updatedFavdishes;
    });
  };

  const removeFavDish = (dishId) => {
    setFavdishes((prevFavdishes) => {
      const updatedFavdishes = prevFavdishes.filter(
        (dish) => dish._id !== dishId
      );
      localStorage.setItem("favdishes", JSON.stringify(updatedFavdishes));
      return updatedFavdishes;
    });
  };

  const addFavoriteToDB = async (dishes) => {
    const response = await authService.postFavDishes(dishes, user._id);
    updateUserStateAndLocalStorage(response.data, "favdishes");
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {}, [favdishes, isLoggedIn, user]);

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
        favdishes,
        addFavoriteToDB,
        addFavDish,
        removeFavDish,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };

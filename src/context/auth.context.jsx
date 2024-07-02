import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import authService from "../services/auth.service";
import moment from "moment";
const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [newFavDishes, setNewFavDishes] = useState([]);

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  const authenticateUser = async () => {
    const storedToken = localStorage.getItem("authToken");

    // If token exists, verify it
    if (storedToken) {
      try {
        const response = await authService.verify();
        // If the token is valid
        const user = response.data;
        setIsLoggedIn(true);
        setIsLoading(false);
        // If user is not in local storage, initialize user with JWT payload
        if (localStorage.getItem("user") === null) {
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
          // Check if all data is loaded from database
          await checkIfUserDataIsLoaded();
        } else {
          // Otherwise, update user state with localStorage
          const userInStorage = JSON.parse(localStorage.getItem("user"));
          setUser((prevUser) => ({
            ...prevUser,
            ...userInStorage,
          }));
          /////////////////////////////////////////////////
          setIsUserLoaded(true);
        }
      } catch (error) {
        // if token is expired
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        if (errorMessage === "jwt expired") {
          toast.error("Your credentials expired: Please log in again", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // remove stored information
          removeToken();
          localStorage.removeItem("user");
          removeFavDishes();
        } else {
          toast.error("Oops! Something went wrong. Please try again", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        // Check fav dishes in local storage (from whichever user was logged first) and POST if needed
        await isFavDishUpdating();

        // Delete stored information in local storage
        removeFavDishes();
        setUser(null);
        localStorage.removeItem("user");

        // No user logged in but page is loaded
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    } else {
      // If there is no token available
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      removeFavDishes();
      localStorage.removeItem("user");
    }
  };

  const handleSignUp = async (requestBody) => {
    const response = await authService.signup(requestBody);
    storeToken(response.data.authToken);
    authenticateUser();
  };

  // If user has logged in and only contains token payload,
  // check if there is more user data in database
  const checkIfUserDataIsLoaded = async () => {
    const userInStorage = localStorage.getItem("user");
    if (
      JSON.parse(userInStorage) !== null &&
      !isUserLoaded &&
      Object.keys(JSON.parse(userInStorage)).length <= 6
    )
      await loadAllUserData();
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const removeMealPlan = () => {
    localStorage.removeItem("mealPlan");
  };

  const removeFavDishes = () => {
    localStorage.removeItem("newFavDishes");
  };

  // on log out, remove token, user, meal plan, fav dishes, cart
  // meal plan and cart removal have to be supplied (inner context)
  const logOutUser = (deleteMealPlan, emptyCart) => {
    deleteMealPlan();
    emptyCart();

    removeFavDishes();

    // checks for token and removes user from state and storage if none exists
    removeToken();
    authenticateUser();
    setIsUserLoaded(false);
  };

  const setUserInStorage = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const getUserFromStorage = () => {
    return JSON.parse(localStorage.getItem("user"));
  };

  const getNewFavDishesFromStorage = () => {
    return JSON.parse(localStorage.getItem("newFavDishes"));
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
        // overwrite existing favDishes with response from database
        updatedUser = {
          ...prevUser,
          favDishes: [...updatedUserData],
        };
        // save new favDishes into existing favDishes state
        saveDishesInStateAndStorage(updatedUserData);
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
        if (typeof isPost === "string" && isPost === "addAddressToUser") {
          updatedUser = {
            ...prevUser,
            address: {
              ...prevUser.address,
              ...updatedUserData.shippingAddress,
            },
          };
        }
        if (
          typeof isPost === "string" &&
          isPost === "addAddressAndPaymentMethodToUser"
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
        if (typeof isPost === "string" && isPost === "addPaymentMethodToUser") {
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
    // if dish._id is not included in newFavDishes._id, add it
    if (!newFavDishes.find((element) => element._id === dish._id)) {
      setNewFavDishes((prevFavdishes) => {
        const updatedFavdishes = [...prevFavdishes, dish];
        localStorage.setItem("newFavDishes", JSON.stringify(updatedFavdishes));
        return updatedFavdishes;
      });
    }
  };

  const removeFavDish = (dishToDelete) => {
    setNewFavDishes((prevFavdishes) => {
      const updatedFavdishes = prevFavdishes.filter(
        (dish) => dish._id !== dishToDelete._id
      );
      localStorage.setItem("newFavDishes", JSON.stringify(updatedFavdishes));
      return updatedFavdishes;
    });
  };

  // check if the dish is in favorites
  const isInFavorites = (recipeId) => {
    return newFavDishes.some((dish) => dish._id === recipeId);
  };

  // handling favorites
  const handleToggleFavorite = (recipe) => {
    if (isInFavorites(recipe._id)) {
      removeFavDish(recipe);
    } else {
      addFavDish(recipe);
    }
  };

  const hasSameElements = () => {
    // Get newFavDishes from storage
    const newFavDishes = getNewFavDishesFromStorage();

    // Get user from storage
    const storedUser = getUserFromStorage();

    // If both arrays are empty, return true
    if (
      newFavDishes.length === 0 &&
      (!storedUser.favDishes || storedUser.favDishes.length === 0)
    ) {
      return true;
    }

    // If one array is empty and the other is not, return false
    if (
      (newFavDishes.length === 0 &&
        storedUser.favDishes &&
        storedUser.favDishes.length !== 0) ||
      (newFavDishes.length !== 0 &&
        (!storedUser.favDishes || storedUser.favDishes.length === 0))
    ) {
      return false;
    }

    // Extract and sort _id values from both arrays
    const sortedIdsNew = newFavDishes.map((item) => item._id).sort();
    const sortedIdsOld = storedUser.favDishes.map((item) => item._id).sort();

    // If both sorted arrays have different lengths, return false
    if (sortedIdsNew.length !== sortedIdsOld.length) {
      return false;
    }

    // If both sorted arrays have the same ids, then return true
    const hasSameElements = sortedIdsNew.every(
      (value, index) => value === sortedIdsOld[index]
    );

    return hasSameElements;
  };

  const isFavDishUpdating = async () => {
    if (
      isLoggedIn &&
      getUserFromStorage() &&
      getNewFavDishesFromStorage() &&
      getNewFavDishesFromStorage().length >= 0 &&
      !hasSameElements()
    ) {
      await addFavoriteToDB(getNewFavDishesFromStorage());
    }
  };

  const addFavoriteToDB = async (dishes) => {
    const response = await authService.postFavDishes(dishes, user._id);
    updateUserStateAndLocalStorage(response.data, "favDishes");
    return response;
  };

  const saveDishesInStateAndStorage = (dishes) => {
    setNewFavDishes((prevFavdishes) => {
      // Filter out dishes that are already in prevFavdishes
      const uniqueDishes = dishes.filter(
        (newDish) =>
          !prevFavdishes.find((prevDish) => prevDish._id === newDish._id)
      );

      // Merge previous and new unique dishes
      const updatedFavdishes = [...prevFavdishes, ...uniqueDishes];

      // Save the updated dishes array in localStorage
      localStorage.setItem("newFavDishes", JSON.stringify(updatedFavdishes));

      return updatedFavdishes;
    });
  };

  useEffect(() => {
    if (isLoading) authenticateUser();
  });

  // Return false if activeSubscription is null or undefined
  const isActiveSubscriptionInUser = () => {
    return user?.activeSubscription != null;
  };

  const getSubscriptionReorderDate = (createdAt) => {
    // Parse the createdAt date using moment
    const createdDate = moment(createdAt);

    // Check if the date is valid
    if (!createdDate.isValid()) {
      return "Invalid date";
    }

    // Add 7 days to the created date
    const reorderDate = createdDate.add(7, "days");

    // Format the date to include the day of the week, day of the month, and month name
    const formattedDate = reorderDate.format("dddd [the] Do [of] MMMM");

    return formattedDate;
  };

  const loadAllUserData = async () => {
    const userInStorage = JSON.parse(localStorage.getItem("user"));
    if (userInStorage !== null) {
      try {
        const response = await authService.getUser(userInStorage._id);
        updateUserStateAndLocalStorage(response.data, undefined, undefined);
        setIsUserLoaded(true);
        // set fav dishes in state and storage
        saveDishesInStateAndStorage(response.data.favDishes);
      } catch (error) {
        console.log(error);
      }
    }
  };

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
        handleSignUp,
        logOutUser,
        checkIfUserDataIsLoaded,
        updateUserStateAndLocalStorage,
        newFavDishes,
        setNewFavDishes,
        addFavoriteToDB,
        addFavDish,
        removeFavDish,
        isInFavorites,
        handleToggleFavorite,
        hasSameElements,
        isFavDishUpdating,
        isActiveSubscriptionInUser,
        getSubscriptionReorderDate,
        loadAllUserData,
        getNewFavDishesFromStorage,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthProviderWrapper, AuthContext };

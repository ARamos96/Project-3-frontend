import axios from "axios";

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
    });

    // Automatically set JWT token on the request headers for every request
    this.api.interceptors.request.use((config) => {
      // Retrieve the JWT token from the local storage
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
      }

      return config;
    });
  }

  login = (requestBody) => {
    return this.api.post("/auth/login", requestBody);
    // same as
    // return axios.post("http://localhost:5005/auth/login");
  };

  signup = (requestBody) => {
    return this.api.post("/auth/signup", requestBody);
    // same as
    // return axios.post("http://localhost:5005/auth/singup");
  };

  verify = () => {
    return this.api.get("/auth/verify");
    // same as
    // return axios.post("http://localhost:5005/auth/verify");
  };

  patchPersonalDetails = (data, id) => {
    return this.api.patch(`/user/${id}`, data);
    // same as
    // return axios.post("http://localhost:5005/auth/verify");
  };

  patchAddress = (data, id) => {
    return this.api.patch(`/address/${id}`, data);
  };
  patchPassword = (data, id) => {
    return this.api.patch(`/user/${id}/password`, data);
  };

  patchPaymentMethod = (data, id) => {
    return this.api.patch(`/payment/${id}`, data);
  };

  postMealPlan = (requestBody) => {
    return this.api.post("/mealplan", requestBody);
    // same as
    // return axios.post("http://localhost:5005/auth/verify");
  };

  postAddress = (requestBody, id) => {
    return this.api.post(`/user/${id}/address`, requestBody);
  };

  postPaymentMethod = (requestBody, id) => {
    return this.api.post(`/user/${id}/payment`, requestBody);
  };
  postSubscription = (requestBody) => {
    return this.api.post(`/subscription`, requestBody);
  }
}

// Create one instance (object) of the service
const authService = new AuthService();

export default authService;

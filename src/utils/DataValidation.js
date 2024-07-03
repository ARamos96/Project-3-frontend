import moment from "moment";

// Returns an empty string if no errors, return a concatenated string with errors on new lines
const validateMealPlan = (numPeople, numDishes, diet) => {
  let messages = "";

  if (numPeople === 0) {
    messages += "Please select the number of people.\n";
  }

  if (numDishes === 0) {
    messages += "Please select the number of dishes per week.\n";
  }

  if (diet.length === 0) {
    messages += "Please select at least one diet option.\n";
  }

  return messages.trim(); // Remove the trailing newline
};

const validateDeliveryDay = (data) => {
  let messages = "";

  if (data.length === 0) {
    messages += "You must select at least one delivery day.\n";
  }

  const today = moment();
  const tomorrow = today.add(1, "days").format("dddd");

  data.forEach((day) => {
    if (day === tomorrow) {
      const earliestDeliveryDay = moment().add(2, "days").format("dddd");
      messages += `The delivery needs a 48h notice. The earliest delivery can be on ${earliestDeliveryDay}.\n`;
    }
  });

  return messages.trim(); // Remove the trailing newline
};

const validatePaymentMethod = (paymentMethodForm) => {
  const { method, number, expiration, CVV } = paymentMethodForm;
  let messages = "";

  if (!method || !number || !expiration || !CVV) {
    messages += "All payment fields must be filled.\n";
  }

  const cardNumberPattern = /^\d{16}$/;
  if (!cardNumberPattern.test(number)) {
    messages +=
      "Card number must be 16 digits long and contain only numbers.\n";
  }

  const expirationPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expirationPattern.test(expiration)) {
    messages += "Expiration date must be in MM/YY format.\n";
  }

  const cvvPattern = /^\d{3}$/;
  if (!cvvPattern.test(CVV)) {
    messages += "CVV must be 3 digits long and contain only numbers.\n";
  }

  return messages.trim(); // Remove the trailing newline
};

const validateAddress = (addressForm) => {
  const { address, city, region, zipCode, country, phone } = addressForm;
  const messages = [];

  if (!address || !city || !region || !zipCode || !country || !phone) {
    messages.push("All fields must be filled.");
  }

  const zipCodePattern = /^\d+$/;
  if (zipCode && !zipCodePattern.test(zipCode)) {
    messages.push("Zip Code must contain only numbers.");
  }

  const phonePattern = /^\d+$/;
  if (phone && !phonePattern.test(phone)) {
    messages.push("Phone number must contain only numbers.");
  }

  return messages.join("\n").trim(); // Remove trailing newline
};

// Gets an object and calls trim() on all string values, including arrays and nested values
const trimObjectValues = (obj) => {
  const trimmedObject = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "string") {
      trimmedObject[key] = obj[key].trim();
    } else if (Array.isArray(obj[key])) {
      trimmedObject[key] = obj[key].map((item) =>
        typeof item === "string" ? item.trim() : item
      );
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      trimmedObject[key] = trimObjectValues(obj[key]);
    } else {
      trimmedObject[key] = obj[key];
    }
  });

  return trimmedObject;
};

export {
  validateMealPlan,
  trimObjectValues,
  validatePaymentMethod,
  validateDeliveryDay,
  validateAddress,
};

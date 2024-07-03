// Each error is a new line in the messaged array
const validateMealPlan = (numPeople, numDishes, diet) => {
  const messages = [];

  if (numPeople === 0) {
    messages.push("Please select the number of people.");
  }

  if (numDishes === 0) {
    messages.push("Please select the number of dishes per week.");
  }

  if (diet.length === 0) {
    messages.push("Please select at least one diet option.");
  }

  return messages.join('\n');
};

export { validateMealPlan };

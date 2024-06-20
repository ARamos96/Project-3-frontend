function FormFunctions() {
  const handleInputChange = (e, setFormData, formData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return { handleInputChange };
}

export default FormFunctions;

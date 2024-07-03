import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToast = (message, type = "default") => {
  const options = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warning":
      toast.warn(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    default:
      toast(message, options);
  }
};

const showPromiseToast = (promise, pendingMessage, successMessage, errorMessage) => {
  toast.promise(
    promise,
    {
      pending: pendingMessage,
      success: successMessage,
      error: errorMessage,
    },
    {
      position: "top-center",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }
  );
};

export { showToast, showPromiseToast };

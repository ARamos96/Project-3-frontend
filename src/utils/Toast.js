import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OPTIONS = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const showToast = (message, type = "default") => {
  switch (type) {
    case "success":
      toast.success(message, OPTIONS);
      break;
    case "error":
      toast.error(message, OPTIONS);
      break;
    case "warning":
      toast.warn(message, OPTIONS);
      break;
    case "info":
      toast.info(message, OPTIONS);
      break;
    default:
      toast(message, OPTIONS);
  }
};

const showPromiseToast = (
  promise,
  pendingMessage,
  successMessage,
  errorMessage
) => {
  toast.promise(
    promise,
    {
      pending: pendingMessage,
      success: successMessage,
      error: errorMessage,
    },
    OPTIONS
  );
};

export { showToast, showPromiseToast };

type ToastType = "success" | "error";

export const showToast = (
  toast: {
    toast: (options: {
      title: string;
      description?: string;
      className?: string;
    }) => void;
  },
  response: { error: boolean; message?: string },
  type?: ToastType
) => {
  const defaultMessages = {
    success: "Operation completed successfully!",
    error: "An error occurred. Please try again.",
  };

  // Determine title and description
  const title =
    response.message ||
    (response.error
      ? defaultMessages.error
      : defaultMessages.success);

  const description =
    type === "success" && !response.error
      ? defaultMessages.success
      : response.error
      ? defaultMessages.error
      : undefined;

  // Dynamic Tailwind classes based on type
  const baseClasses =
    "p-4 rounded-lg shadow-lg text-white text-sm font-medium";
  const successClasses = "bg-green-500";
  const errorClasses = "bg-red-500";

  const toastClasses = `${baseClasses} ${
    type === "success" && !response.error ? successClasses : errorClasses
  }`;

  // Show toast with Tailwind classes
  toast.toast({
    title,
    description,
    className: toastClasses,
  });
};

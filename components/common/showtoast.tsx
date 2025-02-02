"use client";

export const showToast = (
  toast: {
    toast: (options: {
      title: string;
      description?: string;
      className?: string;
    }) => void;
  },
  response?: { error?: boolean; message?: string }
) => {
  const title = response?.error ? "Error!" : "Success!";
  const description =
    response?.message ||
    (response?.error
      ? "An error occurred. Please try again."
      : "Operation completed successfully!");
  const className = `p-4 rounded-lg shadow-lg text-white text-sm font-medium ${
    response?.error ? "bg-red-500" : "bg-green-500"
  }`;

  toast.toast({
    title,
    description,
    className
  });
};

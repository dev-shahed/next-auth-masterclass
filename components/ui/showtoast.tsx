type ToastType = "success" | "error";

export const showToast = (
  toast: { toast: (options: { title: string; description?: string }) => void },
  response: { error: boolean; message?: string },
  type?: ToastType
) => {
  const title =
    response.message ||
    (response.error ? "Operation Successful" : "Operation Failed!");

  const description =
    type === "success" && !response.error
      ? "Account created successfully, you can login now"
      : undefined; // Add a default description for success if needed.

  toast.toast({
    title,
    description,
  });
};

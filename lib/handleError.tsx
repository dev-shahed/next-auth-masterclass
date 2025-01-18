type ErrorResponse = {
  error: boolean;
  type: string;
  message: string;
};

export const handleError = (error: { code?: string; name?: string; message?: string }): ErrorResponse => {
  if (!error) {
    return {
      error: true,
      type: "unknown_error",
      message: "An unknown error occurred.",
    };
  }

  // Map common PostgreSQL error codes
  switch (error.code || error.name) {
    case "23505": // Duplicate key violation
      return {
        error: true,
        type: "duplicate_error",
        message: "This email is already registered.",
      };

    case "23503": // Foreign key violation
      return {
        error: true,
        type: "foreign_key_error",
        message: "Invalid reference to related data.",
      };

    case "22P02": // Invalid text representation
      return {
        error: true,
        type: "invalid_data_format",
        message: "The data provided has an invalid format.",
      };

    case "08006": // Connection failure
    case "ETIMEDOUT": // General timeout
      return {
        error: true,
        type: "connection_error",
        message: "Database connection failed. Please try again later.",
      };

    case "42601": // SQL syntax error
      return {
        error: true,
        type: "syntax_error",
        message: "A syntax error occurred in the database query.",
      };

    case "23514": // Check constraint violation
      return {
        error: true,
        type: "constraint_violation",
        message: "A constraint violation occurred. Please review your data.",
      };

    case "42501": // Insufficient privileges
      return {
        error: true,
        type: "permission_error",
        message: "You do not have the necessary permissions to perform this action.",
      };

    case "40001": // Serialization failure (e.g., deadlock)
      return {
        error: true,
        type: "transaction_error",
        message: "A transaction conflict occurred. Please try again.",
      };

    case "42P01": // Undefined table
      return {
        error: true,
        type: "undefined_table",
        message: "The requested table does not exist.",
      };

    case "57P03": // Server in recovery
      return {
        error: true,
        type: "server_recovery",
        message: "The database server is in recovery mode. Please try again later.",
      };

    case "invalid_crads": // Custom error case
      return {
        error: true,
        type: "authentication_error",
        message: "Incorrect email or password.",
      };

    default:
      break;
  }

  // Handle application-level errors
  if (error.name === "ValidationError") {
    return {
      error: true,
      type: "validation_error",
      message: error.message || "Validation failed for the input data.",
    };
  }

  if (error.name === "UnauthorizedError") {
    return {
      error: true,
      type: "unauthorized_error",
      message: "You are not authorized to perform this action.",
    };
  }

  if (error.name === "TimeoutError") {
    return {
      error: true,
      type: "timeout_error",
      message: "The operation timed out. Please try again.",
    };
  }

  // Fallback for unexpected errors
  return {
    error: true,
    type: "server_error",
    message: error.message || "An error occurred during the operation.",
  };
};

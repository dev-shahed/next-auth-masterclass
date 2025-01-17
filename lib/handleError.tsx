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
  
    // Map known database and application error codes
    switch (error.code) {
      case "23505": // PostgreSQL: Duplicate key violation
        return {
          error: true,
          type: "duplicate_error",
          message: "This email is already registered.",
        };
  
      case "23503": // PostgreSQL: Foreign key violation
        return {
          error: true,
          type: "foreign_key_error",
          message: "Invalid reference to related data.",
        };
  
      case "08006": // PostgreSQL: Connection failure
      case "ETIMEDOUT": // General connection timeout
        return {
          error: true,
          type: "connection_error",
          message: "Database connection failed. Please try again later.",
        };
  
      case "22P02": // PostgreSQL: Invalid text representation (e.g., incorrect UUID format)
        return {
          error: true,
          type: "invalid_data_format",
          message: "The data provided has an invalid format.",
        };
  
      case "42601": // PostgreSQL: Syntax error in SQL query
        return {
          error: true,
          type: "syntax_error",
          message: "A syntax error occurred in the database query.",
        };
  
      case "23514": // PostgreSQL: Check constraint violation
        return {
          error: true,
          type: "constraint_violation",
          message: "A constraint violation occurred. Please review your data.",
        };
  
      case "42501": // PostgreSQL: Insufficient privileges
        return {
          error: true,
          type: "permission_error",
          message: "You do not have the necessary permissions to perform this action.",
        };
  
      case "40001": // PostgreSQL: Serialization failure (e.g., deadlock)
        return {
          error: true,
          type: "serialization_error",
          message: "A transaction conflict occurred. Please try again.",
        };
  
      case "42P01": // PostgreSQL: Undefined table
        return {
          error: true,
          type: "undefined_table",
          message: "The requested table does not exist in the database.",
        };
  
      case "54001": // PostgreSQL: Statement too complex
        return {
          error: true,
          type: "statement_too_complex",
          message: "The database query is too complex to execute.",
        };
  
      case "57P03": // PostgreSQL: Cannot connect while server is in recovery
        return {
          error: true,
          type: "server_recovery",
          message: "The database server is in recovery mode. Please try again later.",
        };
  
      case "SQLITE_BUSY": // SQLite: Database locked
        return {
          error: true,
          type: "database_locked",
          message: "The database is currently locked. Please try again shortly.",
        };
  
      case "SQLITE_CONSTRAINT": // SQLite: Constraint violation
        return {
          error: true,
          type: "constraint_violation",
          message: "A constraint violation occurred in the database operation.",
        };
        case "invalid_crads":
        return {
          error: true,
          type: "invalid_crads",
          message: "Incorrect email or password",
        };

      // Extend with additional database-specific or application-level cases as needed
      default:
        break;
    }
  
    // Handle generic errors
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
  
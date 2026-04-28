export function getErrorMessage(error, overrides = {}) {
  if (!error.response) {
    return "Network error. Please check your connection.";
  }

  const status = error.response.status;

  if (overrides[status]) {
    return overrides[status];
  }

  // Use backend message if available
  if (error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.response.data && error.response.data.error) {
    return error.response.data.error;
  }

  switch (status) {
    case 400: return "Invalid request. Please check your input.";
    case 401: return "Session expired. Please log in again.";
    case 403: return "You don’t have permission to perform this action.";
    case 404: return "Requested resource was not found.";
    case 409: return "Conflict detected. Please refresh and try again.";
    case 413: return "File too large. Please upload a smaller file.";
    case 422: return "Some fields are invalid. Please review and try again.";
    case 500: return "Server error. Please try again later.";
    default: return "Something went wrong. Please try again.";
  }
}

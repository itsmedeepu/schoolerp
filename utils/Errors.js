class AppError extends Error {
  constructor(statusCode, message) {
    super(message), (this.statusCode = statusCode);
  }
}

class ServerError extends AppError {
  constructor(message) {
    super(500, message);
  }
}

class ValidationError extends AppError {
  constructor(statusCode, message) {
    super(statusCode, message);
  }
}
class DuplicateError extends AppError {
  constructor(statusCode, message) {
    super(statusCode, message);
  }
}
class NotFoundError extends AppError {
  constructor(statusCode, message) {
    super(statusCode, message);
  }
}
module.exports = {
  ServerError,
  ValidationError,
  DuplicateError,
  NotFoundError,
};

import ApiError from '../../helpers/apiError';

class ErrorHandler {
  catchNotFound(req, res, next) {
    const error = new ApiError(
      'Not Found.',
      'The route you are trying to reach was not found',
      404
    );

    next(error);
  }

  catchErrors(error, req, res, next) {
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV === 'dev') console.log(error);

    const { name, message, fields } = error;
    const status = error.statusCode || 500;

    return res.status(status).json({ name, message, fields, status });
  }
}

export default new ErrorHandler();

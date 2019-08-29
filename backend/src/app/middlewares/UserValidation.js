import ApiError from '../../helpers/apiError';
import schemas from '../../helpers/yupSchemas';

class UserValidation {
  async validateStoreUser(req, res, next) {
    try {
      await schemas.storeUser
        .validate(req.body, { abortEarly: false })
        .catch(errors => {
          const schemaErrors = errors.inner.map(err => {
            return { field: err.path, message: err.message };
          });
          throw new ApiError(
            'Validation Error.',
            'Some fields are not valid.',
            400,
            schemaErrors
          );
        });

      next();
    } catch (error) {
      next(error);
    }
  }

  async validateUpdateUser(req, res, next) {
    try {
      await schemas.updateUser
        .validate(req.body, { abortEarly: false })
        .catch(errors => {
          const schemaErrors = errors.inner.map(err => {
            return { field: err.path, message: err.message };
          });
          throw new ApiError(
            'Validation Error.',
            'Some fields are not valid.',
            400,
            schemaErrors
          );
        });

      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserValidation();

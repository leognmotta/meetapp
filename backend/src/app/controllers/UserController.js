import User from '../models/User';
import ApiError from '../../helpers/apiError';

class UserController {
  async store(req, res, next) {
    try {
      const userExists = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExists)
        throw new ApiError(
          'User exists.',
          'The user you are trying to store already exists with this email in our database.',
          400
        );

      const { id, first_name, last_name, email } = await User.create(req.body);

      return res.json({
        id,
        first_name,
        last_name,
        email,
      });
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { email: newEmail, old_password } = req.body;

      const user = await User.findByPk(req.userId);

      if (newEmail && newEmail !== user.email) {
        const userExists = await User.findOne({ where: { email: newEmail } });

        if (userExists)
          throw new ApiError(
            'User exists.',
            'User found with the new email provided.',
            400
          );
      }

      if (old_password && !(await user.checkPassword(old_password)))
        throw new ApiError(
          'Bad password.',
          'The old password does not match.',
          401
        );

      const { id, first_name, last_name, email } = await user.update(req.body);

      return res.json({
        id,
        first_name,
        last_name,
        email,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new UserController();

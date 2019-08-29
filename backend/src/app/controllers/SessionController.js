import jwt from 'jsonwebtoken';
import User from '../models/User';
import ApiError from '../../helpers/apiError';
import authConfig from '../../config/authConfig';

class SessionController {
  async store(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user)
        throw new ApiError(
          'User not found.',
          'No user found with the provided email.',
          401
        );

      if (!(await user.checkPassword(password)))
        throw new ApiError(
          'Bad password.',
          'The password provided does not match.',
          401
        );

      const { id, name } = user;

      return res.json({
        id,
        name,
        email,
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new SessionController();

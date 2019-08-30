import { parseISO, isBefore } from 'date-fns';
import Meetup from '../models/Meetup';

import ApiError from '../../helpers/apiError';

class MeetupController {
  async store(req, res, next) {
    try {
      if (isBefore(parseISO(req.body.date), new Date()))
        throw new ApiError(
          'Invalid past time.',
          'The date you are trying to create a new meetup have already passed.',
          400
        );

      const user_id = req.userId;

      const meetup = await Meetup.create({
        ...req.body,
        user_id,
      });

      return res.json(meetup);
    } catch (error) {
      return next(error);
    }
  }
}

export default new MeetupController();

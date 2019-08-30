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

  async update(req, res, next) {
    try {
      const user_id = req.userId;

      const meetup = await Meetup.findByPk(req.params.id);

      if (meetup.user_id !== user_id)
        throw new ApiError(
          'Meetup does not belong to logged user.',
          "To update this meetup data you most be it's owner.",
          403
        );

      if (isBefore(parseISO(req.body.date), new Date()))
        throw new ApiError(
          'Invalid past time.',
          'The date you are trying to update have already passed.',
          400
        );

      if (meetup.past)
        throw new ApiError(
          'Invalid past time.',
          'You cannot update past meetup.',
          400
        );

      await meetup.update(req.body);

      return res.json(meetup);
    } catch (error) {
      return next(error);
    }
  }
}

export default new MeetupController();

import { parseISO, isBefore, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';

import ApiError from '../../helpers/apiError';

class MeetupController {
  async index(req, res, next) {
    try {
      const { page = 1, perPage = 10, date } = req.query;
      const user_id = req.userId;
      const where = { user_id };

      if (date) {
        const searchDate = parseISO(date);
        where.date = {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        };
      }

      const meetups = await Meetup.findAndCountAll({
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
      });

      const maxPage = Math.ceil(meetups.count / perPage);
      const previousPage = parseInt(page, 10) - 1;
      const hasPreviousPage = previousPage >= 1;
      const nextPage = parseInt(page, 10) + 1;
      const hasNextPage = maxPage > page;
      const currentPage = parseInt(page, 10);

      return res.json({
        data: { meetups: meetups.rows },
        pagination: {
          maxPage,
          currentPage,
          hasPreviousPage,
          previousPage,
          hasNextPage,
          nextPage,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

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

  async delete(req, res, next) {
    try {
      const meetup = await Meetup.findByPk(req.params.id);

      if (!meetup)
        throw new ApiError(
          'Meetup not found.',
          'No meetup was found with the provided id.',
          400
        );

      if (meetup.user_id !== req.userId)
        throw new ApiError(
          'Denied.',
          'You can only delete your own meetups.',
          401
        );

      if (meetup.past)
        throw new ApiError('Past Meetup.', 'Cannot delete past meetups.', 400);

      await meetup.destroy();

      return res.json();
    } catch (error) {
      return next(error);
    }
  }
}

export default new MeetupController();

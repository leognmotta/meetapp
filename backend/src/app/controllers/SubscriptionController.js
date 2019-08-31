import { startOfHour, endOfHour } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import ApiError from '../../helpers/apiError';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res, next) {
    try {
      const subscriptions = await Subscription.findAll({
        where: {
          user_id: req.userId,
        },
        include: [
          {
            model: Meetup,
            where: {
              date: {
                // [Op.gt]: 6,  // >= 6 Greater Than
                [Op.gt]: new Date(),
              },
            },
            required: true,
          },
        ],
        order: [[Meetup, 'date']],
      });

      return res.json(subscriptions);
    } catch (error) {
      return next(error);
    }
  }

  async store(req, res, next) {
    try {
      const meetup = await Meetup.findByPk(req.params.meetupId, {
        include: [
          {
            model: User,
            as: 'organizer',
            attributes: ['id', 'first_name', 'last_name', 'email'],
          },
        ],
      });

      if (meetup.user_id === req.userId)
        throw new ApiError(
          'You own it!',
          'You can not subscribe to your own meetup.',
          400
        );

      if (meetup.past)
        throw new ApiError(
          'Past meetup.',
          'You can not subscribe to past meetups',
          400
        );

      const checkDate = await Subscription.findOne({
        where: {
          user_id: req.userId,
        },
        include: [
          {
            model: Meetup,
            required: true,
            where: {
              date: {
                [Op.between]: [
                  startOfHour(meetup.date),
                  endOfHour(meetup.date),
                ],
              },
            },
          },
        ],
      });

      if (checkDate)
        throw new ApiError(
          'Already subscribed',
          'You can not subscribe to the same meetup twice or two meetups between the same hour.',
          400
        );

      const user = await User.findByPk(req.userId);

      const subscription = await Subscription.create({
        user_id: user.id,
        meetup_id: meetup.id,
      });

      await Queue.add(SubscriptionMail.key, {
        meetup,
        user,
      });

      return res.json(subscription);
    } catch (error) {
      return next(error);
    }
  }
}

export default new SubscriptionController();

import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res, next) {
    try {
      console.log('controller');

      await Queue.add(SubscriptionMail.key, {
        test: 'this is a test, if you read it, then it works!',
      });

      return res.json();
    } catch (error) {
      return next(error);
    }
  }
}

export default new SubscriptionController();

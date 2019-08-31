class SubscriptionController {
  index(req, res, next) {
    try {
      return res.json();
    } catch (error) {
      return next(error);
    }
  }
}

export default new SubscriptionController();

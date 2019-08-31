import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { test } = data;

    console.log(test);

    await Mail.sendMail({
      to: `Some one <test@test.com>`,
      subject: 'test',
      template: 'subscription',
      context: {
        test,
      },
    });
  }
}

export default new SubscriptionMail();

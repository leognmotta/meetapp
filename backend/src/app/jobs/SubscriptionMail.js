import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    const organizer = `${meetup.organizer.first_name} ${meetup.organizer.last_name}`;
    const fullName = `${user.first_name} ${user.last_name}`;

    await Mail.sendMail({
      to: `${organizer} <${meetup.organizer.email}>`,
      subject: `[${meetup.title}] Nova inscrição`,
      template: 'subscription',
      context: {
        organizer,
        meetup: meetup.title,
        user: fullName,
        email: user.email,
      },
    });
  }
}

export default new SubscriptionMail();

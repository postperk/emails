export default {
   offer: {
      filename: 'offer.mjml',
      subject: data => `Thanks ${data.order.customer.firstName} - here's your gift card`
   },
   reminder: {
      filename: 'reminder.mjml',
      subject: data => `${data.order.customer.firstName}, your eGift expires soon`
   }
};

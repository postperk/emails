export default {
   offer: {
      filename: 'offer.mjml',
      subject: data => `Thanks ${data.order.customer.firstName} - here's your gift card`
   }
};

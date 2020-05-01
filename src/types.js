export default {
   offer: {
      filename: 'standard.mjml',
      subject: data =>
         data.brand.tplOffer.subject.replace('{{firstName}}', data.order.customer.firstName),
      transformProp: 'tplOffer',
      transforms: {
         '<%INTRO%>': (tplOffer, data) =>
            tplOffer.intro.replace('{{firstName}}', data.order.customer.firstName),
         '<%BODY%>': (tplOffer, data) =>
            tplOffer.body.replace('{{firstName}}', data.order.customer.firstName),
         '<%EXPIRES%>': '72',
         '<%FOOTER%>': `You're receiving this email in response to your order with {{brand.name}}
            <br />You will not receive further emails unless interest is shown`
      }
   },
   reminder: {
      filename: 'standard.mjml',
      subject: data =>
         data.brand.tplReminder.subject.replace('{{firstName}}', data.order.customer.firstName),
      transformProp: 'tplReminder',
      transforms: {
         '<%INTRO%>': (tplReminder, data) =>
            tplReminder.intro.replace('{{firstName}}', data.order.customer.firstName),
         '<%BODY%>': (tplReminder, data) =>
            tplReminder.body.replace('{{firstName}}', data.order.customer.firstName),
         '<%EXPIRES%>': '24',
         '<%FOOTER%>': `You're receiving this email in response to your order with {{brand.name}}
            <br />You will not receive further emails`
      }
   },
   momDay: {
      filename: 'momDay.mjml',
      subject: data => 'Here\'s your gift cards for Mom',
      transformProp: 'tplSwap',
      transforms: {
         '<%INTRO%>': (tplSwap, data) => {
            const defaultTemplate = data.order.customer.firstName
               ? '{{firstName}}, treat your Mom with these gifts!'
               : 'Treat your Mom with these gifts!';

            return defaultTemplate.replace('{{firstName}}', data.order.customer.firstName);
         },
         '<%BODY%>': (tplSwap, data) =>
            tplSwap.body.replace('{{firstName}}', data.order.customer.firstName),
         '<%EXPIRES%>': '72'
      }
   }
};

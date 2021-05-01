import dayjs from 'dayjs';

export default {
   offer: {
      filename: 'standard.mjml',
      subject: (data) =>
         data.brand.tplOffer.subject.replace(
            '{{firstName}}',
            data.order.customer.firstName
         ),
      transformProp: 'tplOffer',
      transforms: {
         '<%INTRO%>': (tplOffer, data) =>
            tplOffer.intro.replace(
               '{{firstName}}',
               data.order.customer.firstName
            ),
         '<%BODY%>': (tplOffer, data) =>
            tplOffer.body.replace(
               '{{firstName}}',
               data.order.customer.firstName
            ),
         '<%EXPIRES%>': '72',
         '<%FOOTER%>': `You're receiving this email in response to your order with {{brand.name}}
            <br />You will not receive further emails unless interest is shown`
      }
   },
   reminder: {
      filename: 'standard.mjml',
      subject: (data) =>
         data.brand.tplReminder.subject.replace(
            '{{firstName}}',
            data.order.customer.firstName
         ),
      transformProp: 'tplReminder',
      transforms: {
         '<%INTRO%>': (tplReminder, data) =>
            tplReminder.intro.replace(
               '{{firstName}}',
               data.order.customer.firstName
            ),
         '<%BODY%>': (tplReminder, data) =>
            tplReminder.body.replace(
               '{{firstName}}',
               data.order.customer.firstName
            ),
         '<%EXPIRES%>': '24',
         '<%FOOTER%>': `You're receiving this email in response to your order with {{brand.name}}
            <br />You will not receive further emails`
      }
   },
   report: {
      filename: 'brandReport.mjml',
      subject: 'PostPerk Report',
      transforms: {
         '<%DATESTR%>': (template, data) =>
            dayjs(data.startDate).format('MMMM YYYY')
      }
   }
};

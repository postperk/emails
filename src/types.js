export default {
   offer: {
      filename: 'standard.mjml',
      subject: data => `Thanks ${data.order.customer.firstName} - here's your gift card`,
      transformProp: 'tplOffer',
      transforms: {
         '<%INTRO%>': brandTpl => {
            return brandTpl && brandTpl.intro
               ? brandTpl.intro
               : '{{order.customer.firstName}}, here\'s an eGift card on us!';
         },
         '<%BODY%>': brandTpl => {
            return brandTpl && brandTpl.body
               ? brandTpl.body
               : 'Thanks for your order. We\'ve joined with{{#if oneOffer}} this brand partner {{else}} these brand partners {{/if}}that we think you\'ll love. Please enjoy the following on us:';
         },
         '<%EXPIRES%>': '72',
         '<%FOOTER%>':
            'You\'re receiving this email in response to your order with {{brand.name}}<br />You will not receive further emails unless interest is shown'
      }
   },
   reminder: {
      filename: 'standard.mjml',
      subject: 'Reminder: Your eGift expires soon',
      transformProp: 'tplReminder',
      transforms: {
         '<%INTRO%>': brandTpl => {
            return brandTpl && brandTpl.intro
               ? brandTpl.intro
               : '{{order.customer.firstName}}, your eGift is expiring';
         },
         '<%BODY%>': brandTpl => {
            return brandTpl && brandTpl.body
               ? brandTpl.body
               : 'Just a friendly reminder on your eGift, in case you were interested! Thanks again for your order. Please enjoy the following on us:';
         },
         '<%EXPIRES%>': '24',
         '<%FOOTER%>':
            'You\'re receiving this email in response to your order with {{brand.name}}<br />You will not receive further emails'
      }
   }
};

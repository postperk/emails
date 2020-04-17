import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import typeMap from './types';
import htmlToText from 'html-to-text';
import mjml2html from 'mjml';

let templates = {};

const getTemplate = async type => {
   const typeObj = typeMap[type];

   if (type in templates) {
      console.info('Template already cached, returning');
      return templates[type];
   }

   console.info('Reading template file', typeObj.filename);
   const templateBuffer = await fs.readFile(
      path.resolve(`${__dirname}/../templates`, typeObj.filename)
   );

   templates[type] = templateBuffer.toString();
   console.info('Returning freshly read template');
   return templates[type];
};

const applyTransforms = (email, type, data) => {
   console.info('Applying transforms');
   const typeObj = typeMap[type];

   if (!typeObj.transforms) {
      console.info('No transforms for type', type);
      return email;
   }

   const templateObj = data.brand[typeObj.transformProp] || {};

   return Object.keys(typeObj.transforms).reduce((str, curr) => {
      const value = typeObj.transforms[curr];
      return str.split(curr).join(typeof value === 'function' ? value(templateObj, data) : value);
   }, email);
};

const dataAugmentation = (type, original) => {
   const standard = () => {
      let data = original;
      // Flags
      data.oneOffer = data.order.offers.length === 1;
      data.twoOffers = data.order.offers.length === 2;
      data.threeOffers = data.order.offers.length === 3;

      // Adding redirects
      data.order.offers = data.order.offers.map((offer, index) => ({
         ...offer,
         redirectLink: `${data.cfunctions}/linkRedirect?linkId=${data.emailId}-${index}`
      }));

      return data;
   };

   const mutations = {
      offer: () => {
         return standard();
      },
      reminder: () => {
         return standard();
      }
   };

   return mutations[type] ? mutations[type]() : original;
};

export const compile = async (type, dataOriginal) => {
   try {
      console.info('Received type ', type);
      if (!(type in typeMap)) {
         throw new Error('Invalid Type');
      }

      const emailRaw = await getTemplate(type);

      // Apply data transforms
      const data = dataAugmentation(type, dataOriginal);

      // Apply email transforms
      const email = applyTransforms(emailRaw, type, data);

      console.info('Fetched template, now compiling');

      const template = Handlebars.compile(email);
      const mjml = template(data);
      const { html } = mjml2html(mjml);
      const text = htmlToText.fromString(html, {
         ignoreImage: true
      });

      console.info('Emails module: Done');
      return {
         content: { html, text },
         subject:
            typeof typeMap[type].subject === 'function'
               ? typeMap[type].subject(data)
               : typeMap[type].subject
      };
   } catch (e) {
      e.message = `Error compiling template for type ${type}: ${e.message}`;
      throw e;
   }
};

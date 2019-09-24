import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import typeMap from './types';

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

const applyTransforms = (email, type, brand) => {
   console.info('Applying transforms');
   const typeObj = typeMap[type];

   if (!typeObj.transforms) {
      console.info('No transforms for type', type);
      return email;
   }

   const templateObj = brand[typeObj.transformProp] || {};

   return Object.keys(typeObj.transforms).reduce((str, curr) => {
      const value = typeObj.transforms[curr];
      return str.split(curr).join(typeof value === 'function' ? value(templateObj) : value);
   }, email);
};

const dataMutations = (type, original) => {
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

export const compile = async (type, data) => {
   try {
      console.info('Received type ', type);
      if (!(type in typeMap)) {
         throw new Error('Invalid Type');
      }

      const emailRaw = await getTemplate(type);
      const email = applyTransforms(emailRaw, type, data.brand);

      console.info('Fetched template, now compiling');

      data = dataMutations(type, data);

      const template = Handlebars.compile(email);
      const mjml = template(data);
      const { html } = mjml2html(mjml);

      console.info('Emails module: Done');
      return {
         content: html,
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

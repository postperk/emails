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

export const compile = async (type, data) => {
   try {
      console.info('Received type ', type);
      if (!(type in typeMap)) {
         throw new Error('Invalid Type');
      }

      const email = await getTemplate(type);

      console.info('Fetched template, now compiling');

      // Flag when only one promotion
      data.onlyOne = data.order.offers.length === 1;

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

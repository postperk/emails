import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import typeMap from './types';

import showdown from 'showdown';

const markdownConverter = new showdown.Converter();

let templates = {};

const cloudFunctions = {
   prod: 'https://us-central1-postperk-dashboard.cloudfunctions.net',
   dev: 'https://us-central1-postperk-dashboard-dev.cloudfunctions.net'
};

const generateUnsubscribeLink = data =>
   `${cloudFunctions[data.env ? data.env : 'dev']}/emailUnsubscribe?emailId=${data.email.id}`;

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

const convertTemplatesToHtml = (type, data) => {
   if (type === 'welcome') {
      const tplWelcome = data.brand.tplWelcome;
      tplWelcome.first = markdownConverter
         .makeHtml(tplWelcome.first)
         .replace('<p>', '')
         .replace('</p>', '');
      tplWelcome.second = tplWelcome.second
         ? markdownConverter
            .makeHtml(tplWelcome.second)
            .replace('<p>', '')
            .replace('</p>', '')
         : tplWelcome.second;
   }
};

export const compile = async (type, data) => {
   try {
      console.info('Received type ', type);
      if (!(type in typeMap)) {
         throw new Error('Invalid Type');
      }

      const email = await getTemplate(type);
      console.info('Fetched template, now compiling');
      const template = Handlebars.compile(email);

      // Adding unsubscribe link
      data.email.unsubscribeLink = generateUnsubscribeLink(data);

      // Utilize new smaller background image if available
      if (data.brand.backgrounds && data.brand.backgrounds.small) {
         data.brand.backgroundImageUrl = data.brand.backgrounds.small;
      }

      convertTemplatesToHtml(type, data);

      console.info('Emails module: Done');
      return {
         content: template(data),
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

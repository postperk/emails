import * as emails from './index';
import orderMockData from './testData/order.json';
import brandMockData from './testData/brand.json';
import fs from 'fs-extra';

console.info = jest.fn();

describe('Emails', () => {
   it('Offer email will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData
      });

      await fs.writeFile('./generated/offer_two.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with only one offer will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [ orderMockData.offers[0] ]
         })
      });

      await fs.writeFile('./generated/offer_one.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with brand from different country', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            addressZip: '',
            addressCountry: 'CA',
            addressState: 'ON',
            addressCity: 'Scarbourgh'
         },
         order: Object.assign({}, orderMockData, {
            offers: [ orderMockData.offers[0] ]
         })
      });

      await fs.writeFile('./generated/offer_one_canada.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with three offers will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData
      });

      await fs.writeFile('./generated/offer_three.html', compiled.content.html);
      await fs.writeFile('./generated/offer_three.txt', compiled.content.text);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
      expect(compiled.content.text).toMatchSnapshot();
   });

   it('Offer email with three offers with custom brand template will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            tplOffer: {
               ...brandMockData.tplOffer,
               intro: 'blah blah {{order.customer.firstName}}',
               body: 'Thanks from {{brand.name}}, blah blah custom text'
            }
         },
         order: orderMockData
      });

      await fs.writeFile('./generated/offer_three_custom.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with hightlight color', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            highlightColor: '#E92076'
         },
         order: orderMockData
      });

      await fs.writeFile('./generated/offer_three_highlight.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with custom font', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            brandFontFamily:
               'Century Gothic, Heiti SC, STHeiti, Avenir, Trebuchet MS, Arial, sans‑serif'
         },
         order: orderMockData
      });

      await fs.writeFile('./generated/offer_three_custom_font.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with three offers with custom subject', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            tplOffer: {
               ...brandMockData.tplOffer,
               subject: 'Thanks {{firstName}}, here\'s a gift card on us!'
            }
         },
         order: orderMockData
      });

      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with three offers with custom subject without firstName variable', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            tplOffer: {
               ...brandMockData.tplOffer,
               subject: 'Whoa buddy here\'s a gift card on us!'
            }
         },
         order: orderMockData
      });

      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with no code with match snapshot', async () => {
      let newOffer = { ...orderMockData.offers[0] };
      delete newOffer.code;

      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [ orderMockData.offers[1], newOffer ]
         })
      });

      await fs.writeFile('./generated/offer_nocode.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Reminder email will match snapshot', async () => {
      const compiled = await emails.compile('reminder', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData
      });

      await fs.writeFile('./generated/reminder.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('MomDay email will match snapshot', async () => {
      const compiled = await emails.compile('momDay', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            addressDetail: '123 Blank Rd',
            addressCity: 'NosVille',
            addressState: 'OK',
            addressZip: '12345',
            name: 'Fake Brand',
            tplSwap: {
               intro: '{{firstName}}, treat your Mom with these gifts!',
               body:
                  'We\'ve joined with these partners that we think your Mom will love! Enjoy these exclusive discounts on us. 👩🥰👩‍👧‍👧'
            },
            logos: {
               email:
                  'https://storage.googleapis.com/pperk-dashboard.appspot.com/logos%2FyjgQ86oFbptMtdty5hMx-email?GoogleAccessId=firebase-adminsdk-qr9rh%40pperk-dashboard.iam.gserviceaccount.com&Expires=3607545600&Signature=YhnshyZDQiqVTTtK7%2BS4qihd9AEA0aByrI6wH6hwrd6UNppWrkUJ52VxQzSNvriV4Gt9JwbEUtOg2F3e62EbP74aQ%2Fk3XUeCSj5xybRJB%2FFPCuLj9nnlPEq%2FMPszGt346OSvIwb2WdRUoTRrR608UiifAzTrDvByWuIQSDVIahRGS5ekaysdoGa3VyhejC%2BAKQcA6iqTOYXk7A3gIu5jtIPtNu3hvtOv63UTxKnaR%2BdBXqrNJVQfC4R2gnUG%2FDfzgdEL7t12SoAUprQahWS6qOmP1w5kTxcNEAKeQY9kJjuSobUvA2%2Bp3XlTIg%2BEWf6Quby2%2BMFWFf7Eor9zFronOQ%3D%3D'
            }
         },
         order: orderMockData
      });

      await fs.writeFile('./generated/momDay.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
   });

   it('MomDay email will include appendToFooterBrand content', async () => {
      const compiled = await emails.compile('momDay', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            addressDetail: '123 Blank Rd',
            addressCity: 'NosVille',
            addressState: 'OK',
            addressZip: '12345',
            name: 'Fake Brand',
            appendToFooterBrand: 'LLC',
            tplSwap: {
               intro: '{{firstName}}, treat your Mom with these gifts!',
               body:
                  'We\'ve joined with these partners that we think your Mom will love! Enjoy these exclusive discounts on us. 👩🥰👩‍👧‍👧'
            },
            logos: {
               email:
                  'https://storage.googleapis.com/pperk-dashboard.appspot.com/logos%2FyjgQ86oFbptMtdty5hMx-email?GoogleAccessId=firebase-adminsdk-qr9rh%40pperk-dashboard.iam.gserviceaccount.com&Expires=3607545600&Signature=YhnshyZDQiqVTTtK7%2BS4qihd9AEA0aByrI6wH6hwrd6UNppWrkUJ52VxQzSNvriV4Gt9JwbEUtOg2F3e62EbP74aQ%2Fk3XUeCSj5xybRJB%2FFPCuLj9nnlPEq%2FMPszGt346OSvIwb2WdRUoTRrR608UiifAzTrDvByWuIQSDVIahRGS5ekaysdoGa3VyhejC%2BAKQcA6iqTOYXk7A3gIu5jtIPtNu3hvtOv63UTxKnaR%2BdBXqrNJVQfC4R2gnUG%2FDfzgdEL7t12SoAUprQahWS6qOmP1w5kTxcNEAKeQY9kJjuSobUvA2%2Bp3XlTIg%2BEWf6Quby2%2BMFWFf7Eor9zFronOQ%3D%3D'
            }
         },
         order: orderMockData
      });

      await fs.writeFile('./generated/momDay_withAppendFooterBrand.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
   });

   it('MomDay email with no name will match snapshot', async () => {
      const compiled = await emails.compile('momDay', {
         unhashedEmail: 'joel@notreally.com',
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            addressDetail: '123 Blank Rd',
            addressCity: 'NosVille',
            addressState: 'OK',
            addressZip: '12345',
            name: 'Fake Brand',
            tplSwap: {
               intro: '{{firstName}}, treat your Mom with these gifts!',
               body:
                  'We\'ve joined with these partners that we think your Mom will love! Enjoy these exclusive discounts on us. 👩🥰'
            },
            logos: {
               email:
                  'https://storage.googleapis.com/pperk-dashboard.appspot.com/logos%2FyjgQ86oFbptMtdty5hMx-email?GoogleAccessId=firebase-adminsdk-qr9rh%40pperk-dashboard.iam.gserviceaccount.com&Expires=3607545600&Signature=YhnshyZDQiqVTTtK7%2BS4qihd9AEA0aByrI6wH6hwrd6UNppWrkUJ52VxQzSNvriV4Gt9JwbEUtOg2F3e62EbP74aQ%2Fk3XUeCSj5xybRJB%2FFPCuLj9nnlPEq%2FMPszGt346OSvIwb2WdRUoTRrR608UiifAzTrDvByWuIQSDVIahRGS5ekaysdoGa3VyhejC%2BAKQcA6iqTOYXk7A3gIu5jtIPtNu3hvtOv63UTxKnaR%2BdBXqrNJVQfC4R2gnUG%2FDfzgdEL7t12SoAUprQahWS6qOmP1w5kTxcNEAKeQY9kJjuSobUvA2%2Bp3XlTIg%2BEWf6Quby2%2BMFWFf7Eor9zFronOQ%3D%3D'
            }
         },
         order: { ...orderMockData, customer: { ...orderMockData.customer, firstName: '' } }
      });

      console.log(compiled.subject);

      await fs.writeFile('./generated/momDay_noName.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
   });
});

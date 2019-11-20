import * as emails from './index';
import orderMockData from './testData/order.json';
import brandMockData from './testData/brand.json';
import fs from 'fs-extra';

console.info = jest.fn();

describe('Emails', () => {
   it('Offer email will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData
      });

      await fs.writeFile('./generated/offer_two.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Offer email with only one offer will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [ orderMockData.offers[0] ]
         })
      });

      await fs.writeFile('./generated/offer_one.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Offer email with brand from different country', async () => {
      const compiled = await emails.compile('offer', {
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

      await fs.writeFile('./generated/offer_one_canada.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Offer email with three offers will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData
      });

      await fs.writeFile('./generated/offer_three.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with three offers with custom brand template will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            tplOffer: {
               intro: 'blah blah {{order.customer.firstName}}',
               body: 'Thanks from {{brand.name}}, blah blah custom text'
            }
         },
         order: orderMockData
      });

      await fs.writeFile('./generated/offer_three_custom.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Offer email with three offers with custom subject', async () => {
      const compiled = await emails.compile('offer', {
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            tplOffer: {
               subject: 'here\'s a gift card on us!'
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
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [ orderMockData.offers[1], newOffer ]
         })
      });

      await fs.writeFile('./generated/offer_nocode.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Reminder email will match snapshot', async () => {
      const compiled = await emails.compile('reminder', {
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData
      });

      await fs.writeFile('./generated/reminder.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Incentive email will match snapshot', async () => {
      const compiled = await emails.compile('incentive', {
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData,
         notificationId: 'vt2AORijdm5V48bVThlR',
         env: 'dev',
         giftCardAmount: 2
      });

      await fs.writeFile('./generated/incentive.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });
});

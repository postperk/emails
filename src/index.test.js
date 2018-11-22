import * as emails from './index';
import orderMockData from './testData/order.json';
import brandMockData from './testData/brand.json';
import fs from 'fs-extra';

console.info = jest.fn();

describe('Emails', () => {
   it('Offer email will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         brand: brandMockData,
         order: orderMockData
      });

      await fs.writeFile('./generated/offer_two.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Offer email with only one offer will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [ orderMockData.offers[0] ]
         })
      });

      await fs.writeFile('./generated/offer_one.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Offer email with three offers will match snapshot', async () => {
      const newOffer = { ...orderMockData.offers[0], brandName: 'brand D', docId: 'brandD' };
      const newOffers = [ ...orderMockData.offers ].concat([ newOffer ]);

      const compiled = await emails.compile('offer', {
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [ ...orderMockData.offers, newOffer ]
         })
      });

      await fs.writeFile('./generated/offer_three.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Offer email with no code with match snapshot', async () => {
      let newOffer = { ...orderMockData.offers[0] };
      delete newOffer.code;
      const newOffers = [ ...orderMockData.offers ].concat([ newOffer ]);

      const compiled = await emails.compile('offer', {
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [ orderMockData.offers[1], newOffer ]
         })
      });

      await fs.writeFile('./generated/offer_nocode.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });
});

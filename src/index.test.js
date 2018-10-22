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

      await fs.writeFile('./generated/offer.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Offer email with only one offer will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [ orderMockData.offers.shift() ]
         })
      });

      await fs.writeFile('./generated/offer_one.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });
});

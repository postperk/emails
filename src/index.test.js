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
});

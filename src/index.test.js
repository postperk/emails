import * as emails from './index';
import orderMockData from './testData/order.json';
import brandMockData from './testData/brand.json';
import fs from 'fs-extra';

console.info = jest.fn();

describe('Emails', () => {
   it('Welcome email will match snapshot', async () => {
      const compiled = await emails.compile('welcome', {
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'mockEmailId' }
      });

      await fs.writeFile('./generated/welcome.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('will leave out background image block if it is set', async () => {
      const compiled = await emails.compile('welcome', {
         brand: Object.assign({}, brandMockData, {
            backgroundImageUrl: 'http://blah.com/blah.jpg'
         }),
         order: orderMockData,
         email: { id: 'mockEmailId' }
      });

      expect(compiled.content).toMatchSnapshot();
   });

   it('Followup one email will match snapshot', async () => {
      const compiled = await emails.compile('followOne', {
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'mockEmailId' }
      });

      await fs.writeFile('./generated/followOne.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Followup two email will match snapshot', async () => {
      const compiled = await emails.compile('followTwo', {
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'mockEmailId' }
      });

      await fs.writeFile('./generated/followTwo.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Deliver reward email will match snapshot', async () => {
      const compiled = await emails.compile('deliver', {
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'mockEmailId' }
      });

      await fs.writeFile('./generated/deliver.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Hashtag reminder will match snapshot', async () => {
      const compiled = await emails.compile('hashtag', {
         hashtag: '#DEMOTAG',
         reward: '20 ponies',
         userIsPrivate: false,
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'emailMockId' }
      });

      await fs.writeFile('./generated/hashtag.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Post reminder one will match snapshot', async () => {
      const compiled = await emails.compile('postReminderOne', {
         hashtag: '#DEMOTAG',
         reward: 'a 20% off coupon',
         userIsPrivate: false,
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'emailMockId' }
      });

      await fs.writeFile('./generated/postReminderOne.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Post reminder one for private account will match snapshot', async () => {
      const compiled = await emails.compile('postReminderOne', {
         hashtag: '#DEMOTAG',
         reward: 'a 20% off coupon',
         userIsPrivate: true,
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'emailMockId' }
      });

      await fs.writeFile('./generated/postReminderOne-private.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Post reminder two will match snapshot', async () => {
      const compiled = await emails.compile('postReminderTwo', {
         hashtag: '#DEMOTAG',
         reward: 'a 20% off coupon',
         userIsPrivate: false,
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'emailMockId' }
      });

      await fs.writeFile('./generated/postReminderTwo.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Post reminder two for private account will match snapshot', async () => {
      const compiled = await emails.compile('postReminderTwo', {
         hashtag: '#DEMOTAG',
         reward: 'a 20% off coupon',
         userIsPrivate: true,
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'emailMockId' }
      });

      await fs.writeFile('./generated/postReminderTwo-private.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Hashtag reminder for private user will match snapshot', async () => {
      const compiled = await emails.compile('hashtag', {
         hashtag: '#DEMOTAG',
         reward: '20 ponies',
         userIsPrivate: true,
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'emailMockId' }
      });

      await fs.writeFile('./generated/hashtag-private.html', compiled.content);
      expect(compiled.content).toMatchSnapshot();
   });

   it('Should return the correct subject for welcome email', async () => {
      const compiled = await emails.compile('welcome', {
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'mockEmailId' }
      });

      expect(compiled.subject).toBeTruthy();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Should return the correct subject for followOne email', async () => {
      const compiled = await emails.compile('followOne', {
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'mockEmailId' }
      });

      expect(compiled.subject).toBeTruthy();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Should return the correct subject for followTwo email', async () => {
      const compiled = await emails.compile('followTwo', {
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'mockEmailId' }
      });

      expect(compiled.subject).toBeTruthy();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Should return the correct subject for deliver email', async () => {
      const compiled = await emails.compile('deliver', {
         brand: brandMockData,
         order: orderMockData,
         email: { id: 'mockEmailId' }
      });

      expect(compiled.subject).toBeTruthy();
      expect(compiled.subject).toMatchSnapshot();
   });

   // it('Should correctly inject background image url', async () => {
   //    const backgroundImageUrl = 'http://testnotreally.com/safldkj';

   //    const compiled = await emails.compile('welcome', {
   //       brand: Object.assign({}, brandMockData, { backgroundImageUrl }),
   //       order: orderMockData,
   //       email: { id: 'mockEmailId' }
   //    });

   //    expect(!!~compiled.content.indexOf(backgroundImageUrl)).toEqual(true);
   // });

   // it('Should utilize new smaller background if available', async () => {
   //    const backgroundImageUrl = 'http://testnotreally.com/bg.jpg';
   //    const smallerBackgroundUrl = 'http://testnotreally.com/bg-small.jpg';

   //    const compiled = await emails.compile('welcome', {
   //       brand: Object.assign({}, brandMockData, {
   //          backgroundImageUrl,
   //          backgrounds: { small: smallerBackgroundUrl }
   //       }),
   //       order: orderMockData,
   //       email: { id: 'mockEmailId' }
   //    });

   //    expect(!!~compiled.content.indexOf(smallerBackgroundUrl)).toEqual(true);
   //    expect(!!~compiled.content.indexOf(backgroundImageUrl)).toEqual(false);
   // });
});

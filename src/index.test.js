import * as emails from './index';
import orderMockData from './testData/order.json';
import brandMockData from './testData/brand.json';
import fs from 'fs-extra';

console.info = jest.fn();

describe('Emails', () => {
   it('Offer email will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData,
         env: 'prod'
      });

      await fs.writeFile('./generated/offer_two.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with only one offer will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [orderMockData.offers[0]]
         }),
         env: 'prod'
      });

      await fs.writeFile('./generated/offer_one.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with brand from different country', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
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
            offers: [orderMockData.offers[0]]
         }),
         env: 'prod'
      });

      await fs.writeFile(
         './generated/offer_one_canada.html',
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with three offers will match snapshot', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData,
         env: 'prod'
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
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
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
         order: orderMockData,
         env: 'prod'
      });

      await fs.writeFile(
         './generated/offer_three_custom.html',
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with hightlight color', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            highlightColor: '#E92076'
         },
         order: orderMockData,
         env: 'prod'
      });

      await fs.writeFile(
         './generated/offer_three_highlight.html',
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with custom font', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            brandFontFamily:
               'Century Gothic, Heiti SC, STHeiti, Avenir, Trebuchet MS, Arial, sans‑serif'
         },
         order: orderMockData,
         env: 'prod'
      });

      await fs.writeFile(
         './generated/offer_three_custom_font.html',
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with three offers with custom subject', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            tplOffer: {
               ...brandMockData.tplOffer,
               subject: "Thanks {{firstName}}, here's a gift card on us!"
            }
         },
         order: orderMockData,
         env: 'prod'
      });

      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with three offers with custom subject without firstName variable', async () => {
      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            tplOffer: {
               ...brandMockData.tplOffer,
               subject: "Whoa buddy here's a gift card on us!"
            }
         },
         order: orderMockData,
         env: 'prod'
      });

      expect(compiled.subject).toMatchSnapshot();
   });

   it('Offer email with no code with match snapshot', async () => {
      let newOffer = { ...orderMockData.offers[0] };
      delete newOffer.code;

      const compiled = await emails.compile('offer', {
         unhashedEmail: 'joel@notreally.com',
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [orderMockData.offers[1], newOffer]
         }),
         env: 'prod'
      });

      await fs.writeFile(
         './generated/offer_nocode.html',
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Reminder email will match snapshot', async () => {
      const compiled = await emails.compile('reminder', {
         unhashedEmail: 'joel@notreally.com',
         shortLinks: {
            offers: [
               'https://offerOneLink.com',
               'https://offerTwoLink.com',
               'https://offerThreeLink.com'
            ],
            unsubscribe: 'https://unsubLink.com',
            pixel: 'https://pixellink.com'
         },
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData,
         env: 'prod'
      });

      await fs.writeFile('./generated/reminder.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Brand report email will match snapshot for custom brand', async () => {
      const compiled = await emails.compile('report', {
         brand: {
            name: 'Earfleek',
            platformSelection: 'custom'
         },
         stats: {
            numEmails: 1445,
            numEmailsOpened: 926,
            numEmailsClicked: 94,
            numConversions: 21,
            conversionsValue: '0.00',
            conversionsCost: '84.00',
            numActiveBrands: 29,
            numNewBrands: 0,
            brandsPromoting: 10,
            brandsBeingPromotedBy: 9,
            emailOpenRate: 65,
            emailClickRate: '10.15',
            conversionRate: '22.34',
            customerAcquisitionCost: '4.00',
            roas: '0.0'
         },
         startDate: '2021-04-01T00:00:00.000Z',
         endDate: '2021-05-01T00:00:00.000Z',
         env: 'prod',
         cfunctions: 'https://us-central1-pperk-dashboard.cloudfunctions.net'
      });

      await fs.writeFile(
         './generated/report-custom.html',
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Brand report email will match snapshot for standard brand', async () => {
      const compiled = await emails.compile('report', {
         brand: {
            name: 'Earfleek',
            platformSelection: 'shopify'
         },
         stats: {
            numEmails: 1445,
            numEmailsOpened: 926,
            numEmailsClicked: 94,
            numConversions: 21,
            conversionsValue: '126.00',
            conversionsCost: '84.00',
            numActiveBrands: 29,
            numNewBrands: 9,
            brandsPromoting: 10,
            brandsBeingPromotedBy: 9,
            emailOpenRate: 65,
            emailClickRate: '10.15',
            conversionRate: '22.34',
            customerAcquisitionCost: '4.00',
            roas: '2.7'
         },
         startDate: '2021-04-01T00:00:00.000Z',
         endDate: '2021-05-01T00:00:00.000Z',
         env: 'prod',
         cfunctions: 'https://us-central1-pperk-dashboard.cloudfunctions.net'
      });

      await fs.writeFile(
         './generated/report-standard.html',
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Brand report email will match when no conversions', async () => {
      const compiled = await emails.compile('report', {
         brand: {
            name: 'Earfleek',
            platformSelection: 'shopify'
         },
         stats: {
            numEmails: 1445,
            numEmailsOpened: 926,
            numEmailsClicked: 94,
            numConversions: 0,
            conversionsValue: 0,
            conversionsCost: 1,
            numActiveBrands: 29,
            numNewBrands: 9,
            brandsPromoting: 10,
            brandsBeingPromotedBy: 9,
            emailOpenRate: 65,
            emailClickRate: '10.15',
            conversionRate: 0,
            customerAcquisitionCost: '4.00',
            roas: 0 / 0
         },
         startDate: '2021-04-01T00:00:00.000Z',
         endDate: '2021-05-01T00:00:00.000Z',
         env: 'prod',
         cfunctions: 'https://us-central1-pperk-dashboard.cloudfunctions.net'
      });

      await fs.writeFile(
         './generated/report-no-conversions.html',
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });
});

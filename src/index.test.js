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
            offers: [orderMockData.offers[0]]
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
            offers: [orderMockData.offers[0]]
         })
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
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            highlightColor: '#E92076'
         },
         order: orderMockData
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
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            brandFontFamily:
               'Century Gothic, Heiti SC, STHeiti, Avenir, Trebuchet MS, Arial, sans‑serif'
         },
         order: orderMockData
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
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: {
            ...brandMockData,
            tplOffer: {
               ...brandMockData.tplOffer,
               subject: "Thanks {{firstName}}, here's a gift card on us!"
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
               subject: "Whoa buddy here's a gift card on us!"
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
            offers: [orderMockData.offers[1], newOffer]
         })
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
         emailId: 'testEmailId',
         cfunctions: 'http://notreally.com',
         brand: brandMockData,
         order: orderMockData
      });

      await fs.writeFile('./generated/reminder.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it('Brand report email will match snapshot', async () => {
      const compiled = await emails.compile('report', {
         brand: {
            docId: 'yjgQ86oFbptMtdty5hMx',
            offerGlobalCode: 'PERK50',
            offerCodeSource: 'global',
            emailDisplayName: 'Avi',
            cardImageUrl:
               'https://firebasestorage.googleapis.com/v0/b/pperk-dashboard.appspot.com/o/cards%2FyjgQ86oFbptMtdty5hMx_1912011129?alt=media&token=e106e0cb-aaa0-440c-b928-7e827b5c8447',
            brandCategory: 'earring subscription',
            addressCountry: '',
            name: 'Earfleek',
            cpa: 4,
            addressCity: 'Los Angeles',
            offerLink:
               'https://www.earfleek.com/subscribe/?utm_source=postperk',
            offerAmount: 50,
            addressState: 'CA',
            ratioThreshold: 0.95,
            brandFilterType: 'whitelist',
            platformSelection: 'custom',
            logoImageUrl:
               'https://firebasestorage.googleapis.com/v0/b/pperk-dashboard.appspot.com/o/logos%2FyjgQ86oFbptMtdty5hMx?alt=media&token=e3a30e39-47c7-4897-a783-1cb00b589e62',
            counts: { emails: 154, promotions: 462, impressions: 534 },
            offerType: 'percent',
            productType: 'jewelry',
            emailReplyTo: 'avi@ivoryclasp.com',
            demoGender: 'female',
            tagline: 'Enjoy 50% off monthly earrings - starting at $3.49',
            active: true
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

      await fs.writeFile('./generated/report.html', compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });
});

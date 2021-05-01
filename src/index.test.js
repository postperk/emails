import * as emails from "./index";
import orderMockData from "./testData/order.json";
import brandMockData from "./testData/brand.json";
import fs from "fs-extra";

console.info = jest.fn();

describe("Emails", () => {
   it("Offer email will match snapshot", async () => {
      const compiled = await emails.compile("offer", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: brandMockData,
         order: orderMockData,
      });

      await fs.writeFile("./generated/offer_two.html", compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it("Offer email with only one offer will match snapshot", async () => {
      const compiled = await emails.compile("offer", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [orderMockData.offers[0]],
         }),
      });

      await fs.writeFile("./generated/offer_one.html", compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it("Offer email with brand from different country", async () => {
      const compiled = await emails.compile("offer", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: {
            ...brandMockData,
            addressZip: "",
            addressCountry: "CA",
            addressState: "ON",
            addressCity: "Scarbourgh",
         },
         order: Object.assign({}, orderMockData, {
            offers: [orderMockData.offers[0]],
         }),
      });

      await fs.writeFile(
         "./generated/offer_one_canada.html",
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it("Offer email with three offers will match snapshot", async () => {
      const compiled = await emails.compile("offer", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: brandMockData,
         order: orderMockData,
      });

      await fs.writeFile("./generated/offer_three.html", compiled.content.html);
      await fs.writeFile("./generated/offer_three.txt", compiled.content.text);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
      expect(compiled.content.text).toMatchSnapshot();
   });

   it("Offer email with three offers with custom brand template will match snapshot", async () => {
      const compiled = await emails.compile("offer", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: {
            ...brandMockData,
            tplOffer: {
               ...brandMockData.tplOffer,
               intro: "blah blah {{order.customer.firstName}}",
               body: "Thanks from {{brand.name}}, blah blah custom text",
            },
         },
         order: orderMockData,
      });

      await fs.writeFile(
         "./generated/offer_three_custom.html",
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it("Offer email with hightlight color", async () => {
      const compiled = await emails.compile("offer", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: {
            ...brandMockData,
            highlightColor: "#E92076",
         },
         order: orderMockData,
      });

      await fs.writeFile(
         "./generated/offer_three_highlight.html",
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it("Offer email with custom font", async () => {
      const compiled = await emails.compile("offer", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: {
            ...brandMockData,
            brandFontFamily:
               "Century Gothic, Heiti SC, STHeiti, Avenir, Trebuchet MS, Arial, sans‑serif",
         },
         order: orderMockData,
      });

      await fs.writeFile(
         "./generated/offer_three_custom_font.html",
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it("Offer email with three offers with custom subject", async () => {
      const compiled = await emails.compile("offer", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: {
            ...brandMockData,
            tplOffer: {
               ...brandMockData.tplOffer,
               subject: "Thanks {{firstName}}, here's a gift card on us!",
            },
         },
         order: orderMockData,
      });

      expect(compiled.subject).toMatchSnapshot();
   });

   it("Offer email with three offers with custom subject without firstName variable", async () => {
      const compiled = await emails.compile("offer", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: {
            ...brandMockData,
            tplOffer: {
               ...brandMockData.tplOffer,
               subject: "Whoa buddy here's a gift card on us!",
            },
         },
         order: orderMockData,
      });

      expect(compiled.subject).toMatchSnapshot();
   });

   it("Offer email with no code with match snapshot", async () => {
      let newOffer = { ...orderMockData.offers[0] };
      delete newOffer.code;

      const compiled = await emails.compile("offer", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: brandMockData,
         order: Object.assign({}, orderMockData, {
            offers: [orderMockData.offers[1], newOffer],
         }),
      });

      await fs.writeFile(
         "./generated/offer_nocode.html",
         compiled.content.html
      );
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it("Reminder email will match snapshot", async () => {
      const compiled = await emails.compile("reminder", {
         unhashedEmail: "joel@notreally.com",
         emailId: "testEmailId",
         cfunctions: "http://notreally.com",
         brand: brandMockData,
         order: orderMockData,
      });

      await fs.writeFile("./generated/reminder.html", compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });

   it("Brand report email will match snapshot", async () => {
      const compiled = await emails.compile("report", {});

      await fs.writeFile("./generated/report.html", compiled.content.html);
      expect(compiled.content.html).toMatchSnapshot();
      expect(compiled.subject).toMatchSnapshot();
   });
});

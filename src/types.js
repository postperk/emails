export default {
   welcome: {
      filename: 'welcome.hbs',
      subject: data => `Claim your reward from ${data.brand.name}`
   },
   followOne: {
      filename: 'followupOne.hbs',
      subject: data => `Earn a reward from ${data.brand.name}`
   },
   followTwo: {
      filename: 'followupTwo.hbs',
      subject: data => `Last chance to get your reward from ${data.brand.name}!`
   },
   hashtag: {
      filename: 'hashtagReminder.hbs',
      subject: data =>
         data.brand.taggingType === 'brand'
            ? 'Can\'t wait to see your post!'
            : 'Your generated hashtag!'
   },
   postReminderOne: {
      filename: 'postReminderOne.hbs',
      subject: data => `One week left to earn your reward from ${data.brand.name}!`
   },
   postReminderTwo: {
      filename: 'postReminderTwo.hbs',
      subject: data => `Only two days left to earn your reward from ${data.brand.name}!`
   },
   deliver: {
      filename: 'deliverReward.hbs',
      subject: 'Your reward is ready!'
   }
};

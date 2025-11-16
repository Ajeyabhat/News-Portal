require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const RawArticle = require('./models/RawArticle');

// This script reads your data.json file and safely imports only new articles

const importData = async () => {
  let newArticlesAdded = 0;
  let articlesSkipped = 0;

  try {
    // 1. Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for import...');

    // 2. Read the JSON file
    const data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));
    console.log(`Found ${data.length} articles in data.json file.`);

    // 3. Loop through each article in the file
    for (const article of data) {
      // 4. Check if an article with this URL already exists
      const existingArticle = await RawArticle.findOne({ url: article.url });

      if (existingArticle) {
        // 5. If it exists, skip it
        articlesSkipped++;
      } else {
        // 6. If it's new, add it to the database
        await RawArticle.create(article);
        newArticlesAdded++;
      }
    }

    console.log('--- Import Complete ---');
    console.log(`Successfully added ${newArticlesAdded} new articles.`);
    console.log(`Skipped ${articlesSkipped} duplicate articles.`);

  } catch (error) {
    console.error('Error importing data:', error.message);
  } finally {
    // 7. Disconnect from the database
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

importData();
// scripts/generate-search-index.js
const fs = require('fs');
const path = require('path');
const { getAllPosts } = require('../src/lib/posts'); // Adjust path if necessary

console.log('Generating search index...');

const posts = getAllPosts();

const searchIndex = posts.map(post => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt || '', // Ensure excerpt exists
  tags: post.tags || [], // Include tags if available in your post data
}));

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const outputFile = path.join(publicDir, 'search-index.json');

fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2));

console.log(`Search index generated successfully at ${outputFile}`);
console.log(`Indexed ${searchIndex.length} posts.`);

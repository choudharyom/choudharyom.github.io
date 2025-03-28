# Personal Blog with Gatsby

A Medium-like static blog built with Gatsby, React, and EasyMDE.

## Writing Posts

### Quick Start

1. Visit `/write` on your local development server
2. Enter a title in the "Post Title" field
3. Write your content using the Markdown editor
4. Click the download button (↓) in the toolbar to save your post

### Post Structure

Posts are automatically formatted with:
- Filename: `YYYY-MM-DD-slug.md`
- Frontmatter:
  ```yaml
  ---
  title: "Your Title"
  date: "YYYY-MM-DD"
  slug: "/your-title-as-slug/"
  ---
  ```

### Markdown Tips

Basic syntax:
- `# Header 1`, `## Header 2`, `### Header 3`
- `**bold**` or `__bold__`
- `*italic*` or `_italic_`
- ``` `code` ```
- Code blocks:
  ````
  ```language
  your code here
  ```
  ````
- `[Link text](URL)`
- `![Alt text](image URL)`

### Publishing Flow

1. Download your post using the editor
2. Move the .md file to `/content/posts/`
3. Commit and push to GitHub
4. Site will auto-rebuild with new content

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run develop

# Build site
npm run build

# Serve built site
npm run serve
```

Visit `http://localhost:8000` to view your site.
Visit `http://localhost:8000/write` to create new posts.

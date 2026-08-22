# Deployment Guide for Wheeli

## Step 1: Push to GitHub

1. **Create a new repository** on GitHub under `dev-community-pokhara` organization:
   - Go to https://github.com/organizations/dev-community-pokhara/repositories/new
   - Name: `wheelofnames-game` (or your preferred name)
   - Description: "Interactive wheel of names game - Powered by Apify"
   - Public repository
   - Don't initialize with README (we already have one)

2. **Add remote and push**:
   ```bash
   git remote add origin https://github.com/dev-community-pokhara/wheelofnames-game.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to GitHub Pages

### Option A: Using GitHub Pages (Recommended - Free & Easy)

1. **Update `vite.config.js`** to set the base path:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/wheelofnames-game/', // Replace with your repo name
   })
   ```

2. **Add deployment script to `package.json`**:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` → `/root`
   - Save

6. **Access your site**:
   - URL: `https://dev-community-pokhara.github.io/wheelofnames-game/`

### Option B: Using Vercel (Alternative - Free)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow the prompts** and link to your GitHub repo

### Option C: Using Netlify (Alternative - Free)

1. **Go to** https://app.netlify.com
2. **Drag and drop** the `dist` folder
3. **Or connect** your GitHub repository for automatic deployments

## Step 3: Custom Domain (Optional)

If you have a custom domain:

### For GitHub Pages:
1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS with your domain provider

### For Vercel/Netlify:
1. Follow their custom domain setup in dashboard

## Quick Deploy Commands

```bash
# Build the project
npm run build

# Deploy to GitHub Pages (after setup)
npm run deploy

# Or deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

## Environment Requirements

- Node.js 16+
- npm 7+

## Project Structure

```
wheelofnames-game/
├── dist/              # Production build (generated)
├── src/               # Source code
├── public/            # Static assets
├── package.json       # Dependencies
└── vite.config.js     # Vite configuration
```

## Troubleshooting

**Issue**: Blank page after deployment
- **Solution**: Check the `base` path in `vite.config.js` matches your repo name

**Issue**: Assets not loading
- **Solution**: Ensure all imports use relative paths

**Issue**: GitHub Pages not working
- **Solution**: Make sure `gh-pages` branch exists and is selected in Settings

## Support

For issues, contact Developer Community Pokhara or check the repository issues page.

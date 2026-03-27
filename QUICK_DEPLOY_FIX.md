# 🚀 Quick Deploy Fix - GitHub Pages Update

## The Problem
Your site at `https://ardbegguy.github.io/weliepedia/` is showing old code.

**Reason**: The `gh-pages` branch still has outdated files. Your new code is on `main` branch.

---

## 🎯 The Solution (Choose One)

### ⚡ FASTEST FIX (5 minutes) - Use Vercel

Vercel auto-deploys on every push and is much faster than GitHub Pages.

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy (run in your project directory)
cd /Users/ardbegguy/Documents/alibi/alibi-architect
vercel

# 3. Follow the prompts:
#    - "Set up and deploy?" → Yes
#    - "Which scope?" → Your account
#    - "Link to existing project?" → No
#    - "Project name?" → weliepedia
#    - "In which directory?" → ./build
#    - "Override settings?" → No

# 4. Your new URL appears:
#    https://weliepedia.vercel.app
```

**Done!** Your site now updates instantly on every push.

---

### GitHub Pages Fix (Slightly slower)

If you want to stay on GitHub Pages:

```bash
# 1. Build your site locally
cd /Users/ardbegguy/Documents/alibi/alibi-architect
npm run build

# 2. Deploy to gh-pages branch
npm install --save-dev gh-pages

# 3. Add to package.json "scripts" section:
#    "deploy": "npm run build && gh-pages -d build"

# 4. Run deployment
npm run deploy

# 5. Wait 1-2 minutes, then refresh:
#    https://ardbegguy.github.io/weliepedia/
```

---

## 🔄 Set Up Auto-Deploy (So You Don't Have to Manually Deploy Again)

### For Vercel (Recommended)

After first deployment, every push to `main` branch auto-deploys:

```bash
git push origin main
# That's it! Vercel deploys automatically within 30 seconds
```

### For GitHub Pages

Create automatic deployment workflow.

**Step 1**: Create file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

**Step 2**: Update GitHub settings:
1. Go to: https://github.com/ardbegguy/weliepedia/settings/pages
2. Under "Build and deployment" → Select "GitHub Actions"
3. Save

**Step 3**: Push your code
```bash
git push origin main
```

Now it auto-deploys every time you push!

---

## 📊 Comparison

| | Vercel | GitHub Pages |
|---|---|---|
| **Setup Time** | 2 min | 5 min |
| **Deploy Time** | 30 sec | 2 min |
| **Auto-Deploy** | Yes ✅ | Yes (if workflow set) |
| **Free Tier** | Very generous | Unlimited |
| **Speed** | Very fast | Slower |
| **Recommendation** | ⭐ Recommended | Still good |

---

## ✅ Verify It Worked

### For Vercel
- Your new URL: `https://weliepedia.vercel.app`
- Check it loads your NEW code
- Try clicking buttons to verify functionality

### For GitHub Pages
```bash
# Check deployment status
# Go to: https://github.com/ardbegguy/weliepedia/actions
# Wait for green ✅

# Then refresh your site
# https://ardbegguy.github.io/weliepedia/

# Hard refresh to clear cache
# Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

---

## 🆘 If Something Goes Wrong

### Old site still shows
```bash
# Hard refresh browser
Ctrl+Shift+Delete  # Opens cache clear dialog
# OR press: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

# Wait 2-3 minutes and try again
# GitHub/Vercel CDN needs time to update
```

### Build fails
```bash
# Test locally first
npm install
npm run build

# If it fails locally, fix the errors before deploying
npm run lint
npm run check
```

### Deployment doesn't start
- **Vercel**: Check https://vercel.com/dashboard
- **GitHub Pages**: Check https://github.com/ardbegguy/weliepedia/actions

---

## 📝 Summary

| Step | Command | Time |
|------|---------|------|
| Install Vercel | `npm install -g vercel` | 1 min |
| Deploy | `vercel` | 1 min |
| Verify | Visit vercel URL | 1 min |
| **Total** | | **~3 min** |

---

## 🎉 You're Done!

Your site is now updated with the new code!

- **Old URL** (outdated): https://ardbegguy.github.io/weliepedia/
- **New URL** (recommended): https://weliepedia.vercel.app

**Going forward**: Every `git push origin main` auto-deploys your changes instantly!

---

**Last Updated**: 2024
**Status**: Ready to Deploy ✅
**Estimated Setup Time**: 3-5 minutes
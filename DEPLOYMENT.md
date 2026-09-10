# Free Public Website Deployment Guide
*Deploying The Adult Piano Companion to GitHub Pages*

This guide explains how to deploy your interactive dual-language piano guide as a public website accessible worldwide for **100% free forever** with automatic HTTPS.

---

## Method 1: GitHub Pages via GitHub CLI (1 Minute)

Since your system is already authenticated with `gh`, you can deploy directly from your terminal:

```bash
cd /Users/jingliang/.gemini/antigravity/scratch/adult-piano-guide

# 1. Initialize git and commit
git init
git add .
git commit -m "Initial commit: The Adult Piano Companion"

# 2. Create remote repository and push
gh repo create adult-piano-guide --public --source=. --remote=origin --push

# 3. Enable GitHub Pages using GitHub Actions
gh api -X POST /repos/powerpig99/adult-piano-guide/pages -f build_type=workflow
```

Within 60 seconds, your site will be live at:
**`https://powerpig99.github.io/adult-piano-guide/`**

---

## Method 2: Manual GitHub Web Interface

1. Create a new repository named `adult-piano-guide` at [github.com/new](https://github.com/new) (set to **Public**).
2. Push your local files:
   ```bash
   git remote add origin https://github.com/powerpig99/adult-piano-guide.git
   git branch -M main
   git push -u origin main
   ```
3. Go to **Settings** -> **Pages** -> Under **Source**, select **GitHub Actions**.

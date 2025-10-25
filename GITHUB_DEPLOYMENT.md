# GitHub Deployment Guide

## Pushing Your Code to GitHub

Follow these steps to push your Slamawy Store code to GitHub.

### Prerequisites

- Git installed on your machine
- GitHub account
- Repository already created at: https://github.com/Mostafalol1233/salmawy

### Step-by-Step Instructions

#### 1. Configure Git (First Time Only)

If you haven't configured Git yet, set your name and email:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### 2. Initialize Git Repository (If Not Already Done)

If this is a fresh project without Git:

```bash
git init
```

#### 3. Add Remote Repository

Link your local repository to GitHub:

```bash
git remote add origin https://github.com/Mostafalol1233/salmawy.git
```

If you get an error that the remote already exists, remove it first and re-add:

```bash
git remote remove origin
git remote add origin https://github.com/Mostafalol1233/salmawy.git
```

#### 4. Create .gitignore File

Make sure you have a `.gitignore` file to exclude sensitive and unnecessary files.

The following should already be in your `.gitignore`:

```
node_modules/
dist/
.env
.env.local
.env.*.local
.DS_Store
*.log
.replit
replit.nix
```

**IMPORTANT**: Never commit your `.env` file to GitHub! It contains sensitive database credentials.

#### 5. Add All Files

Add all your project files to Git:

```bash
git add .
```

#### 6. Commit Your Changes

Create your first commit:

```bash
git commit -m "Initial commit - Slamawy Store ready for deployment"
```

Or if you're updating existing code:

```bash
git commit -m "feat: Add dark mode default, update footer, ensure games first"
```

#### 7. Push to GitHub

Push your code to the main branch:

```bash
git branch -M main
git push -u origin main
```

If you get a permission error, you may need to authenticate:

**Option A: Using Personal Access Token (Recommended)**

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` permissions
3. Use the token as your password when pushing

**Option B: Using SSH**

1. Generate SSH key: `ssh-keygen -t ed25519 -C "your.email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys → New SSH key
3. Change remote URL: `git remote set-url origin git@github.com:Mostafalol1233/salmawy.git`

#### 8. Verify on GitHub

1. Go to https://github.com/Mostafalol1233/salmawy
2. Refresh the page
3. You should see all your files uploaded!

### Future Updates

After making changes to your code:

```bash
# 1. Add changes
git add .

# 2. Commit with a descriptive message
git commit -m "feat: Add new game product"

# 3. Push to GitHub
git push origin main
```

### Important Notes

✅ **Always include in Git:**
- Source code files
- Configuration files (package.json, tsconfig.json, etc.)
- README.md and documentation
- .env.example file (template without actual credentials)

❌ **Never include in Git:**
- .env file (contains sensitive data)
- node_modules folder (too large, installed via npm)
- dist folder (build output, generated automatically)
- Database files
- API keys or secrets

### Common Git Commands

```bash
# Check status of your files
git status

# View your commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch between branches
git checkout main

# Pull latest changes from GitHub
git pull origin main

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

### Troubleshooting

**Problem**: Permission denied when pushing

**Solution**: 
- Make sure you're authenticated with GitHub
- Use a Personal Access Token or SSH key
- Check that you have write access to the repository

**Problem**: Merge conflicts

**Solution**:
```bash
git pull origin main
# Fix conflicts in files
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

**Problem**: Accidentally committed .env file

**Solution**:
```bash
# Remove from Git but keep locally
git rm --cached .env
git commit -m "Remove .env from tracking"
git push origin main

# Then add to .gitignore if not already there
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
git push origin main
```

### Next Steps

After pushing to GitHub, proceed to the Vercel deployment guide:
- See `VERCEL_DEPLOYMENT.md` for deploying your app to production

---

**Made with ❤️ by [Mustafa](https://linktr.ee/Mustafa_Bemo)**

# Deployment Guide

## Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Navigate to your project directory:
```bash
cd /Users/teerasak.vichadee/Documents/Dev/Playground/full-stack-learning-path
```

3. Deploy to Vercel:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name: **full-stack-learning-path** (or your preferred name)
   - In which directory is your code located? **./**

5. Your app will be deployed and you'll get a URL like: `https://full-stack-learning-path-xxx.vercel.app`

### Option 2: Using Git + GitHub

1. Create a GitHub repository
2. Push your code:
```bash
git remote add origin https://github.com/yourusername/full-stack-learning-path.git
git branch -M main
git push -u origin main
```

3. Go to [Vercel](https://vercel.com)
4. Click "Import Project"
5. Import from GitHub
6. Select your repository
7. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
8. Click "Deploy"

## Deploy to Netlify

### Option 1: Drag and Drop

1. Build your project:
```bash
npm run build
```

2. Go to [Netlify](https://netlify.com)
3. Drag the `dist` folder to the deployment area

### Option 2: Git Integration

1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

## Environment Variables

No environment variables are required for this project since it uses:
- YAML file for data (included in build)
- localStorage for progress tracking
- No external APIs

## Custom Domain (Optional)

### For Vercel:
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain

### For Netlify:
1. Go to your site dashboard
2. Click "Domain settings"
3. Add your custom domain

## Performance Optimization

The app is already optimized with:
- ✅ Code splitting (Vite)
- ✅ CSS optimization (Tailwind purging)
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ Modern bundle format

## Monitoring

Both Vercel and Netlify provide:
- Analytics
- Performance monitoring
- Error tracking
- Build logs

Your FullStack Open Learning Path is ready for deployment! 🚀

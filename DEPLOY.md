# Mission Control - Deployment Guide

## Option 1: Netlify (Easiest - Free & Reliable)

1. **Create account** at https://netlify.com

2. **Deploy:**
   - Go to https://app.netlify.com/drop
   - Drag the `mission-control` folder onto the page
   - Your site will be live at `https://random-name.netlify.app`

3. **Done!** Share the URL with Lance

---

## Option 2: Vercel (Also Free)

1. **Create account** at https://vercel.com

2. **Deploy:**
   - Go to https://vercel.com/new
   - Import from GitHub OR drag and drop the folder
   - Done!

---

## For Real-Time Updates

The current setup uses Google Apps Script as the backend. To enable updates:

1. Go to https://script.google.com
2. Create a new project
3. Copy code from `google-apps-script.gs`
4. Deploy as Web App (Execute as: Me, Who has access: Anyone)
5. Copy the deployment URL
6. Update `index.html` with the URL in the `fetch()` call

---

## Quick Deploy Now

Just drag the `mission-control` folder to https://app.netlify.com/drop and you'll have a live site in seconds!

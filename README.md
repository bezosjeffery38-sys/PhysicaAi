# Physica AI: deploy so it works everywhere

1. Get an API key at https://console.anthropic.com
2. Put this folder (index.html + api/chat.js) in a GitHub repo.
3. Go to vercel.com, import the repo, and deploy (free plan works).
4. In Vercel > Settings > Environment Variables, add:
   ANTHROPIC_API_KEY = your key
5. Redeploy. Your site now works on any phone or browser.

Never put your API key inside index.html. Anyone could steal it.
Tip: set a monthly spend limit in the Anthropic console.

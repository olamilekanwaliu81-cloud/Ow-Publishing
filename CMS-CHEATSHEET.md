# OW Publishing House — CMS Cheat-Sheet

Your website's content manager. Everything you add/edit/delete here shows up on
your live site automatically — no code, no re-deploy.

---

## 🔑 Logging in
1. Go to **owpublishiing.com/admin**
2. Enter your email + password → **Sign in.**
   - Tip: tick **Show password** if you want to see what you're typing.
   - Forgot it? Click **"Email me a sign-in link"**, then open the link in your inbox (check spam).
3. You land on the **Dashboard**. Click **Log out** (bottom-left) when done.

## 🧭 The dashboard
- **Left sidebar:** Overview · Published Books · Reviews · Blog · Team (the number is how many you have).
- Click a section → see all your items → **+ Add new**, or **Edit** / **Delete** any item.
- Every editor slides in from the right. Fill it, click **Save**. Click **Cancel** or outside to close.

---

## 📚 Add a Published Book
Books → **+ Add new**
- **Title** (required), **Author**
- **Cover image** → Choose File (upload your cover)
- **Category** (Children's, Memoir, Non-fiction…)
- **Status:** *Published* (shows buy links) or *Coming soon* (shows a "coming soon" badge)
- **Amazon / IngramSpark / Bookshop links** — paste the buy URLs
- **Sort order** — lower number shows first
→ **Save.** Appears on your **Published Books** page.

## ⭐ Add a Review
Reviews → **+ Add new**
- **Reviewer name** (required), **Book**
- **Review quote** (required)
- **Rating** 0–5, **Source** (Fiverr / Google), **Link** to the review
→ **Save.** Appears in the **"What authors say"** section (home, books & about pages).
*(Only post reviews that are genuinely yours.)*

## ✍️ Publish a Blog Post
Blog → **+ Add new**
- **Title** (required)
- **Category** (slots it into that tab on your blog)
- **Cover image** (shows on the article page)
- **Short summary** (the teaser on the blog list)
- **Full post** (the article — leave a blank line between paragraphs)
- Tick **Published** ✓ (untick to save as a hidden draft), set the **Date**
→ **Save.** Appears on your **Resources/Blog** page with its own readable page.

## 👤 Add a Team Member
Team → **+ Add new**
- **Name** (required), **Role**, **Photo**, **Short bio**, **LinkedIn URL**, **Sort order**
→ **Save.** Appears on your **About** page. (No photo? It shows their initials.)

---

## 💡 Good to know
- **Images:** upload any normal JPG/PNG. Covers look best upright (portrait); photos best square-ish.
- **Order:** use **Sort order** (lower = first) to arrange books, reviews, team.
- **Nothing changes on the site?** Give it a few seconds and refresh the page. Edits are live instantly.
- **It's safe:** only you (logged in) can change anything. Visitors can only read.
- **Changing your password:** Supabase dashboard → Authentication → Users → your user.

## 🆘 Quick fixes
| Problem | Fix |
|---|---|
| Can't log in | Use **"Email me a sign-in link"**, or reset the password in Supabase → Authentication → Users |
| An item won't show on the site | Make sure it's saved; for blog posts, check **Published** is ticked |
| Uploaded image not showing | Re-open the item, re-upload, Save |
| Dashboard says "Finish setup" | The site config lost its keys — tell your developer to check `js/cms-config.js` |

---
**Your links:** Admin → `owpublishiing.com/admin` · Live site → `owpublishiing.com` · Database → supabase.com (your project)

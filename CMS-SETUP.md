# OW Publishing House — CMS Setup (one-time, ~15 minutes)

This connects your website to a free **Supabase** backend so you can log in at
**owpublishiing.com/admin** and manage Books, Reviews, Blog posts and Team —
add, edit, delete, upload images — with no code and no redeploy.

Do these steps once. After that, you just log in and manage content.

---

## 1. Create a free Supabase project
1. Go to **https://supabase.com** → **Start your project** → sign up (free).
2. Click **New project**.
   - **Name:** `ow-publishing`
   - **Database Password:** click *Generate*, then **save it somewhere safe** (a password manager). You rarely need it, but don't lose it.
   - **Region:** pick the one closest to you (e.g. *West EU (London)*).
3. Click **Create new project** and wait ~2 minutes for it to finish setting up.

## 2. Create the database tables
1. In your project, open **SQL Editor** (left sidebar) → **New query**.
2. Open the file **`supabase/schema.sql`** from your website folder, copy **all** of it, and paste it into the query box.
3. Click **Run** (bottom right). You should see *“Success. No rows returned.”*
   This creates your Books, Reviews, Blog and Team tables, the security rules, and an image storage bucket.

## 3. Create your admin login
1. Go to **Authentication** (left sidebar) → **Users** → **Add user** → **Create new user**.
   - **Email:** your email (e.g. `hello@owpublishiing.com`)
   - **Password:** choose a strong password — **this is your admin password.**
   - Tick **Auto Confirm User** (so you can log in right away).
   - Click **Create user**.
2. **Turn off public sign-ups** (so nobody else can make an account):
   - Go to **Authentication → Sign In / Providers** (or **Providers → Email**).
   - Turn **“Allow new users to sign up”** **OFF**. Save.

> That's it for security: only the user you just created can log in, and only a logged-in user can change your content.

## 4. Connect your website
1. In Supabase go to **Project Settings** (gear icon) → **API keys** (or click the **Connect** button at the top).
2. Copy two values:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`) — under *Project Settings → API* / *Data API*.
   - **Publishable key** — starts with **`sb_publishable_…`**. This is the safe-to-share key.
     *(On an older project you may instead see an "anon public" key — that one works too. **Never** use a key labelled `secret` / `sb_secret_…` or `service_role`.)*
3. Open **`js/cms-config.js`** in your website folder and paste them in:
   ```js
   window.OW_CMS = {
     SUPABASE_URL: 'https://abcdxyz.supabase.co',
     SUPABASE_KEY: 'sb_publishable_xxxxxxxxxxxxxxxxxx'
   };
   ```
4. **Save**, then **deploy** your site (push to Git / redeploy on Vercel).

## 5. Log in and add your first book
1. Visit **owpublishiing.com/admin**
2. Sign in with the email + password from step 3.
3. Use the tabs (**Books / Reviews / Blog / Team**) → **+ Add new** → fill the form → upload an image → **Save**.
4. Edit or delete any item anytime from the same screen.

---

## Good to know
- The **anon key is safe** to have in your site's code. The database rules (“row-level security”) mean it can only *read* public content; nothing can be changed without logging in.
- **Images** you upload are stored in Supabase (free up to 1 GB) and served fast.
- Changes are **live immediately** — no redeploy needed to add/edit/remove content.
- If you ever see **“Finish setup”** on the admin page, it means `js/cms-config.js` still has the placeholder values — redo step 4.
- Free tier limits are generous (plenty for a site this size). Supabase pauses a *totally unused* project after a week of no activity; just open the dashboard to wake it, or it wakes on first visit.

**Once you've done steps 1–4 and can log in, tell me — I'll switch your Published Books, Reviews, Blog and Team sections to display live from the CMS so what you add shows up on the public site.**

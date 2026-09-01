# OW Publishing House — Website Specification

**Version:** 1.1 (build-ready)
**Prepared for:** Olamilekan Waliu Tajudeen
**Purpose:** Page-by-page blueprint for the OW Publishing House site — the reference to build against, or hand to an AI coding agent (e.g. Claude Code).

---

## 0. Build Brief (read first — for the AI building this site)

You are building a complete, multi-page marketing website for **OW Publishing House**, a hybrid publishing service. Build it fully designed and populated — not bare wireframes. Every page must have real layout, styling, and the content described in this document.

**What to build:**
- A multi-page site (not a single page). Pages: Home, Self-Publishing, The Agent Route, Local Print, Pricing, Portfolio, Resources/Blog, About, Contact/Book a Consultation, plus the Author Toolkit tools.
- Design quality bar: polished and modern, comparable to a professional publishing-house site (hero sections, clear service blocks, platform grid, book showcase, FAQ, trust bar, footer). Original OW design — do **not** copy any competitor's site.

**Tech (match the owner's existing stack):**
- Static site: semantic HTML + CSS + vanilla JavaScript. No heavy framework required unless it helps; keep it deployable to **Netlify**.
- Forms via **Formspree** (owner will supply endpoint). Optional logging to Google Sheets via Apps Script — leave a clearly marked hook.
- Mobile-first and fully responsive. Many local users are on phones.
- Clean, maintainable structure; put calculator constants (paper thickness, bleed, margin/gutter rules) in one config file for easy updates.

**Brand system (use throughout):**
- Colours: **Ink Navy** (primary), **Warm Gold** (accent), **Paper Cream** (light background). *(Owner to supply exact hex; use sensible placeholders and centralize them as CSS variables.)*
- Type: **Lora** or **Cormorant Garamond** for serif headings; **Outfit** (or Arial fallback) for body.
- Logo: **OW monogram** + "OW Publishing House" wordmark. *(Owner to supply asset; use a text lockup placeholder until then.)*
- Voice: confident, professional, concise, warm-but-expert.

**Interactive tools to build (see §12):** Book Spec Collector (submission form — no live price, sends specs to owner on submit), Cover Template Calculator (spine + full-wrap dimensions), Interior Layout Calculator (margin/gutter/bleed), AI Book-Idea Checker (optional/later). The two layout calculators are deterministic client-side maths.

**Placeholders policy:** where a real asset or number isn't provided (trust numbers, book cover images, testimonials, exact hex, logo, Formspree endpoint, contact details), insert a clearly-labelled placeholder — never leave a page looking broken. List every placeholder used so the owner can fill them.

**Build order:** Home first (it sets the design system every other page inherits) → Self-Publishing → Local Print → Agent Route → Portfolio → Resources → About → Pricing/Contact → Author Toolkit tools. Build and review one page at a time.

**Do not:** invent fake statistics, testimonials, or client names; copy competitor design or copy; or make the Book Spec Collector show a price (pricing is added later).

---

## 1. Brand & Design Foundation

**Name:** OW Publishing House
**One-line positioning:** A hybrid publishing house that produces, publishes, and *grows the sales of* authors' books — foreign and local — without ever holding stock. Authors always own their book, their rights, and their copies.

**The principle that runs through every page:** *We do not warehouse books.* Framed not as a limitation but as proof that OW is lean, honest, and not a vanity press sitting on unsold inventory. It appears on the homepage and recurs as a trust signal.

**Visual system (existing OW identity):**
- **Colours:** Ink Navy (primary), Warm Gold (accent), Paper Cream (background/light surfaces).
- **Type:** Lora / Cormorant Garamond for serif headings; Outfit / Arial for sans-serif body.
- **Logo:** OW monogram lockup, with "OW Publishing House" wordmark for full-name contexts.
- **Tone of voice:** Confident, professional, concise, value-focused, warm-but-expert — the same top-rated-seller communication standard used with clients.

**Infrastructure to reuse:**
- Booking → existing consultation page at `book.olamilekanwaliu.com`.
- Hosting/DNS pattern already proven: Netlify + Hostinger DNS.
- Forms → Formspree, with Google Apps Script for any sheet-logging automation.

---

## 2. Global Elements (every page)

**Top navigation:**
Home · Self-Publishing · The Agent Route · Local Print · Portfolio · Resources · About · **Book a Consultation** (button, gold).

Keep the nav to these; the three service lanes are the spine, everything else supports them. "Book a Consultation" is always the visible primary action.

**Footer:**
- Short brand statement + the no-stock principle restated in one line.
- Quick links (mirrors nav).
- Contact: email, WhatsApp/phone (for local authors), social (LinkedIn, and Fiverr/Upwork profiles as credibility links).
- Trust row: "5+ years · KDP & IngramSpark certified workflow · Authors served across [regions]."
- Copyright + a link to Terms and to the Author Rights & Ownership statement.

**Recurring conversion elements:**
- A consultation CTA at the bottom of every lane page.
- Trust signals repeated (see §12): specific numbers, named platforms, real case study.

---

## 3. Home

The homepage has one job: state the promise, then split traffic to the right lane before anyone sees an offer meant for someone else.

**Sections, top to bottom:**

1. **Hero.** Headline stating what OW Publishing House is. Subline carrying the no-stock / author-ownership promise. Two buttons: "Find your path" (scrolls to the chooser) and "Book a consultation."

2. **The three-path chooser.** The most important module on the site. Three cards:
   - *"I want to publish and sell my book"* → Self-Publishing lane.
   - *"I want to reach a literary agent"* → The Agent Route.
   - *"I want printed copies of my book"* → Local Print Service.
   Each card: a one-line description of who it's for and what they get, then a clear link. This is what makes a unified site work without confusing three different author mindsets.

3. **Why OW (the differentiator).** Three or four short value blocks: we don't just publish, we *grow sales*; we hold no stock, you own everything; foreign and local authors both served; real production experience (KDP + IngramSpark). 

4. **How it works (high level).** A simple 3-step visual — Produce → Publish → Grow — so a stranger understands the model in five seconds.

5. **Proof.** The Soul Sneakers case study as a featured card, plus a metric or testimonial strip.

6. **Resources teaser.** Pull one or two pieces from the publishing guide/blog to signal authority and feed SEO.

7. **Final CTA band.** Consultation button on a navy background with gold accent.

---

## 4. Self-Publishing (Lane 1 — core)

This is the revenue engine, and it presents **two distinct offers**: a one-time Production project and the recurring Book Growth retainer (the headline offer).

**Sections:**

1. **Lane hero.** "Publish your book on every major print-on-demand platform — and actually sell it." Reinforce that publishing ≠ selling.

2. **Offer A — Production (one-time).** Scope stated plainly: manuscript formatting (interior), **book cover design** (a flagship OW service — front cover, spine, and full wrap, built to the exact dimensions from the Cover Template Calculator in §12b, for both ebook and print), illustration coordination, metadata (BISAC/Thema), and publishing setup across the top self-publishing platforms — Amazon KDP, IngramSpark, Apple Books, Kobo, Barnes & Noble, Google Play, and the rest of the ranked top 10 in §15, matched to what suits each book. Clear deliverable, clear finish line, "from" price with a link to Pricing.

   *Book cover design is also offered as a standalone service* — for authors who already have a formatted interior and only need a professional cover. This pairs directly with the Cover Template Calculator: the calculator gives the correct canvas size, OW designs the cover to fit it. Give it its own callout on the lane and a line item on Pricing.

3. **Offer B — Book Growth (recurring retainer) — the headline.** Positioned as the answer to the problem every author has after upload: nothing happens. What's included monthly:
   - KDP Sponsored Products campaign setup, management, and optimization.
   - Keyword auditing and refreshes across platforms.
   - Cross-platform sales monitoring (wherever the book is listed).
   - Description and price testing.
   - A monthly performance report.
   Show the tier structure here (lighter "keep it optimized" vs. heavier "push for bestseller"), with management fee and the note that the author's ad spend is separate and transparent.

4. **Editorial services (the pre-publish quality gate).** Before a book goes live, it should read clean — so OW offers editorial as part of the production path: **proofreading** (in-house — catching typos, spacing, and consistency, which you already do on projects like Soul Sneakers) and heavier **editing** (copy/line and developmental) offered as a coordinated add-on through trusted editors, the same model as illustration coordination. Presented as an optional but recommended step, or bundled into higher production tiers. This makes OW a *complete* house — an author never has to leave to get their manuscript reader-ready — and it's a natural upsell.

5. **Who this is for.** Foreign and local self-publishing authors; new authors and authors with an existing but underperforming book.

6. **Process timeline.** Manuscript → editorial (optional) → production → live on platforms → growth retainer begins.

7. **FAQ.** Rights ("you keep 100%"), platforms covered, timelines, what ad spend means, can they start with just Production and add Growth later (yes).

8. **CTA** to book a consultation.

---

## 5. The Agent Route (Lane 2 — traditional)

A fundamentally different promise, and the copy must be honest: OW helps authors *reach and impress* literary agents; it cannot *guarantee* representation. Getting this framing right prevents disputes.

**Sections:**

1. **Hero.** "Give your manuscript its best shot at traditional publishing."

2. **What this lane is (and isn't).** You prepare and position; agents decide. State it plainly and confidently — honesty here is a trust signal, not a weakness.

3. **What's included.** Manuscript assessment/polish, query letter writing, synopsis writing, agent research and matching (by genre/market), and a submission plan/tracker.

4. **Who it's for.** Authors set on the traditional route, or who want to try agents before self-publishing.

5. **The honest expectations block.** How agent submissions actually work, realistic timelines, and why a strong query + right-fit targeting matters. (Your "How Publishing Really Works" material is the source here.)

6. **Optional bridge.** "If the agent route doesn't land, your polished manuscript is ready to self-publish with us." — links back to Lane 1.

7. **CTA** to book a consultation.

---

## 6. Local Print Service (Lane 3 — Nigeria)

The simplest and most operationally distinct lane: print-and-ship to the author, zero inventory held by OW. This is print brokerage, not publishing — keep the path low-friction.

**Sections:**

1. **Hero.** "Get professionally printed copies of your book, delivered to you." Make clear it's for local authors who want physical copies.

2. **How it works (3 steps).** Send your print-ready file (or we prepare it) → choose quantity and specs → we print and ship the copies to you. Restate: OW holds no stock; the copies are yours.

3. **Specs to choose.** Trim size, paperback/hardcover, page count, colour vs. black-and-white interior, finish. This is where the **Book Spec Collector** (§12a) lives — the author selects their specs and hits Send, and the full brief comes straight to you so you can reply with an accurate quote. Live pricing gets layered on after launch.

4. **Optional add-on.** "Not print-ready? We can format and design it first." — links to Lane 1 production.

5. **Quote request form.** Copies, spec, delivery location, contact. Formspree → optionally logged to a sheet via Apps Script.

6. **CTA** — WhatsApp/phone prominent here, since local authors may prefer direct contact.

---

## 7. Pricing

One page that presents each lane's pricing in its own block, so no author sees numbers meant for a different service.

- **Production** — tiered packages ("from" pricing) with what's included at each level.
- **Book Growth retainer** — the tiers, monthly, with ad-spend-separate note.
- **Agent Route** — package or per-deliverable pricing.
- **Local Print** — "quote-based" with a link to the request form (specs make fixed pricing impractical).

Close with a reassurance line: transparent pricing, no warehousing markup, you keep your rights. CTA to book a consultation for a custom quote.

*(Alternative: no standalone pricing page — put pricing inside each lane. Decide based on whether you want price visible upfront or gated behind a consultation.)*

---

## 8. Portfolio / Case Studies

Proof that converts. Lead with real work.

- **Featured case study:** Soul Sneakers: Passport to Play — the full KDP + IngramSpark production, using your established case-study format (navy/gold/cream, serif headings, clean body).
- A grid of additional projects (memoir, children's, humour, devotional, large-print niches) as they're ready.
- Each case: the challenge, what OW did, the outcome. Where a Growth retainer produced sales movement, show the metric — that's the strongest possible proof for Lane 1's headline offer.
- CTA to book a consultation.

---

## 9. Resources / Blog

Your SEO and authority engine, and the top-of-funnel that pulls foreign authors in via search.

- Repurpose the "How Publishing Really Works" guide into articles (traditional vs. hybrid vs. self, agent economics, distribution, genre markets).
- Each article ends with a soft CTA into the relevant lane.
- Structure for search: clear titles, genuine depth, internal links to service pages.
- This is what makes the unified site discoverable without paid ads carrying the whole load.

---

## 10. About

Where trust is built through story.

- Your journey and the OW brand (5+ years, book design → full hybrid house).
- **The no-stock philosophy explained** — why lean is better for authors, why you're not a vanity press, why authors keep their rights and copies.
- Credibility markers: platforms, certifications-of-workflow, regions served, seller ratings.
- A human note — you're a real specialist authors work with directly, not a faceless mill.
- CTA to book a consultation.

---

## 11. Book a Consultation / Contact

- Primary path routes to the existing `book.olamilekanwaliu.com` booking flow.
- A simple contact form (Formspree) as fallback, with WhatsApp/phone for local authors.
- Set expectations: what happens on the call, response time.
- Restate the three lanes briefly so the visitor arrives on the call already routed.

---

## 12. Interactive Tools & Lead Magnets

A set of tools that give the author instant value *and* deliver a qualified enquiry (and correct specs) straight to you. None of these quote a live price yet — that comes later, once the print pricing is built.

### 12a. Book Spec Collector (submission form, not a price estimator)

A guided form where the author selects their book's specifications and hits **Send** — and the completed spec lands directly with you (Olamilekan). No price is shown at this stage; its job is to capture a clean, complete brief so you can respond with an accurate quote yourself.

- **Where it lives:** Local Print lane primarily; also on the Self-Publishing production section and linked from the homepage.
- **What it collects (step by step):** Trim size → Binding (paperback / hardcover) → Cover finish (matte / gloss) → Interior (black-and-white / full colour) → Paper stock → Page count → Quantity → optional notes → contact details (name + email + WhatsApp).
- **On Send:** the full specification is delivered to you — via Formspree to your email, and optionally logged to a Google Sheet through Apps Script (the pipeline you already run). The author sees a "Thanks — we've received your specs and will send you a quote shortly" confirmation.
- **No pricing shown (for now):** deliberately a spec-collection tool, not a calculator. The live-pricing logic for local printing gets added *after* the build, once your print costs are locked. The structure is designed so pricing can be switched on later without redesigning the form.
- **Buildable:** a self-contained form — straightforward to build with your stack when you move into the build phase.

### 12b. Cover Template Calculator (spine + full-wrap dimensions)

Modeled on Amazon KDP's cover calculator, this tool computes the exact cover dimensions an author's file needs — so covers arrive correctly sized, and **you receive the precise dimensions too** for production. This solves one of the most common and costly self-publishing errors: a wrongly-sized cover that gets rejected at upload.

- **Where it lives:** the Self-Publishing lane and a resources/tools area; also useful as a standalone lead magnet.
- **Inputs (following the KDP model):** Binding type (paperback / hardcover) → Cover type (for hardcover: case wrap / dust jacket) → Interior type (black & white / standard colour / premium colour) → Paper type (white / cream / groundwood) → Measurement units (inches / mm) → Trim size (preset e.g. 5.5×8.5, 6×9, or custom width × height) → Page count.
- **What it calculates:** the **spine width** (page count × paper thickness for the chosen stock) and the **full-wrap cover size** — total width = back cover + spine + front cover + bleed on both sides; total height = trim height + top and bottom bleed. It also flags whether the page count is high enough to carry spine text (KDP's rule is roughly 100+ pages).
- **Outputs to the author:** the spine width, full cover width and height, and a plain-language "here's the canvas size to design at" summary. Optionally a downloadable guide template (PDF/PNG) as a design layer — a later enhancement.
- **Outputs to you:** on submit, the same calculated dimensions plus the author's inputs are sent to you (Formspree / Sheet), so you have the exact spec on file before production.
- **Guardrail / accuracy note:** paper-thickness multipliers and bleed values differ slightly between KDP, IngramSpark, and other printers. The calculator should state which printer's spec it's using (start with the KDP model, since it's the anchor platform) and note that final files are always checked by OW before upload. Lock the thickness constants in one place so they're easy to maintain.
- **Buildable:** a pure client-side calculation — well within your stack; the maths is deterministic once the constants are set.

### 12c. Interior Layout Calculator (margin, gutter & bleed)

The companion to the cover calculator — this one solves the *inside* of the book. It tells an author the correct margins, gutter, and bleed for their interior file, so text doesn't get swallowed into the spine or trimmed off the edge. Like the cover tool, **you receive the calculated values too**, so production starts from correct specs.

- **Where it lives:** the Self-Publishing lane and the tools/resources area, alongside the cover calculator.
- **Inputs:** trim size (preset or custom) → page count → binding type → whether the interior has images/elements running to the edge (full-bleed art vs. text-only).
- **What it calculates:**
  - **Margins** — recommended inside/outside/top/bottom margins for readable, professional layout.
  - **Gutter** — the extra inside margin the binding needs, which *scales with page count* (thicker books need more gutter so text near the spine stays readable). This is the value most authors get wrong.
  - **Bleed** — whether bleed is needed and the standard amount (typically 0.125") for any element running to the trim edge; text-only interiors usually need none.
- **Outputs to the author:** a clear "set your document up like this" summary (page size, margins, gutter, bleed) they can apply in Word, InDesign, or Affinity.
- **Outputs to you:** the same values on submit, so you have the interior spec on file.
- **Guardrail:** minimum margin/gutter requirements differ slightly by printer (KDP vs. IngramSpark) and grow with page count — state which printer's spec is used and keep the rules in one maintainable place. Final files are always checked by OW before upload.
- **Buildable:** deterministic client-side maths, same as the cover tool.

*(Cover Calculator + Interior Layout Calculator together form a small "Author Toolkit" — a strong, genuinely useful lead-magnet cluster that also feeds you correct specs before any file work begins.)*

### 12d. AI Book-Idea Checker (genre & viability helper)

A lead magnet that fits your AI work directly. Author describes their book; the tool returns a short, useful read on genre fit, likely market, and a next-step suggestion routed into the right OW lane.

- **Input:** a short book description (with a minimum length so answers are meaningful), plus name + email + WhatsApp for the result.
- **Output:** a concise, encouraging analysis — likely genre/category, rough market read, and a recommended path ("this suits self-publishing + a growth retainer" / "strong enough to try the agent route first" / "great candidate for local print"). Every result ends by routing into a lane and a consultation CTA.
- **Positioning:** frame it as a helpful first look, not a guarantee — the same honesty standard as the Agent Route copy.
- **Buildable:** an AI-powered tool well within your GigLab-style capability; can be built when you're ready.
- **Guardrail:** keep it genuinely useful and modest in its claims; over-promising here damages trust fast.

### 12e. Supporting credibility modules

- **Platform grid:** a logo row of the platforms you publish and manage on — the ranked top 10 in §15 — each with a one-line note. Instant "we publish everywhere" credibility. Lives on Home and the Self-Publishing lane.
- **Published-books showcase:** a cover grid (Soul Sneakers and others) with retailer links, so proof is one click from purchase.

---

## 13. Cross-Cutting: Trust & Conversion

Applied across all pages:

- **Trust numbers bar:** a short strip of real figures near the top of Home and reused on About. **Use only your honest numbers** — the ones you have. *(Insert your real figures here: years active, authors/clients served, books produced, platforms/countries reached.)* Never inflate — specificity you can defend beats big round numbers.
- **Specific over vague:** "5+ years," named platforms (KDP, IngramSpark), a real case study — not generic claims.
- **The no-stock principle** stated on Home, About, and both print-touching lanes.
- **Honest limits** on the Agent Route (no guarantee of representation) — builds credibility, prevents disputes.
- **Consistent CTA:** "Book a Consultation" in nav and at the foot of every lane.
- **Dual-audience clarity:** every page makes it obvious whether it's speaking to a foreign self-pub author or a local print author, so neither feels lost.
- **Rights & ownership statement** linked in footer — one short page confirming authors retain 100% of their rights and copies.

---

## 14. Build Notes (for when we do build)

- **Stack:** Netlify hosting + Hostinger DNS (proven pattern); Formspree for forms; Google Apps Script for any sheet logging.
- **Domain:** decide exact-match (`owpublishinghouse.com`) vs. short-brandable (`owpub.com` / `owhouse.com`) vs. launch-fast subdomain (`publishing.olamilekanwaliu.com`); verify availability at registrar.
- **Design tokens:** navy `#`___ / gold `#`___ / cream `#`___ (lock exact hex from existing OW brand); Lora + Outfit as the type pairing.
- **Priority build order:** Home → Self-Publishing → Local Print → Agent Route → Portfolio → Resources → About → Pricing/Contact. **Interactive tools** slot in once their host lanes exist: Cover Template Calculator and Book Spec Collector with the Self-Publishing / Local Print lanes; AI Book-Idea Checker after. Live print pricing is a post-launch enhancement layered onto the Spec Collector.
- **Mobile-first:** local Nigerian authors are likely mobile-heavy; the three-path chooser and quote form must be flawless on phones.

---

*Next decisions to lock: (1) domain shape, (2) retainer tier names + numbers, (3) whether pricing is a standalone page or lives inside each lane.*

---

## 15. Platforms We Publish & Manage On (ranked top 10)

The distribution backbone of the Self-Publishing lane, based on current (2026) market research. The pitch to authors: *OW publishes your book across the top platforms that matter — and manages its sales on them.* These appear as the platform grid on Home and the Self-Publishing lane, and inform the Book Growth retainer (where sales are actually managed).

Ranked by reach and importance for a foreign-and-local author base:

1. **Amazon KDP** — the anchor. Roughly 70–80% of the global ebook market; handles ebook, paperback, and hardcover through one dashboard with print-on-demand (no inventory). Non-negotiable first platform, and the primary home of the Book Growth ad retainer.
2. **IngramSpark** — the gold standard for *wide print* distribution: paperback and hardcover into 39,000+ bookstores, libraries, and retailers worldwide. This is what makes a book orderable beyond Amazon and gives it "traditional-publishing" bookstore reach.
3. **Apple Books** — direct access to millions of iPhone/iPad/Mac readers across 50+ countries; ebooks and audiobooks. Major non-Amazon ebook channel.
4. **Kobo (Kobo Writing Life)** — strong globally, especially Canada, Europe, and Asia-Pacific; genuinely useful promo tools and an active indie-author team. A key "go wide" ebook store.
5. **Barnes & Noble Press** — Nook ebook store plus paperbacks on BarnesAndNoble.com; solid royalties and reader credibility. (Note: print doesn't reach physical B&N shelves without IngramSpark — worth stating honestly.)
6. **Google Play Books** — huge Android reach across 75+ countries; ebooks. Rounds out the major direct ebook storefronts.
7. **Draft2Digital** — the leading aggregator: upload once, distribute an ebook (and now paperback) to many stores at once. The efficient route to "wide" without managing every retailer account individually.
8. **Lulu** — premium print specialist: hardcovers, large-format, children's picture books, coffee-table quality, plus its own storefront. Best for projects where print quality and format variety matter.
9. **PublishDrive** — aggregator reaching hard-to-access markets (including China) via a subscription model rather than royalty split; useful for maximum global spread.
10. **Books.by** — direct-to-reader storefront with 100% royalties and daily payouts. The smart "sell your own traffic here" complement to Amazon discovery.

*Also worth offering as options:* **BookBaby** (higher-touch full-service print + direct sales) and **Blurb** (photo-heavy and visual books). Keep these as situational add-ons rather than headline platforms.

**How to present this honestly:** you don't upload every book to all ten — the right mix depends on the book (an ebook-first novel vs. a children's picture book vs. a bookstore-targeted memoir). The site can say OW publishes across the top platforms *and advises which mix fits each book* — that advisory framing is more credible than "we put every book everywhere," and it's true.

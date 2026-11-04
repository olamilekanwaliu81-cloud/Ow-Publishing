-- ============================================================
-- OW Publishing House — import your EXISTING website content
-- Run ONCE in Supabase → SQL Editor. Safe to re-run: each block
-- only inserts if that table is still empty, so it won't duplicate.
-- After running, refresh your dashboard — everything will be there,
-- editable and deletable.
-- ============================================================

-- ---------- Published Books (7) ----------
do $$
begin
  if (select count(*) from public.books) = 0 then
    insert into public.books (title, author, cover_url, category, status, buy_amazon, buy_ingram, buy_bookshop, sort_order) values
      ('Soul Sneakers: Passport to Play', 'CB Johnson', 'https://owpublishiing.com/assets/book-soul-sneakers.jpg', 'Children''s', 'published', 'https://a.co/d/0fu3pB9c', null, null, 1),
      ('Therapy Changed My Suicidal Thoughts to Self-Love!', 'Paula Axelrod', 'https://owpublishiing.com/assets/book-therapy-selflove.jpg', 'Memoir', 'published', 'https://www.amazon.com/dp/B0H65T561J', null, null, 2),
      ('From Anxious to Confident: Workbook', 'Rima Danielle Jomaa', 'https://owpublishiing.com/assets/book-anxious-confident.jpg', 'Non-fiction', 'published', 'https://a.co/d/0c7k62NC', null, null, 3),
      ('Foundations: Heaven''s Blueprint for Kingdom Builders', 'Joseph Bunch', 'https://owpublishiing.com/assets/book-foundations.jpg', 'Non-fiction', 'published', 'https://a.co/d/07i0k6x8', null, 'https://bookshop.org/p/books/foundations-heavens-blueprint-for-kingdom-builders/a4832783a88a3ba2?ean=9798182759847', 4),
      ('GEN B: Generation Blessed', 'M.D. Hill', 'https://owpublishiing.com/assets/book-gen-b.jpg', 'Memoir', 'published', null, null, 'https://bookshop.org/p/books/gen-b-generation-blessed/291d77d22a1b957f?ean=9798234164933', 5),
      ('Earths Hidden Treasures', 'Pure Crystal Co.', 'https://owpublishiing.com/assets/book-earths-treasures.jpg', 'Non-fiction', 'coming_soon', null, null, null, 6),
      ('Judge Not', 'Catherine Baldwin', 'https://owpublishiing.com/assets/book-judge-not.jpg', 'Non-fiction', 'coming_soon', null, null, null, 7);
  end if;
end $$;

-- ---------- Reviews (3) ----------
do $$
begin
  if (select count(*) from public.reviews) = 0 then
    insert into public.reviews (name, book_title, quote, rating, source, link, country, sort_order) values
      ('Catherine Baldwin', 'Judge Not', 'Olamilekan did a spectacular job formatting my manuscript, designing the covers and providing a comprehensive marketing plan. He went above and beyond, even doing some manuscript editing that my editor failed to do. He was always cooperative and kind. I highly recommend him!', 4.3, 'fiverr', 'https://www.fiverr.com/bizzerro', 'US', 1),
      ('Paula Axelrod', 'Therapy Changed My Suicidal Thoughts to Self-Love', 'Very grateful for all the help and expertise shown and shared during this journey, from start to finish. Would highly recommend.', 5, 'fiverr', 'https://www.fiverr.com/bizzerro', 'US', 2),
      ('Charlotte Shop', 'Left on Read', 'Absolutely exceptional work! He was professional, patient, responsive, and incredibly attentive to detail. He did an amazing job formatting Left on Read, especially the text messages and social-media elements, and truly brought our vision to life. The book looks polished, engaging and professional. I would absolutely work with him again.', 5, 'fiverr', 'https://www.fiverr.com/bizzerro', 'CA', 3);
  end if;
end $$;

-- ---------- Team (6) ----------
do $$
begin
  if (select count(*) from public.team) = 0 then
    insert into public.team (name, role, photo_url, linkedin, sort_order) values
      ('Waliu Olamilekan', 'Founder & CEO', 'https://owpublishiing.com/assets/founder-olamilekan.jpg', 'https://www.linkedin.com/in/olamilekanwaliu01/', 1),
      ('Khodijah Ismail', 'Lead Book Formatter', null, null, 2),
      ('Fuard Sulaimon', 'Advertising & Media Strategist', null, null, 3),
      ('Ayorinde David', 'Creative Personnel', null, null, 4),
      ('Uthman Tijani', 'Lead Book Editor', null, null, 5),
      ('Fuard Olaide', 'Website Designer', null, null, 6);
  end if;
end $$;

-- ---------- Blog posts (6 existing articles) ----------
-- These articles already live on their own pages, so each row links to that
-- page (link) instead of storing the body. They become editable/deletable in
-- the dashboard; the blog shows the CMS copy and never duplicates them.
alter table public.posts add column if not exists category       text;
alter table public.posts add column if not exists link           text;
alter table public.posts add column if not exists thumb          text;
alter table public.posts add column if not exists featured       boolean default false;
alter table public.posts add column if not exists cover_url      text;
alter table public.posts add column if not exists published      boolean default true;
alter table public.posts add column if not exists published_date date default current_date;
alter table public.posts add column if not exists sort_order     int default 0;

do $$
begin
  if (select count(*) from public.posts) = 0 then
    insert into public.posts (title, slug, category, excerpt, link, thumb, featured, published, published_date, sort_order) values
      ('Self-publishing vs traditional publishing: the two roads', 'two-roads', 'Publishing paths',
        'Every author faces one fork: do it yourself and keep more per book, or let a publisher take the risk and keep less. Here is how each road really works, and the one golden rule that separates a real publisher from a scam.',
        'article-two-roads', 'th-navy', true, true, '2026-07-20', 1),
      ('What a literary agent really does, and how they get paid', 'literary-agents', 'Agents',
        'An agent only earns when you earn, 15% of what you make, and nothing upfront, ever. Here is what they actually do, and why "pay to be represented" is the industry’s biggest red flag.',
        'article-literary-agents', 'th-gold', false, true, '2026-06-05', 2),
      ('A real publisher never asks you for money', 'never-pay-to-publish', 'Avoiding scams',
        'Vanity presses dressed up as "hybrid publishers" target writers who feel unworthy. Learn the bait-and-switch, the pre-sign checklist, and the one direction money should always flow.',
        'article-never-pay-to-publish', 'th-plum', false, true, '2026-04-28', 3),
      ('What’s really inside a traditional publishing house', 'inside-a-publisher', 'Publishing paths',
        'A publisher isn’t one person, it’s a whole team, each with a specific job, all salaried. Here is who does what, and why that means you never pay them a fee to be published.',
        'article-inside-a-publisher', 'th-teal', false, true, '2026-03-15', 4),
      ('Perfectionism is just fear in a nice outfit', 'finish-your-book', 'Writing & finishing',
        'Most books die in the drafting, not the market. The label "aspiring", perfectionism, and waiting for motivation are the real killers. Here is the honest way to actually finish.',
        'article-finish-your-book', 'th-rust', false, true, '2026-01-30', 5),
      ('Standing out as an author in the AI era', 'ai-era', 'Writing & AI',
        'AI-generated books are flooding submission piles and store shelves. Here is how to use AI for the mechanical work while doubling down on the one thing it can’t fake, your voice.',
        'article-ai-era', 'th-navy', false, true, '2025-11-18', 6);
  end if;
end $$;

-- Done. Refresh your dashboard to see all your content.

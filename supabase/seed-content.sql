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
    insert into public.reviews (name, book_title, quote, rating, source, link, sort_order) values
      ('Catherine Baldwin', 'Judge Not', 'Olamilekan did a spectacular job formatting my manuscript, designing the covers and providing a comprehensive marketing plan. He went above and beyond, even doing some manuscript editing that my editor failed to do. He was always cooperative and kind. I highly recommend him!', 4.3, 'fiverr', 'https://www.fiverr.com/bizzerro', 1),
      ('Paula Axelrod', 'Therapy Changed My Suicidal Thoughts to Self-Love', 'Very grateful for all the help and expertise shown and shared during this journey, from start to finish. Would highly recommend.', 5, 'fiverr', 'https://www.fiverr.com/bizzerro', 2),
      ('Charlotte Shop', 'Left on Read', 'Absolutely exceptional work! He was professional, patient, responsive, and incredibly attentive to detail. He did an amazing job formatting Left on Read, especially the text messages and social-media elements, and truly brought our vision to life. The book looks polished, engaging and professional. I would absolutely work with him again.', 5, 'fiverr', 'https://www.fiverr.com/bizzerro', 3);
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

-- Done. Refresh your dashboard to see all your content.

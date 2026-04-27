import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, Tag } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogArticles, getArticleBySlug, toSlug } from '../data/blogContent';

function ArticleCard({ post }) {
  return (
    <Link
      to={`/blog/${toSlug(post.title)}`}
      className="group relative block overflow-hidden rounded-[16px] bg-[#3a3a3a] shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
    >
      <img
        src={post.image}
        alt={post.title}
        className="h-[210px] w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/45 to-transparent" />
      <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0b3e8d] shadow-sm">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">{post.category}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug">{post.title}</h3>
        <p className="mt-1 line-clamp-3 text-[10px] leading-snug text-white/80">{post.excerpt}</p>
      </div>
    </Link>
  );
}

function ArticleListItem({ post }) {
  return (
    <article className="px-0 py-2 md:px-5 md:py-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[14px] font-bold text-[#111111] md:text-[15px]">{post.title}</h3>
          <p className="mt-2 max-w-xs text-[10px] leading-relaxed text-[#4c4c4c] md:text-[11px]">{post.excerpt}</p>
        </div>
        <span className="whitespace-nowrap text-[10px] text-[#7f7f7f]">{post.date}</span>
      </div>
    </article>
  );
}

function Article() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug || '');

  const showcasePosts = useMemo(() => blogArticles.slice(0, 5), []);
  const popularPosts = useMemo(() => blogArticles.slice(0, 3), []);
  const [startIndex, setStartIndex] = useState(0);

  const visibleCards = useMemo(
    () => Array.from({ length: 3 }, (_, index) => showcasePosts[(startIndex + index) % showcasePosts.length]),
    [showcasePosts, startIndex]
  );

  const movePrev = () => {
    setStartIndex((current) => (current - 1 + showcasePosts.length) % showcasePosts.length);
  };

  const moveNext = () => {
    setStartIndex((current) => (current + 1) % showcasePosts.length);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-[#EEF3FF] flex flex-col text-[#010407]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-2xl rounded-3xl border border-[#e7dccb] bg-white p-8 text-center shadow-[0_12px_30px_rgba(1,46,114,0.08)]">
            <p className="inline-flex rounded-full border border-[#d8cbb8] bg-[#F7F4EF] px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#002DB5]">
              Article Not Found
            </p>
            <h1 className="mt-4 text-3xl font-black text-[#012E72]">We could not find that article.</h1>
            <p className="mt-3 text-[#010407]/70">Please return to the blog list and select another post.</p>
            <Link
              to="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#012E72] px-6 py-3 text-sm font-bold text-white hover:bg-[#002DB5] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back To Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const readingMinutes = Math.max(
    4,
    Math.ceil(
      article.sections
        .flatMap((section) => section.paragraphs)
        .join(' ')
        .split(/\s+/).length / 220
    )
  );

  const currentArticleIndex = blogArticles.findIndex((post) => toSlug(post.title) === toSlug(article.title));
  const nextArticle = currentArticleIndex >= 0 ? blogArticles[(currentArticleIndex + 1) % blogArticles.length] : null;

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-white">
        <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-12 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[28px] font-extrabold tracking-tight text-[#0b3e8d] md:text-[32px]">Article categories</h1>
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 rounded-full border border-[#0b3e8d] px-4 py-2 text-[10px] font-semibold text-[#111111] shadow-[0_8px_18px_rgba(11,62,141,0.12)] transition-colors hover:bg-[#f4f8ff]"
            >
              Browse all articles
            </Link>
          </div>

          <div className="mt-8 grid items-center gap-4 lg:grid-cols-[48px,1fr,48px]">
            <button
              type="button"
              onClick={movePrev}
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef] text-[#c7c7c7] transition-colors hover:bg-[#e6e6e6] hover:text-[#a8a8a8]"
              aria-label="Previous categories"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="grid gap-6 md:grid-cols-3">
              {visibleCards.map((post) => (
                <ArticleCard key={`${post.title}-${startIndex}`} post={post} />
              ))}
            </div>

            <button
              type="button"
              onClick={moveNext}
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#efefef] text-[#c7c7c7] transition-colors hover:bg-[#e6e6e6] hover:text-[#a8a8a8]"
              aria-label="Next categories"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <section className="mt-8">
            <h2 className="text-[18px] font-bold text-[#111111]">Popular now</h2>
            <div className="mt-3 grid overflow-hidden border-t border-[#d7d7d7] md:grid-cols-3 md:divide-x md:divide-[#d7d7d7]">
              {popularPosts.map((post) => (
                <ArticleListItem key={post.title} post={post} />
              ))}
            </div>
          </section>
        </section>

        <section className="relative overflow-hidden bg-[#012E72] px-6 py-16 md:py-20 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.2),transparent_42%),radial-gradient(circle_at_80%_72%,rgba(247,244,239,0.25),transparent_45%)]" />
          <div className="relative max-w-6xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back To Blog
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[0.92fr,1.08fr] items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-white/85">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {article.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {readingMinutes} min read
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    {article.category}
                  </span>
                </div>

                <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-4xl">
                  {article.title}
                </h2>
                <p className="mt-5 text-white/90 text-base md:text-lg leading-relaxed max-w-3xl">
                  {article.excerpt}
                </p>
                <p className="mt-5 text-sm text-white/80">Published by {article.role} · paladinbusinessservices.net</p>
              </div>

              <div className="overflow-hidden rounded-[26px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.22)] max-w-[620px] w-full justify-self-end">
                <img src={article.image} alt={article.title} className="h-[270px] md:h-[360px] w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:py-16 bg-[radial-gradient(circle_at_top,#eaf0ff_0%,#ffffff_48%,#f8f3ec_100%)]">
          <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[0.72fr,0.28fr]">
            <article className="rounded-[24px] border border-[#e7dccb] bg-white p-6 md:p-8 shadow-[0_12px_32px_rgba(1,46,114,0.08)] space-y-8">
              {article.sections.map((section) => (
                <section key={section.heading} className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-extrabold text-[#012E72]">{section.heading}</h3>
                  <div className="space-y-3.5">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-[15px] md:text-base leading-relaxed text-[#010407]/80 text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </article>

            <aside className="space-y-5">
              <div className="rounded-[22px] bg-[#012E72] p-5 text-white shadow-[0_12px_28px_rgba(1,46,114,0.2)]">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-semibold">Article Tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {nextArticle ? (
                <div className="rounded-[22px] border border-[#e7dccb] bg-white p-5 shadow-[0_10px_24px_rgba(1,46,114,0.08)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#002DB5] font-semibold">Next Read</p>
                  <p className="mt-2 text-sm font-semibold text-[#012E72] leading-relaxed">{nextArticle.title}</p>
                  <Link
                    to={`/blog/${toSlug(nextArticle.title)}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#012E72] px-4 py-2 text-xs font-bold text-white hover:bg-[#002DB5] transition-colors"
                  >
                    Read Next
                  </Link>
                </div>
              ) : null}
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Article;
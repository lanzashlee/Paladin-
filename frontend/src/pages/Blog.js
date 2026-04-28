import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestimonialsPreview from '../components/TestimonialsPreview';
import { blogPosts, toSlug } from '../data/blogContent';
import laptopImage from '../assets/Laptop.png';

function LaptopIllustration() {
  return (
    <div className="relative h-[246px] w-[404px] max-w-full md:h-[276px] md:w-[456px]">
      <img
        src={laptopImage}
        alt="Laptop"
        className="h-full w-full scale-[1.28] object-contain drop-shadow-[0_22px_30px_rgba(0,0,0,0.3)]"
      />
    </div>
  );
}

function BlogCard({ post }) {
  return (
    <Link
      to={`/blog/${toSlug(post.title)}`}
      className="group relative block overflow-hidden rounded-[16px] bg-[#0e2f63] shadow-[0_10px_24px_rgba(1,46,114,0.16)] transition-transform duration-300 hover:-translate-y-1"
    >
      <img
        src={post.image}
        alt={post.title}
        className="h-[180px] w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1d3c] via-[#0a1d3c]/45 to-transparent" />
      <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0e2f63] shadow-sm">
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/72">{post.category}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug">{post.title}</h3>
        <p className="mt-1 line-clamp-3 text-[9px] leading-snug text-white/78">{post.excerpt}</p>
      </div>
    </Link>
  );
}

function Blog() {
  const spotlightPosts = blogPosts.slice(0, 7);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedTag, setSelectedTag] = useState('All tags');
  const [sortOption, setSortOption] = useState('newest');
  const [storyStartIndex, setStoryStartIndex] = useState(0);
  const postsPerPage = 6;
  const storiesPerView = 4;

  const initialFromName = (name) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const categoryOptions = useMemo(
    () => ['All categories', ...new Set(blogPosts.map((post) => post.category))],
    []
  );

  const tagOptions = useMemo(
    () => ['All tags', ...new Set(blogPosts.flatMap((post) => post.tags))],
    []
  );

  const filteredAndSortedPosts = useMemo(() => {
    const filteredPosts = blogPosts.filter((post) => {
      const categoryMatch =
        selectedCategory === 'All categories' || post.category === selectedCategory;
      const tagMatch = selectedTag === 'All tags' || post.tags.includes(selectedTag);
      return categoryMatch && tagMatch;
    });

    return [...filteredPosts].sort((a, b) => {
      if (sortOption === 'mostPopular') {
        return b.popularity - a.popularity;
      }

      if (sortOption === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      }

      if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      }

      return new Date(b.date) - new Date(a.date);
    });
  }, [selectedCategory, selectedTag, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPosts.length / postsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedTag, sortOption]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredAndSortedPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredAndSortedPosts, currentPage]);

  const clearFilters = () => {
    setSelectedCategory('All categories');
    setSelectedTag('All tags');
    setSortOption('newest');
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const goToPreviousStories = () => {
    setStoryStartIndex((current) => Math.max(0, current - 1));
  };

  const goToNextStories = () => {
    setStoryStartIndex((current) => Math.min(Math.max(0, spotlightPosts.length - storiesPerView), current + 1));
  };

  const visibleStoryPosts = spotlightPosts.slice(storyStartIndex, storyStartIndex + storiesPerView);

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#f3f8ff_0%,#ffffff_54%,#f8fbff_100%)]">
        <div className="pointer-events-none absolute left-0 top-20 h-64 w-64 rounded-full bg-[#cfe0ff]/50 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-[26rem] h-72 w-72 rounded-full bg-[#d8e7ff]/40 blur-3xl" />

        <section className="relative z-10 mx-auto w-full max-w-[1400px] overflow-visible px-3 py-10 sm:px-4 md:px-6 md:py-11 lg:px-8">
          <div className="relative overflow-visible rounded-[28px] bg-[#0b3e8d] px-6 py-6 shadow-[0_16px_32px_rgba(1,46,114,0.24)] md:px-9 md:py-5">
            <div className="grid items-center gap-4 lg:grid-cols-[1.08fr,0.92fr] lg:gap-6">
              <div className="text-white">
                <h1 className="mt-1 max-w-[300px] text-[18px] font-semibold uppercase leading-[1.08] sm:max-w-xl sm:text-[24px] md:text-[32px]">
                  Explore Our Latest Insights On Insurance And Risk Protection.
                </h1>
                <p className="mt-3 max-w-[300px] text-[11px] leading-relaxed text-white/72 sm:max-w-xl sm:text-[12px] md:text-[14px]">
                  Browse practical guidance on insurance strategy, business protection, and risk management.
                </p>

                <div className="mt-5 flex w-full max-w-[320px] flex-col items-stretch gap-2 rounded-[22px] bg-white p-2 shadow-[0_10px_24px_rgba(0,0,0,0.12)] sm:max-w-[420px] sm:flex-wrap sm:flex-row sm:items-center sm:gap-2 sm:rounded-[22px] md:flex-nowrap md:rounded-full">
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="h-9 w-full rounded-full bg-[#f5f9ff] px-3 text-[11px] font-medium text-[#0b3e8d] outline-none ring-1 ring-[#d6def2] sm:min-w-0 sm:flex-1 md:w-[122px] md:flex-none"
                    aria-label="Quick category filter"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedTag}
                    onChange={(event) => setSelectedTag(event.target.value)}
                    className="h-9 w-full rounded-full bg-[#f5f9ff] px-3 text-[11px] font-medium text-[#0b3e8d] outline-none ring-1 ring-[#d6def2] sm:min-w-0 sm:flex-1 md:w-[108px] md:flex-none"
                    aria-label="Quick tag filter"
                  >
                    {tagOptions.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                    className="h-9 w-full rounded-full bg-[#f5f9ff] px-3 text-[11px] font-medium text-[#0b3e8d] outline-none ring-1 ring-[#d6def2] sm:min-w-0 sm:flex-1 md:w-[92px] md:flex-none"
                    aria-label="Quick sort filter"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="mostPopular">Popular</option>
                    <option value="title">A-Z</option>
                  </select>
                  <button
                    type="button"
                    onClick={clearFilters}
                    disabled={
                      selectedCategory === 'All categories' &&
                      selectedTag === 'All tags' &&
                      sortOption === 'newest'
                    }
                    className="inline-flex h-9 w-full items-center justify-center rounded-full bg-[#0b3e8d] px-3.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#092f6a] disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="justify-self-center lg:justify-self-end lg:translate-x-10 lg:-translate-y-9">
                <LaptopIllustration />
              </div>
            </div>
          </div>

          <section id="blogs-articles" className="mt-7">
            <div className="mb-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={goToPreviousStories}
                disabled={storyStartIndex === 0}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0b3e8d] shadow-[0_8px_18px_rgba(1,46,114,0.12)] ring-1 ring-[#d6e3ff] transition-colors hover:bg-[#f4f8ff] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Previous stories"
              >
                {'<'}
              </button>
              <button
                type="button"
                onClick={goToNextStories}
                disabled={storyStartIndex >= Math.max(0, spotlightPosts.length - storiesPerView)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0b3e8d] shadow-[0_8px_18px_rgba(1,46,114,0.12)] ring-1 ring-[#d6e3ff] transition-colors hover:bg-[#f4f8ff] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Next stories"
              >
                {'>'}
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {visibleStoryPosts.map((post) => (
                <BlogCard key={post.title} post={post} />
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-[24px] bg-white px-5 py-7 shadow-[0_12px_30px_rgba(1,46,114,0.1)] ring-1 ring-[#d6e3ff] md:px-7 md:py-9">
            <h3 className="text-3xl font-extrabold tracking-tight text-[#012E72] md:text-4xl">BLOG POSTS & ARTICLES</h3>

            <div className="mt-7 grid items-stretch gap-6 sm:grid-cols-2 md:gap-7 lg:grid-cols-2">
              {paginatedPosts.length ? (
                paginatedPosts.map((post) => (
                  <Link
                    key={post.title}
                    to={`/blog/${toSlug(post.title)}`}
                    className="group block h-full overflow-hidden rounded-[18px] bg-[#f8fbff] text-[#012E72] ring-1 ring-[#d9e5ff] shadow-[0_8px_20px_rgba(1,46,114,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(1,46,114,0.14)]"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#012E72]/25 to-transparent" />
                    </div>
                    <div className="flex h-[calc(100%-180px)] min-h-[255px] flex-col p-5">
                      <div className="flex items-center gap-2 text-[12px] text-[#010407]/60">
                        <span>{post.date}</span>
                        <span className="inline-flex rounded-full border border-[#b8cbf3] bg-[#ecf3ff] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#002DB5]">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="mt-2.5 text-2xl font-bold leading-tight text-[#012E72] transition-colors group-hover:text-[#002DB5]">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-base font-medium leading-relaxed text-[#010407]/75">{post.excerpt}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={`${post.title}-${tag}`}
                            className="rounded-full bg-gradient-to-r from-[#e8eefc] to-[#dfe8ff] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#012E72]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center gap-3 pt-5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#012E72] text-xs font-bold text-white">
                          {initialFromName(post.author)}
                        </span>
                        <div className="leading-tight">
                          <p className="text-sm font-semibold text-[#012E72]">{post.author}</p>
                          <p className="mt-1 text-xs text-[#010407]/65">{post.role}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="rounded-[18px] border border-dashed border-[#d8cbb8] bg-[#F7F4EF] px-6 py-10 text-center text-[#012E72] sm:col-span-2 lg:col-span-3">
                  <p className="text-lg font-bold">No posts match your current filters.</p>
                  <p className="mt-2 text-sm text-[#010407]/70">Try a different category, tag, or sorting option.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2.5 pb-2 pt-7">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || !paginatedPosts.length}
                className="h-10 w-10 rounded-full bg-white text-[#012E72] ring-1 ring-[#d8cbb8] transition-colors hover:bg-[#F7F4EF] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                {'<'}
              </button>

              {Array.from({ length: totalPages }, (_, idx) => {
                const page = idx + 1;
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    className={`h-10 w-10 rounded-full font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#002DB5] text-white shadow-[0_6px_14px_rgba(0,45,181,0.35)]'
                        : 'bg-white ring-1 ring-[#d8cbb8] text-[#012E72] hover:bg-[#F7F4EF]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || !paginatedPosts.length}
                className="h-10 w-10 rounded-full bg-white text-[#012E72] ring-1 ring-[#d8cbb8] transition-colors hover:bg-[#F7F4EF] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                {'>'}
              </button>
            </div>
          </section>
        </section>
      </main>
      <TestimonialsPreview />
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#f3f8ff_0%,#ffffff_54%,#f8fbff_100%)]">
        <div className="pointer-events-none absolute left-0 top-20 h-64 w-64 rounded-full bg-[#cfe0ff]/50 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-[26rem] h-72 w-72 rounded-full bg-[#d8e7ff]/40 blur-3xl" />

        <section className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
          <div className="overflow-hidden rounded-[28px] bg-[#0b3e8d] px-5 py-6 shadow-[0_16px_32px_rgba(1,46,114,0.24)] md:px-8 md:py-7">
            <div className="grid items-center gap-6 lg:grid-cols-[1.1fr,0.9fr] lg:gap-8">
              <div className="text-white">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/80">Stay Updated With Our Latests Posts By Subscribing To Our Blog.</p>
                <h1 className="mt-4 max-w-xl text-[30px] font-black uppercase leading-[1.04] md:text-[38px]">
                  Stay Updated With Our Latests Posts By Subscribing To Our Blog.
                </h1>
                <p className="mt-4 max-w-lg text-[11px] leading-relaxed text-white/80 md:text-[12px]">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>

                <form
                  className="mt-6 flex max-w-[315px] items-center rounded-full bg-white p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    aria-label="Enter your email"
                    className="h-8 flex-1 rounded-full border-0 bg-transparent px-3 text-[11px] text-[#0b3e8d] outline-none placeholder:text-[#8ea0c3]"
                  />
                  <button
                    type="submit"
                    className="ml-1 inline-flex h-8 items-center rounded-full border-2 border-white bg-[#0b3e8d] px-4 text-[11px] font-bold text-white shadow-[0_4px_10px_rgba(1,46,114,0.16)] transition-colors hover:bg-[#092f6a]"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              <div className="justify-self-center lg:justify-self-end">
                <LaptopIllustration />
              </div>
            </div>
          </div>

          <section id="blogs-articles" className="mt-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {spotlightPosts.map((post) => (
                <BlogCard key={post.title} post={post} />
              ))}
            </div>
          </section>
        </section>
      </main>
      <TestimonialsPreview />
      <Footer />
    </>
  );
}

export default Blog;
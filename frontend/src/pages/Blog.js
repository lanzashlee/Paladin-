import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestimonialsPreview from '../components/TestimonialsPreview';
import corporateMeetingImage from '../assets/corporate-meeting.jpg';
import { blogPosts, featuredPost, toSlug } from '../data/blogContent';

function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedTag, setSelectedTag] = useState('All tags');
  const [sortOption, setSortOption] = useState('newest');
  const postsPerPage = 6;


  const initialFromName = (name) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const categoryOptions = useMemo(
    () => ['All categories', ...new Set(blogPosts.map((post) => post.category))],
    [blogPosts]
  );

  const tagOptions = useMemo(
    () => ['All tags', ...new Set(blogPosts.flatMap((post) => post.tags))],
    [blogPosts]
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
  }, [blogPosts, selectedCategory, selectedTag, sortOption]);

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

  return (
    <>
      <Header />
      <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#eaf0ff_0%,#ffffff_48%,#f8f3ec_100%)]">
        <div className="pointer-events-none absolute left-0 top-24 h-56 w-56 rounded-full bg-[#c8d8ff]/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-[28rem] h-64 w-64 rounded-full bg-[#f0dfc7]/45 blur-3xl" />

        <section className="relative z-10 w-full space-y-10 md:space-y-12">
          <div
            className="relative overflow-hidden min-h-[250px] md:min-h-[320px] flex items-center justify-center text-center px-6"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(1, 46, 114, 0.45) 0%, rgba(1, 46, 114, 0.68) 100%), url(${corporateMeetingImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 38%',
            }}
          >
            <div className="relative z-10 text-white space-y-3 md:space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Blog Insights</h1>
              <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto">
                Practical guidance for business owners, professionals, and families who want a clearer path to the right protection.
              </p>
            </div>
          </div>

          <div className="w-full px-4 md:px-6 lg:px-8 space-y-10 md:space-y-12">
            <article className="rounded-[26px] bg-gradient-to-br from-[#fbf7f1] to-[#f3ece2] p-4 md:p-8 shadow-[0_14px_34px_rgba(1,46,114,0.12)] ring-1 ring-white/70">
              <div className="grid gap-6 md:gap-10 md:grid-cols-[1.05fr,1fr] items-center">
                <div className="overflow-hidden rounded-[20px]">
                  <Link to={`/blog/${toSlug(featuredPost.title)}`} className="block">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="h-[240px] md:h-[320px] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                    />
                  </Link>
                </div>
                <div className="space-y-4 md:space-y-5 text-[#012E72]">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-[#010407]/60">
                    <span>{featuredPost.date}</span>
                    <span className="inline-flex rounded-full bg-white border border-[#d8cbb8] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#002DB5]">
                      {featuredPost.category}
                    </span>
                  </div>
                  <Link to={`/blog/${toSlug(featuredPost.title)}`} className="block group">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#012E72] group-hover:text-[#002DB5] transition-colors">
                      {featuredPost.title}
                    </h2>
                  </Link>
                  <p className="text-sm md:text-base text-[#010407]/75 leading-relaxed font-medium">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="h-10 w-10 rounded-full bg-[#012E72] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {initialFromName(featuredPost.author)}
                    </span>
                    <div className="leading-tight">
                      <p className="font-semibold text-sm text-[#012E72]">{featuredPost.author}</p>
                      <p className="mt-1 mb-3 text-xs text-[#010407]/65">{featuredPost.role}</p>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${toSlug(featuredPost.title)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#012E72] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#012E72]/15 hover:bg-[#002DB5] transition-colors"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            </article>

            <section className="-mx-4 md:-mx-6 lg:-mx-8 bg-gradient-to-r from-[#f6f1e8] via-[#f4f7ff] to-[#edf4ff] px-4 py-5 md:px-6 md:py-6 lg:px-8 shadow-[0_10px_24px_rgba(1,46,114,0.08)]">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-[#012E72]">Find The Right Insight Faster</h3>
                <p className="text-xs md:text-sm text-[#010407]/70">
                  Showing {filteredAndSortedPosts.length} post
                  {filteredAndSortedPosts.length === 1 ? '' : 's'}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-4 md:items-end">
                <label className="flex flex-col gap-1.5 text-sm text-[#012E72] font-semibold">
                  Category
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="h-10 rounded-xl bg-white/95 px-3 text-sm text-[#012E72] shadow-sm outline-none ring-1 ring-[#d6def2] transition focus:ring-2 focus:ring-[#335fbf]"
                    aria-label="Filter posts by category"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm text-[#012E72] font-semibold">
                  Tag
                  <select
                    value={selectedTag}
                    onChange={(event) => setSelectedTag(event.target.value)}
                    className="h-10 rounded-xl bg-white/95 px-3 text-sm text-[#012E72] shadow-sm outline-none ring-1 ring-[#d6def2] transition focus:ring-2 focus:ring-[#335fbf]"
                    aria-label="Filter posts by tag"
                  >
                    {tagOptions.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-sm text-[#012E72] font-semibold">
                  Sort by
                  <select
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                    className="h-10 rounded-xl bg-white/95 px-3 text-sm text-[#012E72] shadow-sm outline-none ring-1 ring-[#d6def2] transition focus:ring-2 focus:ring-[#335fbf]"
                    aria-label="Sort posts"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="mostPopular">Most popular</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={
                    selectedCategory === 'All categories' &&
                    selectedTag === 'All tags' &&
                    sortOption === 'newest'
                  }
                  className="h-10 rounded-xl bg-[#012E72] px-4 text-sm font-semibold text-white hover:bg-[#1a4c9f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset filters
                </button>
              </div>
            </section>

            <section id="blogs-articles" className="-mx-4 bg-white px-4 py-6 md:-mx-6 md:px-6 md:py-8 lg:-mx-8 lg:px-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#012E72]">Blogs & Articles</h3>
              </div>

              <section className="mt-6 grid items-stretch gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedPosts.length ? (
                  paginatedPosts.map((post) => (
                    <Link
                      key={post.title}
                      to={`/blog/${toSlug(post.title)}`}
                      className="group block h-full bg-white/95 rounded-[18px] p-3 pb-4 text-[#012E72] ring-1 ring-[#e5eaf8] shadow-[0_6px_22px_rgba(1,46,114,0.08)] hover:shadow-[0_14px_28px_rgba(1,46,114,0.14)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="overflow-hidden rounded-[14px]">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-[165px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="mt-3 h-[calc(100%-165px)] min-h-[230px] px-1 flex flex-col">
                        <div className="flex items-center gap-2 text-[11px] text-[#010407]/60">
                          <span>{post.date}</span>
                          <span className="inline-flex rounded-full bg-[#F7F4EF] border border-[#d8cbb8] px-2 py-0.5 font-semibold text-[10px] uppercase tracking-wide text-[#002DB5]">
                            {post.category}
                          </span>
                        </div>
                        <h3 className="mt-2 text-xl font-bold leading-tight text-[#012E72] group-hover:text-[#002DB5] transition-colors">{post.title}</h3>
                        <p className="mt-2 text-sm text-[#010407]/75 leading-relaxed font-medium">{post.excerpt}</p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <span
                              key={`${post.title}-${tag}`}
                              className="rounded-full bg-gradient-to-r from-[#e8eefc] to-[#dfe8ff] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#012E72]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto flex items-center gap-2.5 pt-4">
                          <span className="h-8 w-8 rounded-full bg-[#012E72] text-white flex items-center justify-center font-bold text-xs">
                            {initialFromName(post.author)}
                          </span>
                          <div className="leading-tight">
                            <p className="text-xs font-semibold text-[#012E72]">{post.author}</p>
                            <p className="mt-1 mb-3 text-[11px] text-[#010407]/65">{post.role}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="sm:col-span-2 lg:col-span-3 rounded-[18px] border border-dashed border-[#d8cbb8] bg-[#F7F4EF] px-6 py-10 text-center text-[#012E72]">
                    <p className="text-lg font-bold">No posts match your current filters.</p>
                    <p className="mt-2 text-sm text-[#010407]/70">
                      Try a different category, tag, or sorting option.
                    </p>
                  </div>
                )}
              </section>

              <div className="flex items-center justify-center gap-2 pb-2 pt-6">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || !paginatedPosts.length}
                  className="h-9 w-9 rounded-full bg-white text-[#012E72] ring-1 ring-[#d8cbb8] hover:bg-[#F7F4EF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                      className={`h-9 w-9 rounded-full font-semibold transition-colors ${
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
                  className="h-9 w-9 rounded-full bg-white text-[#012E72] ring-1 ring-[#d8cbb8] hover:bg-[#F7F4EF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  {'>'}
                </button>
              </div>
            </section>
          </div>
        </section>

        <TestimonialsPreview />

        <section className="py-14 md:py-16 px-6 bg-[#012E72]">
          <div className="max-w-6xl mx-auto p-2 md:p-4 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Ready For A Better Insurance Experience?</h2>
            <p className="mt-3 text-[#F7F4EF] max-w-3xl mx-auto">
              We would love to learn about your goals and build a coverage strategy that fits your business, team, and long-term plans.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-[#012E72] shadow-lg shadow-[#010407]/20 hover:bg-[#F7F4EF] transition-colors"
              >
                Request A Quote
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white px-7 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Blog;

import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import corporateMeetingImage from '../assets/corporate-meeting.jpg';

function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const featuredPost = {
    title: 'How To Build A Stronger Coverage Strategy For Your Business',
    date: 'Apr 02, 2026',
    category: 'Featured',
    excerpt:
      'From renewal planning to risk evaluation, this guide walks through practical steps Paladin clients can use to protect operations, teams, and long-term growth.',
    author: 'Paladin Editorial Team',
    role: 'Professional Insurance Solutions',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
  };

  const blogPosts = [
    {
      title: 'Creating Better Renewal Workflows',
      date: 'Feb 12, 2026',
      category: 'Commercial',
      excerpt:
        'A practical checklist to simplify renewals and avoid policy gaps during your busiest seasons.',
      author: 'Emily Johnson',
      role: 'Client Service Lead',
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'The Power of Confident Risk Planning',
      date: 'Mar 22, 2026',
      category: 'Liability',
      excerpt:
        'Use this framework to identify business exposures and align your policy strategy.',
      author: 'Michael Brown',
      role: 'Coverage Advisor',
      image:
        'https://images.unsplash.com/photo-1552664688-cf412ec27db2?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Smart Coverage For Growing Teams',
      date: 'Apr 01, 2026',
      category: 'Employer',
      excerpt:
        'How expanding organizations can protect people, operations, and long-term goals.',
      author: 'Sarah Williams',
      role: 'Risk Consultant',
      image:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Measuring Policy Performance',
      date: 'May 15, 2026',
      category: 'Policy Review',
      excerpt:
        'Track key coverage metrics and turn renewal data into actionable decisions.',
      author: 'David Anderson',
      role: 'Policy Analyst',
      image:
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Maximizing ROI In Insurance Programs',
      date: 'Jun 10, 2026',
      category: 'Risk Finance',
      excerpt:
        'Balance premium costs with stronger coverage outcomes using focused planning.',
      author: 'Laura Davis',
      role: 'Commercial Specialist',
      image:
        'https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Coverage Trends To Watch In 2026',
      date: 'Jul 18, 2026',
      category: 'Industry',
      excerpt:
        'The latest shifts in business insurance and what they may mean for your company.',
      author: 'Richard Wilson',
      role: 'Industry Analyst',
      image:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Contractor Liability Gaps You Can Prevent',
      date: 'Aug 05, 2026',
      category: 'Contractors',
      excerpt:
        'Common blind spots in contractor policies and how to close them before projects begin.',
      author: 'Natalie Brooks',
      role: 'Liability Specialist',
      image:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'How Landlord Policies Differ From Homeowners',
      date: 'Aug 19, 2026',
      category: 'Landlord',
      excerpt:
        'A quick breakdown of coverage differences for rental property owners.',
      author: 'Steven Patel',
      role: 'Property Advisor',
      image:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Commercial Auto Coverage For Expanding Fleets',
      date: 'Sep 02, 2026',
      category: 'Commercial Auto',
      excerpt:
        'What to review when adding vehicles, drivers, and routes to your policy.',
      author: 'Angela Rivera',
      role: 'Commercial Lines Agent',
      image:
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Workers Compensation Tips For Small Businesses',
      date: 'Sep 16, 2026',
      category: 'Workers Comp',
      excerpt:
        'Practical ways to improve compliance and reduce claim-related disruptions.',
      author: 'Carlos Bennett',
      role: 'Risk Management Consultant',
      image:
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Choosing Umbrella Coverage With Confidence',
      date: 'Oct 01, 2026',
      category: 'Umbrella',
      excerpt:
        'How to evaluate limits and make sure excess liability aligns with your exposure.',
      author: 'Monica Hayes',
      role: 'Coverage Strategist',
      image:
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Annual Insurance Checklist For Business Owners',
      date: 'Oct 20, 2026',
      category: 'Checklist',
      excerpt:
        'Use this annual review process to keep your coverage aligned with operational changes.',
      author: 'Brandon Lee',
      role: 'Client Success Manager',
      image:
        'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=900&q=80',
    },
  ];

  const initialFromName = (name) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return blogPosts.slice(startIndex, startIndex + postsPerPage);
  }, [blogPosts, currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <Header />
      <main className="bg-white pb-10 md:pb-14">
        <section className="w-full space-y-10 md:space-y-12">
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
            <article className="rounded-[24px] bg-[#F7F4EF] p-4 md:p-8 shadow-sm">
              <div className="grid gap-6 md:gap-10 md:grid-cols-[1.05fr,1fr] items-center">
                <div className="overflow-hidden rounded-[20px]">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="h-[240px] md:h-[320px] w-full object-cover"
                  />
                </div>
                <div className="space-y-4 md:space-y-5 text-[#012E72]">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-[#010407]/60">
                    <span>{featuredPost.date}</span>
                    <span className="inline-flex rounded-full bg-white border border-[#d8cbb8] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#002DB5]">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#012E72]">
                    {featuredPost.title}
                  </h2>
                  <p className="text-sm md:text-base text-[#010407]/75 leading-relaxed font-medium">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="h-10 w-10 rounded-full bg-[#012E72] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {initialFromName(featuredPost.author)}
                    </span>
                    <div className="leading-tight">
                      <p className="font-semibold text-sm text-[#012E72]">{featuredPost.author}</p>
                      <p className="text-xs text-[#010407]/65">{featuredPost.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <section className="grid items-stretch gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => (
                <article
                  key={post.title}
                  className="group h-full bg-white rounded-[18px] p-3 pb-4 text-[#012E72] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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
                    <h3 className="mt-2 text-xl font-bold leading-tight text-[#012E72]">{post.title}</h3>
                    <p className="mt-2 text-sm text-[#010407]/75 leading-relaxed font-medium">{post.excerpt}</p>
                    <div className="mt-auto flex items-center gap-2.5 pt-4">
                      <span className="h-8 w-8 rounded-full bg-[#012E72] text-white flex items-center justify-center font-bold text-xs">
                        {initialFromName(post.author)}
                      </span>
                      <div className="leading-tight">
                        <p className="text-xs font-semibold text-[#012E72]">{post.author}</p>
                        <p className="text-[11px] text-[#010407]/65">{post.role}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <div className="flex items-center justify-center gap-2 pb-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-full border border-[#d8cbb8] text-[#012E72] hover:bg-[#F7F4EF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                    className={`h-8 w-8 rounded-full font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#002DB5] text-white shadow-sm'
                        : 'border border-[#d8cbb8] text-[#012E72] hover:bg-[#F7F4EF]'
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
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-full border border-[#d8cbb8] text-[#012E72] hover:bg-[#F7F4EF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                {'>'}
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Blog;

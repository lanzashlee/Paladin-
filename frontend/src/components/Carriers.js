import React, { useMemo, useState } from 'react';

const partnerLogoContext = require.context('../assets/partners', false, /\.(png|jpe?g|webp|svg)$/i);

const partnerCarriers = partnerLogoContext
	.keys()
	.sort()
	.map((file) => {
		const baseName = file.replace('./', '').replace(/\.[^/.]+$/, '');
		const prettyName = baseName
			.replace(/[-_]+/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();

		return {
			name: prettyName,
			logo: partnerLogoContext(file),
		};
	});

function Carriers() {
	const [page, setPage] = useState(1);
	const pageSize = 12;

	const { totalPages, currentItems } = useMemo(() => {
		const totalPagesCalc = Math.max(1, Math.ceil(partnerCarriers.length / pageSize));
		const safePage = Math.min(page, totalPagesCalc);
		const start = (safePage - 1) * pageSize;
		const end = start + pageSize;

		return {
			totalPages: totalPagesCalc,
			currentItems: partnerCarriers.slice(start, end),
		};
	}, [page]);

	const goToPage = (newPage) => {
		if (newPage < 1 || newPage > totalPages) return;
		setPage(newPage);
	};

	return (
		<section id="partners-carriers" className="py-24 px-6 bg-white border-t border-[#e7dccb]">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12 md:mb-16">
					<p className="inline-flex items-center px-4 py-1 rounded-full bg-white text-[#002DB5] text-xs font-semibold tracking-wide uppercase mb-4 border border-[#d8cbb8] shadow-sm">
						Partnerships
					</p>
					<h2 className="text-3xl md:text-4xl font-extrabold text-[#012E72] mb-4">
						Our Trusted Partner Carriers
					</h2>
					<p className="text-lg md:text-xl text-[#010407]/75 max-w-3xl mx-auto leading-relaxed text-center">
						At Paladin Business Services, we collaborate with a network of trusted partners and
						carriers to offer the highest-quality solutions tailored to your business needs. Our
						partnerships with industry leaders enable us to deliver unmatched services and support
						to all our clients.
					</p>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
					{currentItems.map(({ name, logo }) => (
						<div
							key={name}
							className="group flex items-center justify-center bg-white border border-[#e7dccb] rounded-2xl p-4 md:p-6 h-28 md:h-32 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-200"
						>
							<img
								src={logo}
								alt={name}
								loading="lazy"
								className="max-h-16 md:max-h-20 w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
							/>
						</div>
					))}
				</div>

				{totalPages > 1 && (
					<div className="mt-10 flex flex-col items-center gap-4">
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => goToPage(page - 1)}
								disabled={page === 1}
								className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
									page === 1
										? 'border-[#e7dccb] text-[#010407]/35 cursor-not-allowed'
										: 'border-[#d8cbb8] text-[#012E72] hover:bg-white'
								}`}
							>
								Previous
							</button>
							<span className="text-xs text-[#010407]/60">
								Page {page} of {totalPages}
							</span>
							<button
								type="button"
								onClick={() => goToPage(page + 1)}
								disabled={page === totalPages}
								className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
									page === totalPages
										? 'border-[#e7dccb] text-[#010407]/35 cursor-not-allowed'
										: 'border-[#d8cbb8] text-[#012E72] hover:bg-white'
								}`}
							>
								Next
							</button>
						</div>

						<div className="flex flex-wrap justify-center gap-1">
							{Array.from({ length: totalPages }).map((_, idx) => {
								const p = idx + 1;
								const isActive = p === page;
								return (
									<button
										key={p}
										type="button"
										onClick={() => goToPage(p)}
										className={`h-2.5 w-2.5 rounded-full ${
											isActive ? 'bg-[#002DB5]' : 'bg-[#d8cbb8] hover:bg-[#c7b39b]'
										}`}
										aria-label={`Go to page ${p}`}
									/>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

export default Carriers;

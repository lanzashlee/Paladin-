import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const partnerLogoContext = require.context('../assets/partners', false, /\.(png|jpe?g|webp|svg)$/i);

const featuredPartnerOrder = [
	'aegis.png',
	'biBerk.jpg',
	'BristolWest.png',
	'American Builders Insurance Company.png',
	'American National Lloyds Insurance Company.png',
	'Certain Underwriters at LLOYDS.png',
	'Coast Natl Ins Co.png',
	'FIREMANS FUND IND CORP.png',
	'foremost-real.png',
	'ergo-next.png',
	'pie-insurance.png',
	'three.png',
	'bamboo.png',
	'hiscox.png',
	'american-modern.png',
	'kw-specialty-insurance-company.png',
	'the-hartford.png',
	'california-fair-plan-property-insurance.png',
	'mount-vernon.png',
	'seaview-insurance-company.png',
	'spinnaker-insurance-company.png',
	'Sierra Specialty Insurance Company.png',
	'state-national.png',
	'WKFC Property Consortium.png',
	'travelers.png',
];

const featuredPartnerNames = new Set([
	'aegis',
	'biberk',
	'bristolwest',
	'foremost real',
	'ergo next',
	'pie insurance',
	'three',
	'bamboo',
	'hiscox',
	'american modern',
	'kw specialty insurance company',
	'the hartford',
	'california fair plan property insurance',
	'mount vernon',
	'seaview insurance company',
	'spinnaker insurance company',
	'state national',
	'travelers',
]);

const displayNameMap = new Map([
	['aegis', 'Aegis'],
	['biberk', 'Biberk'],
	['bristolwest', 'Bristol West'],
	['foremost real', 'Foremost'],
	['ergo next', 'Ergo Next'],
	['pie insurance', 'Pie Insurance'],
	['three', 'THREE'],
	['bamboo', 'Bamboo'],
	['hiscox', 'Hiscox'],
	['american modern', 'American Modern'],
	['kw specialty insurance company', 'KW Specialty'],
	['the hartford', 'The Hartford'],
	['california fair plan property insurance', 'Cali Fair Plan'],
	['mount vernon', 'Mount Vernon'],
	['seaview', 'Seaview'],
	['spinnaker', 'Spinnaker'],
	['state national', 'State National'],
	['travelers', 'Travelers'],
]);

const normalizeCarrierKey = (value) => String(value || '').toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

const featuredOrderMap = new Map(featuredPartnerOrder.map((fileName, index) => [fileName, index]));

const partnerCarriers = partnerLogoContext
	.keys()
	.filter((file) => file !== './obie-2.png')
	.sort((left, right) => {
		const leftName = left.replace('./', '').toLowerCase();
		const rightName = right.replace('./', '').toLowerCase();
		const leftRank = featuredOrderMap.has(leftName) ? featuredOrderMap.get(leftName) : Number.MAX_SAFE_INTEGER;
		const rightRank = featuredOrderMap.has(rightName) ? featuredOrderMap.get(rightName) : Number.MAX_SAFE_INTEGER;

		if (leftRank !== rightRank) {
			return leftRank - rightRank;
		}

		const leftBase = leftName.replace(/\.[^/.]+$/, '');
		const rightBase = rightName.replace(/\.[^/.]+$/, '');
		return leftBase.localeCompare(rightBase);
	})
	.map((file) => {
		const baseName = file.replace('./', '').replace(/\.[^/.]+$/, '');
		const normalizedBaseName = normalizeCarrierKey(baseName);
		const prettyName = displayNameMap.get(normalizedBaseName) ?? baseName.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

		return {
			name: prettyName,
			normalizedName: normalizedBaseName,
			logo: partnerLogoContext(file),
		};
	});

function Carriers({ showViewPartnersButton = false, featuredOnly = false } = {}) {
	const [page, setPage] = useState(1);
	const [slideIndex, setSlideIndex] = useState(0);
	const pageSize = 12;
	const visibleCarriers = featuredOnly
		? partnerCarriers.filter(({ normalizedName }) => featuredPartnerNames.has(normalizedName))
		: partnerCarriers;
	const featuredSlides = useMemo(() => {
		if (!featuredOnly) return [];

		const slides = [];
		for (let index = 0; index < visibleCarriers.length; index += 3) {
			slides.push(visibleCarriers.slice(index, index + 3));
		}

		if (slides.length > 1) {
			slides.push(slides[0]);
		}

		return slides;
	}, [featuredOnly, visibleCarriers]);

	const { totalPages, currentItems } = useMemo(() => {
		const totalPagesCalc = Math.max(1, Math.ceil(visibleCarriers.length / pageSize));
		const safePage = Math.min(page, totalPagesCalc);
		const start = (safePage - 1) * pageSize;
		const end = start + pageSize;

		return {
			totalPages: totalPagesCalc,
			currentItems: visibleCarriers.slice(start, end),
		};
	}, [page, visibleCarriers]);

	const goToPage = (newPage) => {
		if (newPage < 1 || newPage > totalPages) return;
		setPage(newPage);
	};

	useEffect(() => {
		if (!featuredOnly || featuredSlides.length <= 1) return undefined;

		const intervalId = window.setInterval(() => {
			setSlideIndex((currentIndex) => {
				const nextIndex = currentIndex + 1;
				return nextIndex >= featuredSlides.length ? 0 : nextIndex;
			});
		}, 4000);

		return () => window.clearInterval(intervalId);
	}, [featuredOnly, featuredSlides.length]);

	useEffect(() => {
		if (slideIndex >= featuredSlides.length && featuredSlides.length > 0) {
			setSlideIndex(0);
		}
	}, [slideIndex, featuredSlides.length]);

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

				<div className={featuredOnly ? 'w-full flex justify-center' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 items-stretch'}>
					{featuredOnly ? (
						<div className="w-full max-w-7xl overflow-hidden rounded-[2rem] border border-[#e7dccb] bg-[#F7F4EF] shadow-sm mx-auto">
							<div
								className="flex w-full transition-transform duration-700 ease-in-out"
								style={{ transform: `translateX(-${slideIndex * 100}%)` }}
							>
								{featuredSlides.map((slide, slideNumber) => (
									<div key={`slide-${slideNumber}`} className="w-full flex-shrink-0 p-4 md:p-6">
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
											{slide.map(({ name, logo }) => (
												<div
													key={name}
													className="group flex items-center justify-center bg-white border border-[#e7dccb] rounded-[1.75rem] p-7 md:p-10 h-44 md:h-52 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-200"
												>
													<img
														src={logo}
														alt={name}
														loading="lazy"
														className="max-h-24 md:max-h-28 w-full object-contain transition-transform duration-200 group-hover:scale-[1.05]"
													/>
												</div>
											))}
										</div>
									</div>
								))}
							</div>

							{featuredSlides.length > 1 && (
								<div className="pb-4 md:pb-6 flex justify-center gap-2">
									{featuredSlides.slice(0, -1).map((_, slideNumber) => {
										const isActive = slideNumber === slideIndex;
										return (
											<button
												key={slideNumber}
												type="button"
												onClick={() => setSlideIndex(slideNumber)}
												className={`h-2.5 w-2.5 rounded-full transition-colors ${
													isActive ? 'bg-[#002DB5]' : 'bg-[#d8cbb8] hover:bg-[#c7b39b]'
												}`}
												aria-label={`Go to slide ${slideNumber + 1}`}
											/>
										);
									})}
								</div>
							)}
						</div>
					) : (
						currentItems.map(({ name, logo }) => (
							<div
								key={name}
								className="group flex items-center justify-center bg-white border border-[#d8cbb8] rounded-[1.75rem] p-6 md:p-8 h-36 md:h-40 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 duration-200"
							>
								<img
									src={logo}
									alt={name}
									loading="lazy"
									className="max-h-20 md:max-h-24 w-full object-contain transition-transform duration-200 group-hover:scale-[1.05]"
								/>
							</div>
						))
					)}
				</div>

				{!featuredOnly && totalPages > 1 && (
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

				{featuredOnly && showViewPartnersButton && (
					<div className="mt-10 flex justify-center">
						<Link
							to="/about#partners-carriers"
							className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#002DB5] text-white font-semibold text-sm md:text-base shadow-lg shadow-[#002DB5]/20 hover:bg-[#012E72] transition-colors"
						>
							View All Carriers and Partners
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}

export default Carriers;

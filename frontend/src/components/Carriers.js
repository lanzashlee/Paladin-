import React from 'react';
import { Link } from 'react-router-dom';

const partnerCarriers = [
	'Partner One',
	'Partner Two',
	'Partner Three',
	'Partner Four',
	'Partner Five',
	'Partner Six',
	'Partner Seven',
	'Partner Eight',
	'Partner Nine',
	'Partner Ten',
	'Partner Eleven',
	'Partner Twelve',
	'Partner Thirteen',
	'Partner Fourteen',
	'Partner Fifteen',
	'Partner Sixteen',
];

function Carriers() {
	return (
		<section className="py-24 px-6 bg-white border-t border-[#e7dccb]">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12 md:mb-16">
					<p className="inline-flex items-center px-4 py-1 rounded-full bg-white text-[#002DB5] text-xs font-semibold tracking-wide uppercase mb-4 border border-[#d8cbb8] shadow-sm">
						Our Network
					</p>
					<h2 className="text-3xl md:text-4xl font-extrabold text-[#012E72] mb-4">
						Our Trusted Partners &amp; Carriers
					</h2>
					<p className="text-lg md:text-xl text-[#010407]/75 max-w-3xl mx-auto leading-relaxed text-justify">
						At Paladin Business Services, we collaborate with a network of trusted partners and
						carriers to offer the highest-quality solutions tailored to your business needs. Our
						partnerships with industry leaders enable us to deliver unmatched services and support
						to all our clients.
					</p>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8 items-center">
					{partnerCarriers.map((name) => (
						<div
							key={name}
							className="flex items-center justify-center bg-white border border-[#e7dccb] rounded-2xl h-24 md:h-28 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-200"
						>
							<span className="text-xs md:text-sm font-semibold tracking-wide text-[#012E72]/75 uppercase text-center px-3">
								{name}
							</span>
						</div>
					))}
				</div>

				<div className="mt-10 flex justify-center">
					<Link
						to="/about#partners-carriers"
						className="inline-flex items-center gap-2 bg-[#012E72] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#012E72]/20 hover:bg-[#002DB5] transition-all hover:-translate-y-0.5"
					>
						View All Partners &amp; Carriers
					</Link>
				</div>
			</div>
		</section>
	);
}

export default Carriers;

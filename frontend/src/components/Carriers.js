import React from 'react';
import aonEdgeLogo from '../assets/AonEdge.jpg';
import attuneLogo from '../assets/Attune.png';
import annexRiskLogo from '../assets/Annex Risk.png';
import bridgerLogo from '../assets/Bridger.png';
import bristolWestLogo from '../assets/BristolWest.png';
import burnsWilcoxLogo from '../assets/Burns and Wilcox.jpg';
import collectiblesInsuranceServicesLogo from '../assets/Collectibles Insurance Services (CIS).webp';
import cowbellLogo from '../assets/cowbell.png';
import deductibleDefenderLogo from '../assets/DEDUCTIBLE+DEFENDER+LOGO.webp';
import delosLogo from '../assets/Delos.jpg';
import employersLogo from '../assets/Employers.png';
import epremiumLogo from '../assets/epremium.jpg';
import ahoyLogo from '../assets/images.png';

const partnerCarriers = [
	{ name: 'AonEdge Private Flood Insurance', logo: aonEdgeLogo },
	{ name: 'Attune', logo: attuneLogo },
	{ name: 'Annex Risk', logo: annexRiskLogo },
	{ name: 'Bridger Insurance', logo: bridgerLogo },
	{ name: 'Bristol West', logo: bristolWestLogo },
	{ name: 'Burns & Wilcox', logo: burnsWilcoxLogo },
	{ name: 'Collectibles Insurance Services', logo: collectiblesInsuranceServicesLogo },
	{ name: 'Cowbell', logo: cowbellLogo },
	{ name: 'Deductible Defender', logo: deductibleDefenderLogo },
	{ name: 'Delos', logo: delosLogo },
	{ name: 'Employers', logo: employersLogo },
	{ name: 'ePremium', logo: epremiumLogo },
	{ name: 'Ahoy!', logo: ahoyLogo },
];

function Carriers() {
	return (
		<section className="py-24 px-6 bg-white border-t border-[#e7dccb]">
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
					{partnerCarriers.map(({ name, logo }) => (
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
			</div>
		</section>
	);
}

export default Carriers;

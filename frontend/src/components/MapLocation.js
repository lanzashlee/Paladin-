import React from 'react';

function MapLocation({
	address = '3787 Transport ST Suite A7 Box #5, Ventura, CA 93003',
	title = 'Office Location Map',
	className = '',
	heightClass = 'h-[420px]',
}) {
	const encodedAddress = encodeURIComponent(address);
	const embedUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
	const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

	return (
		<section className={`py-16 px-8 max-w-7xl mx-auto w-full ${className}`}>
			<div className="glass-panel rounded-3xl p-6 md:p-8 shadow-xl shadow-blue-900/5 border border-white/60">
				<div className="mb-5">
					<h3 className="text-2xl font-bold text-[#0a0a0a]">Find Us</h3>
					<p className="text-gray-600 mt-2">{address}</p>
				</div>

				<div className={`w-full overflow-hidden rounded-2xl border border-gray-200/80 ${heightClass}`}>
					<iframe
						title={title}
						src={embedUrl}
						className="w-full h-full"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						allowFullScreen
					/>
				</div>

				<div className="mt-4">
					<a
						href={mapsUrl}
						target="_blank"
						rel="noreferrer"
						className="text-sm font-semibold text-[#0077b6] hover:text-blue-700 transition-colors"
					>
						Open in Google Maps
					</a>
				</div>
			</div>
		</section>
	);
}

export default MapLocation;

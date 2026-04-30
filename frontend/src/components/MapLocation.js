import React from 'react';

const FONT_DISPLAY = 'Cinzel, serif';
const FONT_BODY = '"Times New Roman", Times, serif';

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
		<section id="find-us" className={`py-16 px-8 max-w-7xl mx-auto w-full ${className}`}>
			<div className="rounded-3xl p-6 md:p-8 shadow-xl shadow-[#012E72]/5 border border-[#e7dccb] bg-white">
				<div className="mb-5">
					<h3 className="text-2xl font-bold text-[#012E72]" style={{ fontFamily: FONT_DISPLAY }}>FIND US</h3>
					<p className="text-[#010407]/75 mt-2" style={{ fontFamily: FONT_BODY }}>{address}</p>
				</div>

				<div className={`w-full overflow-hidden rounded-2xl border border-[#d8cbb8] ${heightClass}`}>
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
						className="text-sm font-semibold text-[#002DB5] hover:text-[#012E72] transition-colors"
						style={{ fontFamily: FONT_BODY }}
					>
						Open in Google Maps
					</a>
				</div>
			</div>
		</section>
	);
}

export default MapLocation;

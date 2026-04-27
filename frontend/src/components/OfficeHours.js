import React from 'react';

const hours = [
  { day: 'Sunday',    open: '06:00 AM', close: '12:00 AM', closed: false },
  { day: 'Monday',    open: '06:00 AM', close: '12:00 AM', closed: false },
  { day: 'Tuesday',   open: '06:00 AM', close: '12:00 AM', closed: false },
  { day: 'Wednesday', open: '06:00 AM', close: '12:00 AM', closed: false },
  { day: 'Thursday',  open: '06:00 AM', close: '12:00 AM', closed: false },
  { day: 'Friday',    open: '06:00 AM', close: '12:00 AM', closed: false },
  { day: 'Saturday',  open: '06:00 AM', close: '12:00 AM', closed: false },
];

// getDay() returns 0=Sun,1=Mon...6=Sat. This matches our array index directly.
const todayIndex = new Date().getDay();

function OfficeHours() {
  return (
    <section className="py-24 px-8 bg-[#012E72]" id="office-hours">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="inline-flex items-center px-4 py-1 rounded-full bg-white/10 text-[#F7F4EF] text-xs font-semibold tracking-widest uppercase mb-4 border border-white/30 shadow-sm">
            When We're Here
          </p>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            OFFICE HOURS
          </h2>
          <p className="text-[#F7F4EF] text-lg leading-relaxed">
            Our team is available seven days a week from 6:00 AM to 12:00 AM to assist you with all
            your insurance needs.
          </p>
        </div>

        {/* Hours table */}
        <div className="rounded-3xl overflow-hidden shadow-xl shadow-[#010407]/20 border border-[#d8e2ff] bg-white/95 backdrop-blur">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto] bg-[#001F5A] text-white text-sm font-bold px-8 py-4">
            <span>Day</span>
            <span>Hours</span>
          </div>

          {/* Rows */}
          {hours.map((row, i) => {
            const isToday = i === todayIndex;
            return (
              <div
                key={row.day}
                className={`grid grid-cols-[1fr_auto] items-center px-8 py-4 border-b border-[#dbe4fb] last:border-none transition-colors
                  ${isToday ? 'bg-[#EAF0FF]' : 'hover:bg-[#F3F7FF]'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${isToday ? 'text-[#002DB5]' : 'text-[#012E72]/80'}`}>
                    {row.day}
                  </span>
                </div>

                <span
                  className={`text-sm ${
                    row.closed
                      ? 'text-[#002DB5] font-semibold'
                      : isToday
                      ? 'text-[#012E72] font-semibold'
                      : 'text-[#012E72]/70'
                  }`}
                >
                  {row.closed ? 'Closed' : `${row.open} – ${row.close}`}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-white/80">
          Need assistance? Email us at{' '}
          <a
            href="mailto:support@paladinbusinessservices.net"
            className="text-[#F7F4EF] hover:text-white hover:underline font-medium"
          >
            support@paladinbusinessservices.net
          </a>
        </p>
      </div>
    </section>
  );
}

export default OfficeHours;

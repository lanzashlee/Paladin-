import React from 'react';

const hours = [
  { day: 'Sunday',    open: null,        close: null,       closed: true  },
  { day: 'Monday',    open: '09:00 AM', close: '05:00 PM', closed: false },
  { day: 'Tuesday',   open: '09:00 AM', close: '05:00 PM', closed: false },
  { day: 'Wednesday', open: '09:00 AM', close: '05:00 PM', closed: false },
  { day: 'Thursday',  open: '09:00 AM', close: '05:00 PM', closed: false },
  { day: 'Friday',    open: '09:00 AM', close: '05:00 PM', closed: false },
  { day: 'Saturday',  open: null,        close: null,       closed: true  },
];

// getDay() returns 0=Sun,1=Mon...6=Sat. This matches our array index directly.
const todayIndex = new Date().getDay();

function OfficeHours() {
  return (
    <section className="py-24 px-8" id="hours">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 text-[#0077b6] text-xs font-semibold tracking-widest uppercase mb-4">
            When We're Here
          </p>
          <h2 className="text-4xl font-extrabold text-[#0a0a0a] tracking-tight mb-4">
            Office Hours
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Our team is available Monday through Friday during standard business hours to assist you
            with all your insurance needs.
          </p>
        </div>

        {/* Hours table */}
        <div className="glass-panel rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5 border border-white/60">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto] bg-[#0077b6] text-white text-sm font-bold px-8 py-4">
            <span>Day</span>
            <span>Hours</span>
          </div>

          {/* Rows */}
          {hours.map((row, i) => {
            const isToday = i === todayIndex;
            return (
              <div
                key={row.day}
                className={`grid grid-cols-[1fr_auto] items-center px-8 py-4 border-b border-gray-100/80 last:border-none transition-colors
                  ${isToday ? 'bg-blue-50' : 'hover:bg-gray-50/60'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${isToday ? 'text-[#0077b6]' : 'text-gray-700'}`}>
                    {row.day}
                  </span>
                </div>

                <span
                  className={`text-sm ${
                    row.closed
                      ? 'text-red-400 font-semibold'
                      : isToday
                      ? 'text-[#0077b6] font-semibold'
                      : 'text-gray-600'
                  }`}
                >
                  {row.closed ? 'Closed' : `${row.open} – ${row.close}`}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Outside of business hours? Email us at{' '}
          <a
            href="mailto:support@paladinbusinessservices.net"
            className="text-[#0077b6] hover:underline font-medium"
          >
            support@paladinbusinessservices.net
          </a>
        </p>
      </div>
    </section>
  );
}

export default OfficeHours;

export const servicesData = [
  {
    id: 'general-liability',
    title: 'General Liability',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'A type of insurance that protects businesses from financial loss due to third-party claims for bodily injury, property damage, and certain types of personal injury.',
    description:
      'A type of insurance that protects businesses from financial loss due to third-party claims for bodily injury, property damage, and certain types of personal injury. Our policies offer coverage and 24/7 assistance.',
    highlights: [
      'Third-party bodily injury and property damage coverage',
      'Support for legal defense and settlement costs',
      'Useful for storefronts, offices, and service businesses',
    ],
  },
  {
    id: 'renters-insurance',
    title: 'Renters Insurance',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Protect your belongings and liability as a renter.',
    description:
      'Protect your belongings and liability as a renter. Our policies cover theft, fire, water damage, and more. We can help you find the best coverage for your rental property.',
    highlights: [
      'Personal property coverage for everyday belongings',
      'Liability protection for covered incidents',
      'Optional add-ons for high-value items',
    ],
  },
  {
    id: 'umbrella-insurance',
    title: 'Umbrella Insurance',
    image:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Get additional liability coverage beyond your existing policies.',
    description:
      'Get additional liability coverage beyond your existing policies. Our umbrella insurance provides extra protection for your assets and peace of mind. We can help you determine the right amount of coverage for your situation.',
    highlights: [
      'Extra liability limits above existing policies',
      'Broader financial protection for major claims',
      'Useful for families, property owners, and business leaders',
    ],
  },
  {
    id: 'workers-compensation',
    title: "Workers' Compensation",
    image:
      'https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      "Workers' compensation insurance provides financial support and medical benefits for work-related injuries.",
    description:
      "Workers' compensation insurance is a type of coverage that provides financial support and medical benefits to employees who are injured or become ill as a result of their job. This insurance helps cover medical expenses, lost wages, and rehabilitation costs, and in the event of a work-related death, it provides benefits to the employee's dependents.",
    highlights: [
      'Medical and rehabilitation cost support',
      'Lost wage benefits for eligible employees',
      'Helps employers meet legal requirements',
    ],
  },
  {
    id: 'flood-insurance',
    title: 'Flood Insurance',
    image:
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Protect your home and belongings from flood damage.',
    description:
      'Protect your home and belongings from flood damage. Our policies cover damage from natural disasters, burst pipes, and other water-related incidents. We can help you find the best coverage for your flood risk.',
    highlights: [
      'Coverage for flood-related structural damage',
      'Protection for belongings based on policy terms',
      'Ideal for moderate to high-risk flood zones',
    ],
  },
  {
    id: 'commercial-auto-insurance',
    title: 'Commercial Auto Insurance',
    image:
      'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Protects business vehicles from accidents, property damage, and liability claims.',
    description:
      'This insurance protects against financial losses resulting from accidents, property damage, and liability claims involving business vehicles. It typically includes coverage for bodily injury, property damage, and medical expenses for drivers and passengers, as well as protection against theft and vandalism. Additionally, commercial auto insurance can cover legal costs and damages if the business is held responsible for an accident.',
    highlights: [
      'Liability protection for business driving exposures',
      'Physical damage options for company vehicles',
      'Coverage for fleets, vans, and work trucks',
    ],
  },
  {
    id: 'cyber-liability-insurance',
    title: 'Cyber Liability Insurance',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Designed to protect businesses from financial losses tied to cyberattacks and data breaches.',
    description:
      'Cyber liability insurance is designed to protect businesses from financial losses and legal liabilities resulting from cyberattacks and data breaches. This coverage addresses various risks associated with digital operations, including costs related to data recovery, legal fees, and notification expenses required by data protection laws.',
    highlights: [
      'Coverage for data breaches and cyber incidents',
      'Incident response and legal support options',
      'Helpful for businesses handling sensitive data',
    ],
  },
  {
    id: 'earthquake-insurance',
    title: 'Earthquake Insurance',
    image:
      'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Specialized property insurance designed to protect against earthquake damage.',
    description:
      'Earthquake insurance is a specialized form of property insurance designed to protect against the financial impact of earthquake damage. Unlike standard homeowners or commercial property insurance, which often excludes earthquake-related damage, earthquake insurance provides coverage for repairs or rebuilding costs resulting from seismic activity.',
    highlights: [
      'Protection for earthquake-related property damage',
      'Can cover rebuilding and structural repairs',
      'Suitable in regions with seismic risk exposure',
    ],
  },
  {
    id: 'commercial-insurance',
    title: 'Commercial Insurance',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'A crucial safeguard for businesses against day-to-day operational risks.',
    description:
      'Commercial insurance is a crucial safeguard for businesses, offering protection against a wide array of financial risks that can arise from everyday operations. This type of insurance encompasses various policies designed to cover liabilities, property damage, employee injuries, and other potential losses.',
    highlights: [
      'Customized packages for business risk profiles',
      'Can combine property, liability, and employee coverage',
      'Scales with your business growth and industry needs',
    ],
  },
];

export const servicesById = servicesData.reduce((acc, service) => {
  acc[service.id] = service;
  return acc;
}, {});

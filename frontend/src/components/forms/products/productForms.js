import HO3Form from './HO3Form';
import HO6Form from './HO6Form';
import HO4Form from './HO4Form';
import CommercialAutoForm from './CommercialAutoForm';
import GeneralLiabilityForm from './GeneralLiabilityForm';
import WorkersCompForm from './WorkersCompForm';
import EarthquakeForm from './EarthquakeForm';
import FloodForm from './FloodForm';
import UmbrellaForm from './UmbrellaForm';
import SpecialtyForm from './SpecialtyForm';

export const PRODUCT_OPTIONS = [
  {
    id: 'ho3',
    label: 'Homeowners Insurance (HO3)',
    description: 'Single-family home coverage and property liability.',
  },
  {
    id: 'ho6',
    label: 'Condo Owners Insurance (HO6)',
    description: 'Condominium unit and personal property protection.',
  },
  {
    id: 'ho4',
    label: 'Renters Insurance (HO4)',
    description: 'Coverage for tenants and their personal belongings.',
  },
  {
    id: 'commercialAuto',
    label: 'Commercial Auto Insurance',
    description: 'Protection for business vehicles and drivers.',
  },
  {
    id: 'generalLiability',
    label: 'General Liability Insurance (GL / CGL)',
    description: 'Business liability coverage for third-party claims.',
  },
  {
    id: 'workersComp',
    label: 'Workers Compensation Insurance',
    description: 'Employee injury and work-related illness protection.',
  },
  {
    id: 'earthquake',
    label: 'Earthquake Insurance',
    description: 'Coverage for earthquake-related structural damage.',
  },
  {
    id: 'flood',
    label: 'Flood Insurance',
    description: 'Coverage for flood damage not typically in standard policies.',
  },
  {
    id: 'umbrella',
    label: 'Umbrella / Excess Liability Insurance',
    description: 'Additional liability limits beyond base policies.',
  },
  {
    id: 'specialty',
    label: 'Specialty Products',
    description: 'Coverage for unique or non-standard insurance needs.',
  },
];

export const PRODUCT_FORM_COMPONENTS = {
  ho3: HO3Form,
  ho6: HO6Form,
  ho4: HO4Form,
  commercialAuto: CommercialAutoForm,
  generalLiability: GeneralLiabilityForm,
  workersComp: WorkersCompForm,
  earthquake: EarthquakeForm,
  flood: FloodForm,
  umbrella: UmbrellaForm,
  specialty: SpecialtyForm,
};

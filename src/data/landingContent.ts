import { WayIntoArchive } from '../types/journal';

export const AUTHOR_PROFILE = {
  name: 'Shane J. Lozenich',
  role: 'Author, Independent Researcher & Archivist',
  location: 'Seattle & King County, Washington',
  email: 'jscthebrand@gmail.com',
  bio: 'Shane J. Lozenich is an independent researcher, systems analyst, and author examining the intersection of institutional psychoanalysis, epistemic trauma, legal procedure, and counter-archival methodology. Drawing from a six-year longitudinal legal-medical record in Seattle and King County, his work formalizes empirical frameworks for auditing administrative containment and restoring evidentiary coherence.',
  studyImage: '/src/assets/images/author_study_folio_1794910401655.jpg',
  heroImage: '/src/assets/images/hero_archive_desk_1794910400705.jpg',
  sourceManifestoPdf: '/assets/aistudio/Reclaiming_the_Narrative_c3f44401.pdf',
};

export const LANDING_MANIFESTO = {
  kicker: 'Vol. I · Foundational Monograph · Seattle & King County',
  title: 'Reclaiming the Narrative',
  subtitle: 'A true story about navigating institutional dissonance to restore evidentiary coherence',
  openingParagraphs: [
    'It began as an attempt to understand what had happened — not just the truth, but an entire side of the story erased as if it had never occurred. A space I was living in, caught somewhere between my eyes and my memory. A reality I had lived and seen, just taken and flattened by the institutions into alternative facts and a narrative of their own.',
    'This is my attempt to reclaim that narrative.',
  ],
  sections: [
    {
      id: 'psychological-core',
      heading: 'The Psychological Core',
      paragraphs: [
        'What happened was not primarily a series of isolated legal events. It was a sustained experience of epistemic violence: the institutional power to declare another person’s experience unreal, disordered, or inadmissible. Reports of data-breach targeting, technological harassment, identity irregularities, and physical and digital stalking were met with non-investigation followed by systematic reframing as psychiatric symptoms.',
        'The result was a specific form of injury — epistemic trauma — that produces a profound and enduring sense that one’s own mind cannot be trusted by others, that speaking accurately increases rather than decreases danger, and that reality itself has been privatized by the institution.',
      ],
      pullQuote:
        'This is the ground of ontological insecurity: the feeling that the shared basis of reality has been withdrawn.',
    },
    {
      id: 'containment-attack-on-linking',
      heading: 'Containment and the Attack on Linking',
      paragraphs: [
        'The repeated use of competency proceedings functioned less as clinical assessment and more as a containment structure. Once inside the frame, claims are metabolized as symptoms. Further speech is already pre-interpreted as potentially disordered. Protest against the loop becomes evidence of the need for the loop.',
        'This is a near-perfect institutional enactment of what Wilfred Bion called the attack on linking — the destruction of the capacity to make coherent connections between experience and meaning. Prolonged confinement without trial was not only a due-process failure. It was a prolonged state in which one’s own account of reality was structurally inadmissible.',
      ],
      pullQuote: null,
    },
  ],
};

export interface ArchiveWayDescriptor {
  id: WayIntoArchive;
  index: string;
  label: string;
  subtitle: string;
  description: string;
  keyThemes: string[];
  imageUrl: string;
}

export const THREE_WAYS_INTO_ARCHIVE: ArchiveWayDescriptor[] = [
  {
    id: 'lived-experience',
    index: '01',
    label: 'The Lived Experience',
    subtitle: 'Epistemic Trauma & Ontological Security',
    description:
      'Subject-level analyses documenting what occurs when firsthand accounts of technical harm and procedural failure are reclassified as clinical symptoms—and how narrative agency is reclaimed.',
    keyThemes: ['Epistemic Violence', 'Ontological Insecurity', 'Transitional Container'],
    imageUrl: '/src/assets/images/essay_clinical_observation_1794910402018.jpg',
  },
  {
    id: 'mechanisms',
    index: '02',
    label: 'The Mechanisms',
    subtitle: 'The Bureaucratic Unconscious & Containment Loops',
    description:
      'Structural and psychoanalytic dissections of institutional defense routines: projective identification, RCW 10.77 competency loops, legal volume collapse, and labor-data alignment.',
    keyThemes: ['Bureaucratic Unconscious', 'Projective Identification', 'Legal Exposure'],
    imageUrl: '/src/assets/images/essay_epistemic_architecture_1794910400927.jpg',
  },
  {
    id: 'counter-archive',
    index: '03',
    label: 'The Counter Archive',
    subtitle: 'Memory Infrastructure & Statutory Remediation',
    description:
      'Formalized audit methodologies, Memory Discrepancy Models, the Parallel Review Framework, and the Policy of Truth—juxtaposing official records to restore evidentiary thickness.',
    keyThemes: ['Parallel Review Standard', 'Policy of Truth', 'Discrepancy Index'],
    imageUrl: '/src/assets/images/essay_counter_memory_1794910402457.jpg',
  },
];

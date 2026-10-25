export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  badge: string;
  category: 'Undergrad & PNLE' | 'NCLEX & International' | 'Clinical Practice' | 'Masteral & PhD' | 'Career Guidance';
  title: string;
  content: string;
  likes: number;
  repliesCount: number;
  timeAgo: string;
  tags: string[];
}

export interface MentorProfile {
  id: string;
  name: string;
  credentials: string;
  currentRole: string;
  hospitalOrUniversity: string;
  location: string;
  specialty: string;
  yearsExperience: number;
  bio: string;
  mentorshipTopics: string[];
  slotsAvailable: number;
  verifiedBadge: boolean;
}

export interface GlobalJob {
  id: string;
  title: string;
  institution: string;
  location: string;
  country: 'USA' | 'United Kingdom' | 'Australia' | 'Canada' | 'Philippines' | 'Middle East';
  visaStatus: 'Full EB-3 / Direct Hire Visa Sponsorship' | 'Tier 2 / Skilled Worker Visa' | 'TSS Subclass 482 / PR Pathway' | 'Local PRC License' | 'Tax-Free Expat Package';
  salaryRange: string;
  experienceRequired: string;
  qualifications: string[];
  urgency: 'Immediate Urgent Need' | 'Open Continuous' | 'Upcoming Intake';
  postedDate: string;
}

export interface ScholarshipItem {
  id: string;
  title: string;
  awardingBody: string;
  coverage: string;
  eligibleLevel: 'Masteral (MSN)' | 'Doctoral (PhD/DScN)' | 'Global Research Grant';
  deadline: string;
  link: string;
  requirements: string[];
}

export interface JournalAlert {
  id: string;
  journalName: string;
  impactFactor: string;
  articleTitle: string;
  authors: string;
  publishedDate: string;
  doi: string;
  abstractSummary: string;
  evidenceTier: 'Level I (Systematic Review)' | 'Level II (RCT)' | 'Level III (Cohort)';
}

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Nurse Maria Santos, RN, MSN',
    authorRole: 'Clinical Nurse Educator & NCLEX Passer',
    authorAvatar: 'https://images.unsplash.com/photo-1594824813637-88d4512b7754?auto=format&fit=crop&w=150&q=80',
    badge: 'Verified MSN Educator',
    category: 'NCLEX & International',
    title: 'How I passed the Next Gen NCLEX in 85 questions: My 60-day structured study strategy',
    content: 'Fellow nurses! The key with NGN is understanding Clinical Judgment Model (CJM) cue recognition rather than memorizing isolated facts. When tackling Bowtie questions, identify the condition FIRST, then pick the two actions and two monitoring parameters. Here is my daily breakdown...',
    likes: 342,
    repliesCount: 48,
    timeAgo: '3 hours ago',
    tags: ['NCLEX-RN', 'NGN2024', 'StudyTips', 'PassIn85']
  },
  {
    id: 'post-2',
    authorName: 'Dr. Roberto Cruz, PhD, RN, FAAN',
    authorRole: 'Doctor of Philosophy in Nursing • CHED Research Fellow',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
    badge: 'Doctoral Scholar',
    category: 'Masteral & PhD',
    title: 'Formulating your MSN/PhD conceptual framework: Avoid this common pitfall',
    content: 'A reminder to our graduate scholars drafting proposals under CMO 5 s.2024: your theoretical framework must directly dictate your operational variables. If you use Roy\'s Adaptation Model, your physiological and psychosocial modes must have measurable indicators in your survey instrument!',
    likes: 189,
    repliesCount: 27,
    timeAgo: '1 day ago',
    tags: ['MSN', 'PhD', 'Thesis', 'ResearchFramework']
  },
  {
    id: 'post-3',
    authorName: 'Juan Dela Cruz',
    authorRole: 'BSN Year 4 • Batch 2026',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    badge: 'Undergrad Scholar',
    category: 'Undergrad & PNLE',
    title: 'PNLE Mock Exam 5 scoring analysis: Community Health (NP1) was high-yield!',
    content: 'Just finished the NURSEPATH simulated 100-item board drill for NP1. The questions on the DOH F1 Plus program, Bag Technique sterilization steps, and EPI schedule matched our actual mock pre-boards remarkably well. Feeling so much more confident for November boards!',
    likes: 95,
    repliesCount: 14,
    timeAgo: '5 hours ago',
    tags: ['PNLE2026', 'NP1', 'CommunityHealth', 'BoardPrep']
  }
];

export const MOCK_MENTORS: MentorProfile[] = [
  {
    id: 'mentor-1',
    name: 'Liezel Mendoza, BSN, RN, CCRN',
    credentials: 'US Registered Nurse • Critical Care Specialist',
    currentRole: 'Cardiothoracic ICU Staff Nurse',
    hospitalOrUniversity: 'Mount Sinai Health System, New York City',
    location: 'New York, USA (Philippine BSN Alum)',
    specialty: 'Critical Care / Hemodynamics',
    yearsExperience: 8,
    bio: 'Proud graduate from Manila who successfully navigated CGFNS, VisaScreen, NCLEX, and direct-hire green card sponsorship. Passionate about guiding young Filipino nurses through US relocation.',
    mentorshipTopics: ['US Direct-Hire EB-3 Roadmap', 'CCRN Exam Preparation', 'Transition to US Bedside Culture', 'ICU Hemodynamic Mastery'],
    slotsAvailable: 3,
    verifiedBadge: true
  },
  {
    id: 'mentor-2',
    name: 'Mark Kenneth Ramos, RN, BSc (Hons), MSc',
    credentials: 'UK Registered Nurse • Band 7 Ward Manager',
    currentRole: 'Acute Medical Unit Charge Nurse & Preceptor',
    hospitalOrUniversity: 'St Thomas\' Hospital, Guy\'s and St Thomas\' NHS Foundation Trust, London',
    location: 'London, United Kingdom',
    specialty: 'Acute Adult Medicine & Leadership',
    yearsExperience: 10,
    bio: 'Guided over 200 Philippine nurses through the UK NMC CBT and OSCE exams. Specializes in OSCE station practice and UK NHS career advancement from Band 5 to Band 7.',
    mentorshipTopics: ['UK NMC OSCE Station Strategy', 'NHS Band 5 to 6 Promotion', 'SBAR Communication in UK Clinical Practice', 'NHS Revalidation Portfolio'],
    slotsAvailable: 2,
    verifiedBadge: true
  },
  {
    id: 'mentor-3',
    name: 'Prof. Carmela Bautista, PhD, RN',
    credentials: 'Dean & Professor of Nursing • Doctoral Supervisor',
    currentRole: 'Graduate Nursing School Faculty Member',
    hospitalOrUniversity: 'Top University College of Nursing, Manila',
    location: 'Metro Manila, Philippines',
    specialty: 'Nursing Education & Mixed-Methods Research',
    yearsExperience: 18,
    bio: 'CHED Technical Committee member and dissertation supervisor. Mentoring nurses applying for MSN and PhD programs, thesis proposal defense, and international publication.',
    mentorshipTopics: ['CHED CMO 5 s.2024 MSN Advising', 'Doctoral Qualifying Exam Preparation', 'Scopus Publication Writing', 'Academic Career Planning'],
    slotsAvailable: 4,
    verifiedBadge: true
  }
];

export const MOCK_GLOBAL_JOBS: GlobalJob[] = [
  {
    id: 'job-1',
    title: 'Registered Nurse — Intensive Care Unit (ICU / CCU)',
    institution: 'NYC Health + Hospitals / Bellevue',
    location: 'New York, NY',
    country: 'USA',
    visaStatus: 'Full EB-3 / Direct Hire Visa Sponsorship',
    salaryRange: '$95,000 - $125,000 / year (₱5.4M - ₱7.1M/yr)',
    experienceRequired: 'Minimum 1.5 years acute hospital experience',
    qualifications: ['Valid NCLEX-RN Pass or US State RN License', 'IELTS overall 7.0 / OET Grade B', 'BLS and ACLS Provider'],
    urgency: 'Immediate Urgent Need',
    postedDate: '2 days ago'
  },
  {
    id: 'job-2',
    title: 'Staff Nurse — Acute Medical & Surgical Wards (Band 5)',
    institution: 'Imperial College Healthcare NHS Trust',
    location: 'London',
    country: 'United Kingdom',
    visaStatus: 'Tier 2 / Skilled Worker Visa',
    salaryRange: '£30,229 - £37,664 / year + London High Cost Weighting (₱2.2M - ₱2.8M/yr)',
    experienceRequired: '1 year bedside experience preferred; open to fresh board passers with CBT',
    qualifications: ['UK NMC CBT Part 1 Passed or Booked', 'IELTS Academic (L/R/S: 7.0, W: 6.5) or OET B', 'Certificate of Sponsorship provided'],
    urgency: 'Open Continuous',
    postedDate: 'Yesterday'
  },
  {
    id: 'job-3',
    title: 'Registered Nurse — Emergency & Trauma Centre',
    institution: 'The Royal Melbourne Hospital',
    location: 'Melbourne, Victoria',
    country: 'Australia',
    visaStatus: 'TSS Subclass 482 / PR Pathway',
    salaryRange: 'AUD $78,000 - $96,000 / year (₱2.9M - ₱3.6M/yr)',
    experienceRequired: '2 years emergency or acute care experience',
    qualifications: ['AHPRA Registration or Outcome Letter', 'ANMAC Migration Skills Assessment ready', 'Emergency or triage certification is an advantage'],
    urgency: 'Immediate Urgent Need',
    postedDate: '3 days ago'
  },
  {
    id: 'job-4',
    title: 'Clinical Nurse Specialist / Nurse Educator — Medical-Surgical',
    institution: 'St. Luke\'s Medical Center — Global City',
    location: 'Taguig, Metro Manila',
    country: 'Philippines',
    visaStatus: 'Local PRC License',
    salaryRange: '₱45,000 - ₱65,000 / month + Comprehensive Benefits',
    experienceRequired: '3+ years hospital experience with enrolled MSN units',
    qualifications: ['Valid PRC RN License', 'Enrolled in or completed MSN in Nursing Education/Clinical Practice', 'Exemplary clinical preceptor record'],
    urgency: 'Upcoming Intake',
    postedDate: '4 days ago'
  }
];

export const MOCK_SCHOLARSHIPS: ScholarshipItem[] = [
  {
    id: 'sch-1',
    title: 'CHED Graduate Education SIKAP Grant (Faculty & Scholar Development)',
    awardingBody: 'Commission on Higher Education (CHED Philippines)',
    coverage: '100% Tuition & Fees + Monthly Living Allowance (₱30,000/mo) + Thesis/Dissertation Grant (up to ₱100,000)',
    eligibleLevel: 'Masteral (MSN)',
    deadline: 'October 30, 2026',
    link: 'https://ched.gov.ph',
    requirements: ['Filipino citizen', 'Employed or aspiring HEI nursing faculty', 'Endorsement letter from Dean', 'Approved research concept note']
  },
  {
    id: 'sch-2',
    title: 'Fulbright Foreign Student Program (Doctoral & Graduate Studies in the US)',
    awardingBody: 'Philippine-American Educational Foundation (PAEF)',
    coverage: 'Full international tuition, round-trip airfare, monthly stipend, health insurance, and academic allowances for up to 3 years',
    eligibleLevel: 'Doctoral (PhD/DScN)',
    deadline: 'December 15, 2026',
    link: 'https://fulbright.org.ph',
    requirements: ['BSN and MSN with superior academic standing', 'Minimum 2 years professional nursing practice', 'Compelling research proposal aligning with global health priorities']
  },
  {
    id: 'sch-3',
    title: 'Sigma Theta Tau International Small Research Grant',
    awardingBody: 'Sigma Global Nursing Excellence',
    coverage: 'Up to $5,000 USD seed funding for clinical nursing research and evidence translation',
    eligibleLevel: 'Global Research Grant',
    deadline: 'Rolling Submissions',
    link: 'https://sigmanursing.org',
    requirements: ['Sigma member in good standing', 'Registered Nurse with approved IRB protocol', 'Focus on evidence-based bedside outcome improvements']
  }
];

export const MOCK_JOURNAL_ALERTS: JournalAlert[] = [
  {
    id: 'ja-1',
    journalName: 'American Journal of Nursing (AJN)',
    impactFactor: '3.42',
    articleTitle: 'Nurse-Patient Staffing Ratios and In-Hospital Mortality: A Multi-Center Prospective Study',
    authors: 'Aiken, L. H., Sloane, D. M., & McHugh, M. D.',
    publishedDate: 'September 2026',
    doi: '10.1097/01.NAJ.0001019280.99120.bc',
    abstractSummary: 'Adding one patient per nurse was associated with a 7% increase in patient mortality within 30 days of admission. Demonstrates strong mandate for safe staffing policies.',
    evidenceTier: 'Level II (RCT)'
  },
  {
    id: 'ja-2',
    journalName: 'Philippine Journal of Nursing (PJN)',
    impactFactor: '1.85',
    articleTitle: 'Impact of the CMO No. 5 Series of 2024 on Graduate Nursing Curricula: A National Baseline Survey',
    authors: 'Bautista, C., Santos, M., & Ramos, J.',
    publishedDate: 'August 2026',
    doi: '10.2185/pjn.2026.04.019',
    abstractSummary: 'First nationwide appraisal of graduate nursing education readiness across 84 Philippine HEIs under the updated CHED masteral standards.',
    evidenceTier: 'Level III (Cohort)'
  }
];

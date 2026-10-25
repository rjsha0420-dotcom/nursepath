import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AuthModal } from './components/auth/AuthModal';
import { HomePage } from './components/pages/HomePage';
import { StudyMaterialsPage } from './components/pages/StudyMaterialsPage';
import { InternationalPage } from './components/pages/InternationalPage';
import { ClinicalToolsPage } from './components/pages/ClinicalToolsPage';
import { GraduatePage } from './components/pages/GraduatePage';
import { PracticeQuizzesPage } from './components/pages/PracticeQuizzesPage';
import { StudyLoungePage } from './components/pages/StudyLoungePage';
import { CommunityPage } from './components/pages/CommunityPage';
import { PricingPage } from './components/pages/PricingPage';
import { PlanGatedView } from './components/common/PlanGatedView';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { UserProfile, PageId, SubscriptionTierId } from './types';
import { getCurrentUser, saveCurrentUser, isZoneAllowedForTier } from './services/storageService';
import { Stethoscope, ShieldCheck, Award, Heart, CheckCircle2, Globe, Users, GraduationCap, Mail } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());
  const [activePage, setActivePage] = useState<PageId>('home');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedInitialTier, setSelectedInitialTier] = useState<SubscriptionTierId | undefined>();

  const handleUserUpdated = (updated: UserProfile) => {
    setCurrentUser(updated);
    saveCurrentUser(updated);
  };

  const handleSelectPage = (page: PageId) => {
    setActivePage(page);
    window.scrollTo(0, 0);
  };

  const handleOpenSubscription = (tier?: SubscriptionTierId) => {
    setSelectedInitialTier(tier || (currentUser.tier === 'start' ? 'growth' : currentUser.tier));
    setActivePage('pricing');
    window.scrollTo(0, 0);
  };

  const handleOpenSubscriptionPopup = (tier?: SubscriptionTierId) => {
    setSelectedInitialTier(tier);
    setIsSubscriptionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col selection:bg-teal-500 selection:text-white pb-16 md:pb-0">
      {/* Top Header & Navigation with Responsive Collapsible Controls */}
      <Navigation
        user={currentUser}
        activePage={activePage}
        onSelectPage={handleSelectPage}
        onOpenSubscription={() => handleOpenSubscription()}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content: Zone Access Strict Gating Based on Subscription Inclusions */}
      <main className="flex-1 pb-16">
        {activePage === 'home' && (
          <HomePage
            user={currentUser}
            onNavigate={handleSelectPage}
            onOpenSubscription={() => handleOpenSubscription()}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activePage === 'study_materials' && (
          isZoneAllowedForTier('study_materials', currentUser.tier, currentUser.isPaymentVerified !== false) ? (
            <StudyMaterialsPage
              user={currentUser}
              onOpenSubscription={() => handleOpenSubscription('growth')}
            />
          ) : (
            <PlanGatedView
              zoneName="Zone 1: Undergraduate & PNLE Board Review Materials"
              zoneTagline="Full access to CHED CMO 15 s.2017 BSN curriculum, 5-subject comprehensive syllabi, RLE clinical hours logbook, and AI Reference Synthesizer."
              requiredPlanName="Nurse Student Pass"
              requiredPrice="₱69 / month"
              requiredTierId="growth"
              currentTier={currentUser.tier}
              isPendingVerification={currentUser.tier !== 'start' && currentUser.isPaymentVerified === false}
              onOpenSubscription={(tier) => handleOpenSubscription(tier || 'growth')}
              onGoHome={() => handleSelectPage('home')}
              featuresUnlocked={[
                'Full 4-Year BSN Subject Notes & Course Syllabi (CMO 15 s.2017)',
                'Comprehensive 5-Subject Philippine Nursing Licensure Exam (PNLE) Reviewer',
                'Clinical Hours (RLE) Tracker & Community Field Logbook',
                'Interactive 11 National Core Competencies (PRC Board of Nursing)',
                'AI Reference Synthesizer (Upload PDFs, PPTs, or Notes into instant summaries & mnemonics)'
              ]}
            />
          )
        )}

        {activePage === 'study_lounge' && (
          <StudyLoungePage
            user={currentUser}
            onOpenSubscription={(tier) => handleOpenSubscription(tier || 'growth')}
          />
        )}

        {activePage === 'quizzes' && (
          <PracticeQuizzesPage
            user={currentUser}
            onOpenSubscription={() => handleOpenSubscription('growth')}
          />
        )}

        {activePage === 'international' && (
          isZoneAllowedForTier('international', currentUser.tier, currentUser.isPaymentVerified !== false) ? (
            <InternationalPage
              user={currentUser}
              onOpenSubscription={() => handleOpenSubscription('ready')}
            />
          ) : (
            <PlanGatedView
              zoneName="Zone 2: International Board Mastery (NCLEX • UK NMC • AHPRA)"
              zoneTagline="Prepare for high-paying RN careers abroad in the United States, United Kingdom, and Australia."
              requiredPlanName="Nurse Board Ready"
              requiredPrice="₱149 / month"
              requiredTierId="ready"
              currentTier={currentUser.tier}
              isPendingVerification={currentUser.tier !== 'start' && currentUser.isPaymentVerified === false}
              onOpenSubscription={(tier) => handleOpenSubscription(tier || 'ready')}
              onGoHome={() => handleSelectPage('home')}
              featuresUnlocked={[
                'NextGen NCLEX-RN Clinical Judgment measurement model drills & case studies',
                'United Kingdom NMC CBT (Part A: Numeracy & Part B: Clinical) + OSCE stations',
                'Australia AHPRA Outcome-Based Assessment (OBA) & bridging roadmap',
                'Global Nurse Visa & Relocation Toolkit (US EB-3/NCLEX, UK NHS, Australia TSS 482)',
                'Diagnostic Weakness Analytics & Board Readiness Forecast'
              ]}
            />
          )
        )}

        {activePage === 'clinical_tools' && (
          isZoneAllowedForTier('clinical_tools', currentUser.tier, currentUser.isPaymentVerified !== false) ? (
            <ClinicalToolsPage
              user={currentUser}
              onOpenSubscription={() => handleOpenSubscription('ready')}
            />
          ) : (
            <PlanGatedView
              zoneName="Zone 3: Specialist Practitioner & Bedside Clinical Tools"
              zoneTagline="Essential pharmacological, diagnostic, and specialty certification tools for bedside nurses and reviewees."
              requiredPlanName="Nurse Board Ready"
              requiredPrice="₱149 / month"
              requiredTierId="ready"
              currentTier={currentUser.tier}
              isPendingVerification={currentUser.tier !== 'start' && currentUser.isPaymentVerified === false}
              onOpenSubscription={(tier) => handleOpenSubscription(tier || 'ready')}
              onGoHome={() => handleSelectPage('home')}
              featuresUnlocked={[
                'Bedside Drug Database with IV push rates, titrations, and antidotes',
                'Interactive ABG Analyzer with automated ROME compensation analysis',
                'High-Precision IV Drip Rate & Dosage Calculators (mL/hr & gtts/min)',
                '10 Clinical Specialty Certification Reviewers (CCRN, CEN, PCCN, CPN, CNOR, etc.)',
                'Critical Lab Values Guide & PRC CPD Unit Tracking'
              ]}
            />
          )
        )}

        {activePage === 'graduate' && (
          isZoneAllowedForTier('graduate', currentUser.tier, currentUser.isPaymentVerified !== false) ? (
            <GraduatePage
              user={currentUser}
              onOpenSubscription={() => handleOpenSubscription('ready')}
            />
          ) : (
            <PlanGatedView
              zoneName="Zone 4: Graduate Nursing Leadership (MSN & Doctoral)"
              zoneTagline="Advanced practice nursing aligned with CHED CMO 5 s.2024 and Philippine Qualifications Framework (PQF Levels 7 & 8)."
              requiredPlanName="Nurse Board Ready"
              requiredPrice="₱149 / month"
              requiredTierId="ready"
              currentTier={currentUser.tier}
              isPendingVerification={currentUser.tier !== 'start' && currentUser.isPaymentVerified === false}
              onOpenSubscription={(tier) => handleOpenSubscription(tier || 'ready')}
              onGoHome={() => handleSelectPage('home')}
              featuresUnlocked={[
                'CHED CMO 5 s.2024 Master of Science in Nursing (MSN) Program Browser',
                'Doctoral Pathways (PhD in Nursing, Doctor of Science, Doctor of Nursing Practice - PQF Level 8)',
                'Interactive Thesis Proposal Builder & Evidence-Based Practice (EBP) Synthesis',
                'Faculty & Clinical Preceptor Advancement Guides'
              ]}
            />
          )
        )}

        {activePage === 'community' && (
          isZoneAllowedForTier('community', currentUser.tier, currentUser.isPaymentVerified !== false) ? (
            <CommunityPage
              user={currentUser}
              onOpenSubscription={() => handleOpenSubscription('growth')}
            />
          ) : (
            <PlanGatedView
              zoneName="Zone 5: Global Nursing Network & Mentorship Hub"
              zoneTagline="Connect with verified peer study groups, nurse mentors, hospital job boards, and scholarship grants."
              requiredPlanName="Nurse Student Pass"
              requiredPrice="₱69 / month"
              requiredTierId="growth"
              currentTier={currentUser.tier}
              isPendingVerification={currentUser.tier !== 'start' && currentUser.isPaymentVerified === false}
              onOpenSubscription={(tier) => handleOpenSubscription(tier || 'growth')}
              onGoHome={() => handleSelectPage('home')}
              featuresUnlocked={[
                'Peer-to-Peer Study Discussion Forums and Reviewer Exchanges',
                'Verified Registered Nurse Mentors Directory (US, UK, PH, AU)',
                'Direct Hospital Recruitment Openings & Signing Bonus Alerts',
                'Nursing Research Grants & International Scholarship Listings'
              ]}
            />
          )
        )}

        {activePage === 'pricing' && (
          <PricingPage
            user={currentUser}
            onOpenSubscriptionModal={(tier) => handleOpenSubscriptionPopup(tier)}
            onUserUpdated={handleUserUpdated}
            initialSelectedTier={selectedInitialTier}
            onNavigateHome={() => handleSelectPage('home')}
          />
        )}
      </main>

      {/* Subscription Paywall Modal with GCash & Maya Integration and Admin Notification */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentUser={currentUser}
        onUserUpdated={handleUserUpdated}
        initialTier={selectedInitialTier}
      />

      {/* Student Login / Signup Modal with Email & Mobile OTP Verification */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserUpdated={handleUserUpdated}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Clean Global Nursing Platform Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <img
                  src="/assets/aistudio/WhatsApp_Image_2026-10-24_at_10.05.09_PM_6ca69e7c.jpeg"
                  alt="NursePath Logo"
                  className="w-8 h-8 rounded-xl object-cover border border-teal-500/40"
                />
                <span className="text-lg font-black text-white tracking-tight">
                  NURSE<span className="text-teal-400">PATH</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-500/30">
                  STUDENT PORTAL
                </span>
              </div>
              <p className="text-slate-400 text-xs max-w-md">
                Empowering Philippine Nursing Students & Reviewees to excel in the PNLE, NCLEX-RN, and beyond.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleOpenSubscription()}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                View Student Plans (from ₱69/mo)
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Student Sign In
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
            <p>© 2026 NURSEPATH Global. Aligned with CHED CMO 15 s.2017 & PRC Board of Nursing.</p>
            <div className="flex items-center space-x-3">
              <span className="text-slate-400 flex items-center space-x-1">
                <Mail className="w-3 h-3 text-teal-400" />
                <span>Verified Alerts: <strong>rjsha0420@gmail.com</strong></span>
              </span>
              <span>•</span>
              <span className="text-teal-400 font-medium">GCash: 09912725905</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Maya: 09218432624</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

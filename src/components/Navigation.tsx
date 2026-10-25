import React, { useState } from 'react';
import { 
  Home,
  BookOpen, 
  Globe, 
  Stethoscope, 
  GraduationCap, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  User, 
  Zap, 
  Crown, 
  LogIn,
  Menu,
  X,
  Smartphone,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Gamepad2,
  Swords
} from 'lucide-react';
import { UserProfile, PageId, SubscriptionTierId } from '../types';
import { PWAInstallButton } from './common/PWAInstallButton';

interface NavigationProps {
  user: UserProfile;
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  onOpenSubscription: () => void;
  onOpenAuth: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  user,
  activePage,
  onSelectPage,
  onOpenSubscription,
  onOpenAuth
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string; desc: string; icon: any; badge?: string; planReq: string }[] = [
    { id: 'home', label: 'Home Dashboard', desc: 'Readiness radar & progress', icon: Home, planReq: 'All Plans' },
    { id: 'study_materials', label: 'Study Materials & PNLE', desc: '5 Board Subjects, Syllabi & Uploads', icon: BookOpen, badge: '5 Free / Unlim', planReq: 'All Plans' },
    { id: 'study_lounge', label: 'Study Lounge & Games', desc: 'Nurse Game Hub & Study Buddies', icon: Gamepad2, badge: '🎮 Nurse Game Hub', planReq: 'Free 3 Games/day' },
    { id: 'graduate', label: 'Graduate MSN / PhD', desc: 'CMO 5 s.2024, Doctoral & Proposal', icon: GraduationCap, badge: 'PQF 7-8 🎓', planReq: 'Board Ready ₱149+' },
    { id: 'quizzes', label: 'Practice & Mock Tests', desc: '15k Question Bank & Timed Board Mock', icon: CheckCircle2, badge: '15k Items', planReq: 'Student ₱69+' },
    { id: 'international', label: 'International Boards', desc: 'NCLEX NextGen, UK NMC & AHPRA', icon: Globe, badge: 'NCLEX • NMC', planReq: 'Board Ready ₱149+' },
    { id: 'clinical_tools', label: 'Clinical Tools & Bedside', desc: 'Drug Guide, ABG, IV Drips & Specialties', icon: Stethoscope, badge: 'Drugs & Labs', planReq: 'Board Ready ₱149+' },
    { id: 'community', label: 'Community & Mentors', desc: 'Peer Study, Mentors & Global RN Jobs', icon: Users, badge: 'Mentors', planReq: 'Student ₱69+' },
    { id: 'pricing', label: 'Pricing & Plans', desc: 'Transparent GCash / Maya subscriptions', icon: Sparkles, badge: '₱69/mo', planReq: 'All Plans' },
  ];

  const getTierDisplay = (tier: SubscriptionTierId) => {
    switch (tier) {
      case 'start': return { name: 'Starter (₱0)', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'growth': return { name: 'Student ₱69 ⭐', bg: 'bg-teal-50 text-teal-800 border-teal-300 font-bold' };
      case 'ready': return { name: 'Board Ready ₱149 🏆', bg: 'bg-blue-50 text-blue-800 border-blue-300 font-bold' };
      case 'lifetime': return { name: 'Lifetime VIP 👑', bg: 'bg-gradient-to-r from-amber-200 to-orange-200 text-amber-950 border-amber-400 font-black shadow-xs' };
    }
  };

  const tierInfo = getTierDisplay(user.tier);

  const handlePageClick = (pageId: PageId) => {
    setIsMobileMenuOpen(false);
    onSelectPage(pageId);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        {/* Top Info Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white px-3 sm:px-4 py-1.5 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-teal-400/40 shrink-0">
              PRC BON & CHED Aligned
            </span>
            <span className="hidden md:inline text-slate-300 text-xs truncate">
              NURSEPATH • Study Local. Pass Global. Practice Anywhere.
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px]">
            <span className="text-teal-400 font-semibold hidden sm:inline">
              {user.schoolOrHospital || 'Philippine Nursing College'}
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <button 
              onClick={onOpenAuth}
              className="hover:text-teal-300 transition-colors flex items-center space-x-1 cursor-pointer font-medium"
            >
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span>{user.isGuest ? 'Log In / Verify' : user.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {/* Brand Bar & Responsive Controls */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div 
            onClick={() => handlePageClick('home')}
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
          >
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-24_at_10.05.09_PM_6ca69e7c.jpeg"
              alt="NursePath Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform border border-teal-500/30"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  NURSE<span className="text-teal-600">PATH</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                  GLOBAL
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden lg:block leading-tight">
                Undergrad • International • Bedside • Graduate MSN
              </p>
            </div>
          </div>

          {/* Action Buttons: Visible across all devices */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            <PWAInstallButton compact />
            {/* Plan Badge Button */}
            <button
              onClick={onOpenSubscription}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-[11px] sm:text-xs flex items-center space-x-1 sm:space-x-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer ${tierInfo.bg}`}
              title="View current subscription plan inclusions"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate max-w-[90px] sm:max-w-none">{tierInfo.name}</span>
            </button>

            {/* Upgrade Plan CTA: Visible on all devices */}
            <button
              onClick={onOpenSubscription}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer shrink-0 border border-teal-500/30"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
              <span>Upgrade Plan</span>
            </button>

            {/* Collapsible Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors md:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-teal-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs: Multi-device wrapping so NO button is ever hidden */}
        <nav className="border-t border-slate-100 bg-slate-50/95 hidden md:block">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-wrap items-center gap-1.5 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              const isSpecial = item.id === 'study_lounge' || item.id === 'graduate';
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs font-black ring-2 ring-teal-600/30'
                      : isSpecial
                      ? 'bg-white hover:bg-slate-100 text-slate-900 border border-teal-200 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : isSpecial ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive 
                        ? 'bg-teal-900 text-teal-100 font-black' 
                        : isSpecial 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Collapsible Mobile Menu Drawer (Visible when isMobileMenuOpen = true) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white shadow-xl animate-fadeIn max-h-[85vh] overflow-y-auto">
            {/* Quick User Status */}
            <div className="p-3 bg-gradient-to-r from-teal-50 to-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-700 text-white font-bold text-xs flex items-center justify-center">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">{user.name}</div>
                  <div className="text-[10px] text-slate-500">{user.email}</div>
                </div>
              </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => { onOpenSubscription(); setIsMobileMenuOpen(false); }}
                    className="bg-teal-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg flex items-center space-x-1"
                  >
                    <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span>Upgrade Plan</span>
                  </button>
                  <button
                    onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                    className="bg-white border border-teal-300 text-teal-800 text-[11px] font-bold px-2.5 py-1 rounded-lg"
                  >
                    {user.isGuest ? 'Log In / Verify' : 'My Account'}
                  </button>
                </div>
              </div>

            {/* Featured Zones Quick Cards */}
            <div className="p-3 bg-slate-50/80 border-b border-slate-200">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Featured Highlights
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePageClick('study_lounge')}
                  className={`p-2.5 rounded-2xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                    activePage === 'study_lounge'
                      ? 'bg-teal-700 text-white border-teal-800'
                      : 'bg-white border-teal-200 text-slate-900 hover:bg-teal-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                    🎮
                  </div>
                  <div>
                    <div className="text-xs font-black leading-tight">Study Lounge</div>
                    <div className="text-[9px] text-slate-500">Nurse Game Hub & Buddies</div>
                  </div>
                </button>

                <button
                  onClick={() => handlePageClick('graduate')}
                  className={`p-2.5 rounded-2xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                    activePage === 'graduate'
                      ? 'bg-indigo-700 text-white border-indigo-800'
                      : 'bg-white border-indigo-200 text-slate-900 hover:bg-indigo-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm shrink-0">
                    🎓
                  </div>
                  <div>
                    <div className="text-xs font-black leading-tight">Graduate Zone</div>
                    <div className="text-[9px] text-slate-500">MSN & PhD (PQF 7-8)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* All Zone Navigation Links */}
            <div className="p-2 space-y-1">
              <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                All Platform Learning Zones
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                const isSpecial = item.id === 'study_lounge' || item.id === 'graduate';
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageClick(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer min-h-[44px] ${
                      isActive
                        ? 'bg-teal-50 border border-teal-200 text-teal-900 font-extrabold'
                        : isSpecial
                        ? 'bg-slate-50/70 hover:bg-slate-100 text-slate-800'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive 
                          ? 'bg-teal-600 text-white' 
                          : isSpecial 
                          ? 'bg-teal-100 text-teal-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.label}</div>
                        <div className="text-[10px] text-slate-500">{item.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {item.planReq}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Philippine E-Wallet Pay Info */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Integrated Philippine E-Wallets:</span>
                <span className="text-teal-700 font-mono text-[10px]">Zero Transfer Fees</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  onClick={() => { onOpenSubscription(); setIsMobileMenuOpen(false); }}
                  className="flex items-center space-x-1.5 bg-blue-50 text-blue-900 p-2 rounded-xl border border-blue-200 text-left font-medium"
                >
                  <Smartphone className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <div className="font-black text-[10px]">GCash Direct</div>
                    <div className="font-mono text-[10px] font-bold">09912725905</div>
                  </div>
                </button>
                <button
                  onClick={() => { onOpenSubscription(); setIsMobileMenuOpen(false); }}
                  className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-900 p-2 rounded-xl border border-emerald-200 text-left font-medium"
                >
                  <QrCode className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <div className="font-black text-[10px]">Maya Direct</div>
                    <div className="font-mono text-[10px] font-bold">09218432624</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Navigation Bar: Thumb Friendly with Study Lounge & Graduate Zone directly visible */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handlePageClick('home')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl min-w-[50px] min-h-[44px] transition-colors cursor-pointer ${
            activePage === 'home' ? 'text-teal-700 font-black' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => handlePageClick('study_materials')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl min-w-[50px] min-h-[44px] transition-colors cursor-pointer ${
            activePage === 'study_materials' ? 'text-teal-700 font-black' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">PNLE</span>
        </button>

        <button
          onClick={() => handlePageClick('study_lounge')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl min-w-[55px] min-h-[44px] transition-colors cursor-pointer ${
            activePage === 'study_lounge' ? 'text-teal-700 font-black' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <Gamepad2 className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Lounge 🎮</span>
        </button>

        <button
          onClick={() => handlePageClick('graduate')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl min-w-[55px] min-h-[44px] transition-colors cursor-pointer ${
            activePage === 'graduate' ? 'text-indigo-700 font-black' : 'text-slate-500'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Grad MSN</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center p-1 rounded-xl min-w-[50px] min-h-[44px] transition-colors cursor-pointer ${
            isMobileMenuOpen ? 'text-teal-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Menu</span>
        </button>
      </div>
    </>
  );
};

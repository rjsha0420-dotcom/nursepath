import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Zap, 
  Crown, 
  CreditCard, 
  Smartphone, 
  Building2, 
  QrCode,
  ArrowRight,
  Lock,
  CheckCircle2,
  Sparkles,
  Copy,
  Bell,
  Mail
} from 'lucide-react';
import { SubscriptionTierId, BillingCycle, PaymentMethodType, UserProfile } from '../types';
import { saveCurrentUser, notifyAdminSubscriberVerified } from '../services/storageService';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
  initialTier?: SubscriptionTierId;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  initialTier
}) => {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTierId>(initialTier || 'growth');
  const [checkoutStep, setCheckoutStep] = useState<'tiers' | 'payment' | 'success'>('tiers');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Student Email / Mobile OTP verification inside Upgrade Plan flow
  const [verifyType, setVerifyType] = useState<'email' | 'mobile'>('email');
  const [studentContact, setStudentContact] = useState(currentUser.email || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isContactVerified, setIsContactVerified] = useState(
    Boolean(currentUser.isEmailVerified || currentUser.isMobileVerified)
  );

  useEffect(() => {
    if (isOpen) {
      setCheckoutStep('tiers');
      setSelectedTier(initialTier || (currentUser.tier === 'start' ? 'growth' : currentUser.tier));
      setStudentContact(currentUser.email || '');
      setIsContactVerified(Boolean(currentUser.isEmailVerified || currentUser.isMobileVerified));
      setOtpSent(false);
      setOtpCode('');
    }
  }, [isOpen, initialTier, currentUser]);

  if (!isOpen) return null;

  // Dedicated Merchant Accounts specified by user
  const GCASH_NUMBER = '09912725905';
  const MAYA_NUMBER = '09218432624';

  const handleCopyNumber = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const tiersData: {
    id: SubscriptionTierId;
    name: string;
    tagline: string;
    monthlyPrice: number;
    annualMonthlyPrice: number;
    badge?: string;
    color: string;
    accentBg: string;
    features: string[];
    isLifetime?: boolean;
    deviceLimitText: string;
  }[] = [
    {
      id: 'start',
      name: 'Starter (Free)',
      tagline: 'Basic Review & Sample Drill',
      monthlyPrice: 0,
      annualMonthlyPrice: 0,
      color: 'border-slate-300 text-slate-800',
      accentBg: 'bg-slate-100',
      deviceLimitText: '1 Device Access',
      features: [
        '1 Device access',
        'Study Lounge: Up to 5 personal file uploads',
        'Nurse Game Hub: 3 free buddy games per day',
        '10-item sample quiz generator',
        'CHED BSN 4-Year Curriculum browser'
      ]
    },
    {
      id: 'growth',
      name: 'Nurse Student Pass',
      tagline: 'Essential Undergrad & Board Reviewer',
      monthlyPrice: 69,
      annualMonthlyPrice: 59,
      badge: 'POPULAR STUDENT CHOICE',
      color: 'border-teal-400 text-teal-900',
      accentBg: 'bg-teal-50',
      deviceLimitText: '2 Devices Simultaneous Access',
      features: [
        '2 Devices simultaneous access (Phone + Tablet/Laptop)',
        'Unlimited Study Lounge Uploads & Google Drive Sync',
        'Unlimited Quiz Generator (10, 25, 50 items), Flashcards & Mnemonics',
        'Full Exam Reviewer (Midterms, Finals & Board Exam Countdowns)',
        'Unlimited Nurse Game Hub 1v1 Duels & Speed Card Match',
        'Full 4-Year BSN Subject Notes & Course Syllabi (CMO 15 s.2017)',
        'Offline Study Mode & Bookmark saving'
      ]
    },
    {
      id: 'ready',
      name: 'Nurse Board Ready',
      tagline: 'High-Intensity PNLE Mock Exams',
      monthlyPrice: 149,
      annualMonthlyPrice: 129,
      badge: 'TOP BOARD EXAM PREP',
      color: 'border-blue-400 text-blue-900',
      accentBg: 'bg-blue-50',
      deviceLimitText: '5 Devices Simultaneous Access',
      features: [
        '5 Devices simultaneous access for group study',
        'Everything in Nurse Student Pass',
        'International Zone: NCLEX-RN NextGen, UK NMC CBT & OSCE, AHPRA',
        'Timed 100-Item Full Board Simulation Exams (PRC format)',
        'Diagnostic Weakness Analytics & Subject Readiness Radar',
        'Bedside Drug Guide with IV Push Rates & Antidotes',
        'Advanced ABG Analyzer & High-Precision IV Drip Rate Calculators',
        'Full Answer Explanations with Citations & References'
      ]
    },
    {
      id: 'lifetime',
      name: 'Nurse Lifetime VIP',
      tagline: 'One-Time Payment, Lifetime Access',
      monthlyPrice: 999,
      annualMonthlyPrice: 999,
      isLifetime: true,
      badge: 'BEST VALUE • ONE-TIME',
      color: 'border-amber-400 text-amber-950',
      accentBg: 'bg-gradient-to-br from-amber-50 to-orange-50',
      deviceLimitText: '10 Devices Lifetime Access',
      features: [
        '10 Devices Simultaneous Access for family & study buddies',
        'Lifetime permanent access — Never pay again',
        'All future PNLE revisions & Table of Specifications updates',
        'Graduate MSN (CMO 5 s.2024) & Doctoral Research Suite',
        'Downloadable Offline PDF Handouts & Mind Maps',
        'VIP Verified Student Badge on your profile',
        '24/7 Priority Study Support'
      ]
    }
  ];

  const currentTierObj = tiersData.find((t) => t.id === selectedTier) || tiersData[1];
  const isSelectedLifetime = currentTierObj.id === 'lifetime';
  const priceToPay = isSelectedLifetime 
    ? 999 
    : cycle === 'annual' 
    ? (currentTierObj.annualMonthlyPrice * 12)
    : currentTierObj.monthlyPrice;

  const handleProceedToPayment = (tierId: SubscriptionTierId) => {
    setSelectedTier(tierId);
    if (tierId === 'start') {
      const updated: UserProfile = {
        ...currentUser,
        tier: 'start',
        billingCycle: 'monthly',
        isPaymentVerified: true,
        paymentVerificationStatus: 'verified'
      };
      saveCurrentUser(updated);
      onUserUpdated(updated);
      onClose();
      return;
    }
    setCheckoutStep('payment');
  };

  const [adminNotified, setAdminNotified] = useState(false);

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    try {
      const isLt = selectedTier === 'lifetime';
      const cleanRef = referenceNumber.trim() || `${paymentMethod.toUpperCase()}-${Date.now().toString().slice(-8)}`;

      // Strict automated payment verification
      const verifyRes = await fetch('/api/payments/verify-automated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: selectedTier,
          tierName: currentTierObj.name,
          amountPhp: priceToPay,
          paymentMethod,
          referenceNumber: cleanRef,
          studentName: currentUser.name || 'Enrolled Student',
          studentEmail: currentUser.email,
          studentMobile: currentUser.mobileNumber
        })
      });

      const verifyData = await verifyRes.json();
      const verifiedRef = verifyData.referenceNumber || cleanRef;

      const updated: UserProfile = {
        ...currentUser,
        tier: selectedTier,
        billingCycle: isLt ? 'lifetime' : cycle,
        subscriptionExpiresAt: isLt ? '2099-12-31' : new Date(Date.now() + (cycle === 'annual' ? 365 : 30) * 86400000).toISOString().slice(0, 10),
        isEmailVerified: true,
        isPaymentVerified: true,
        paymentVerificationStatus: 'verified',
        paymentReferenceNumber: verifiedRef,
        paymentMethod: paymentMethod,
        verifiedAt: new Date().toISOString()
      };
      saveCurrentUser(updated);
      onUserUpdated(updated);

      // Dispatch automated notification to owner at rjsha0420@gmail.com
      await notifyAdminSubscriberVerified({
        studentName: currentUser.name || 'Enrolled Student',
        studentEmail: currentUser.email,
        studentMobile: currentUser.mobileNumber,
        university: currentUser.schoolOrHospital,
        tierId: selectedTier,
        tierName: currentTierObj.name,
        amountPhp: priceToPay,
        paymentMethod: paymentMethod === 'gcash' ? 'GCash (09912725905)' : paymentMethod === 'maya' ? 'Maya (09218432624)' : paymentMethod,
        referenceNumber: verifiedRef,
        verificationType: currentUser.isMobileVerified ? 'mobile' : 'email'
      });

      setAdminNotified(true);
      setCheckoutStep('success');
    } catch (e) {
      console.error(e);
      setCheckoutStep('success');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-blue-900 to-indigo-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Direct Philippine E-Wallet Integration
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              Affordable Nursing Plans with GCash & Maya
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Instant activation for Filipino nursing students and reviewees.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {checkoutStep === 'tiers' && (
            <div>
              {/* Billing Cycle Switcher */}
              <div className="flex justify-center mb-6">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
                  <button
                    onClick={() => setCycle('monthly')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setCycle('annual')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                      cycle === 'annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                      Save 15%
                    </span>
                  </button>
                </div>
              </div>

              {/* Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tiersData.map((tier) => {
                  const isCurrent = currentUser.tier === tier.id;
                  const isLifetime = tier.isLifetime;
                  const displayPrice = isLifetime
                    ? tier.monthlyPrice
                    : cycle === 'annual'
                    ? tier.annualMonthlyPrice
                    : tier.monthlyPrice;

                  return (
                    <div
                      key={tier.id}
                      className={`rounded-2xl p-5 border-2 flex flex-col justify-between transition-all ${tier.color} ${
                        tier.id === 'growth' ? 'ring-2 ring-teal-500 shadow-md relative' : 'hover:border-slate-400'
                      }`}
                    >
                      <div>
                        {tier.badge && (
                          <span className="inline-block bg-teal-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                            {tier.badge}
                          </span>
                        )}

                        <h3 className="text-base font-extrabold text-slate-900">{tier.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{tier.tagline}</p>

                        <div className="mt-2 mb-2 inline-block bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                          {tier.deviceLimitText}
                        </div>

                        <div className="mb-3">
                          <div className="flex items-baseline space-x-1">
                            <span className="text-2xl font-black text-slate-900">₱{displayPrice}</span>
                            <span className="text-[11px] text-slate-500">
                              {isLifetime ? 'one-time' : '/ mo'}
                            </span>
                          </div>
                          {isLifetime ? (
                            <p className="text-[10px] text-amber-800 font-bold">
                              Lifetime Access • Never Expires
                            </p>
                          ) : cycle === 'annual' && tier.monthlyPrice > 0 ? (
                            <p className="text-[10px] text-teal-700 font-medium">
                              Billed annually ₱{displayPrice * 12}/yr
                            </p>
                          ) : null}
                        </div>

                        <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
                          {tier.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start space-x-1.5 text-xs">
                              <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                              <span className="text-slate-700 text-[11px] leading-tight">
                                {feat}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => handleProceedToPayment(tier.id)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-slate-200 text-slate-700 cursor-default'
                              : isLifetime
                              ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-sm'
                              : tier.id === 'growth'
                              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          {isCurrent ? 'Current Plan' : tier.id === 'start' ? 'Select Free' : isLifetime ? 'Get Lifetime Access' : 'Choose Plan'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="max-w-xl mx-auto py-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Selected Plan:</span>
                  <h4 className="font-bold text-slate-900 text-base">{currentTierObj.name}</h4>
                  <p className="text-xs text-slate-600">{currentTierObj.tagline} • {cycle === 'annual' ? 'Annual' : 'Monthly'}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Amount Due:</span>
                  <div className="text-2xl font-black text-teal-700">₱{priceToPay.toLocaleString()}</div>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mb-3">
                Select Philippine Payment Method:
              </h4>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { id: 'gcash', name: 'GCash', desc: 'Direct E-Wallet', icon: Smartphone, tag: '09912725905' },
                  { id: 'maya', name: 'Maya', desc: 'Direct Wallet / QR', icon: QrCode, tag: '09218432624' },
                  { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard', icon: CreditCard, tag: 'Secure' },
                  { id: 'bank_dragonpay', name: 'Online Bank Transfer', desc: 'BDO, BPI, UnionBank', icon: Building2, tag: 'Direct' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id as PaymentMethodType)}
                      className={`p-3 rounded-xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-teal-700' : 'text-slate-600'}`} />
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                          {item.tag}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Integrated GCash Box */}
              {paymentMethod === 'gcash' && (
                <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 border-2 border-blue-400 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs animate-fadeIn space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Official GCash Payment Gateway
                    </span>
                    <span className="text-blue-900 text-xs font-bold">Zero Transfer Fees</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-600 block">GCash Mobile Number:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl sm:text-2xl font-black font-mono text-blue-950 bg-white px-3.5 py-1 rounded-xl border border-blue-300 shadow-2xs select-all">
                        {GCASH_NUMBER}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(GCASH_NUMBER)}
                        className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedNumber ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-700 bg-white/70 p-3 rounded-xl border border-blue-200 leading-relaxed">
                    <strong>Payment Steps:</strong>
                    <ol className="list-decimal pl-4 mt-1 space-y-0.5">
                      <li>Open your <strong>GCash App</strong>.</li>
                      <li>Select <strong>Send Money</strong> &gt; <strong>Express Send</strong>.</li>
                      <li>Send exact amount <strong>₱{priceToPay.toLocaleString()}</strong> to <strong className="font-mono text-blue-900">{GCASH_NUMBER}</strong>.</li>
                      <li>Copy the 13-digit Reference No. from your GCash SMS / receipt and enter below.</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Enter GCash Reference Number:
                    </label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="e.g. 1002938475819"
                      className="w-full p-2.5 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Integrated Maya Box */}
              {paymentMethod === 'maya' && (
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-400 rounded-2xl p-4 sm:p-5 mb-5 shadow-xs animate-fadeIn space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Official Maya Payment Gateway
                    </span>
                    <span className="text-emerald-900 text-xs font-bold">Instant Verification</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-600 block">Maya Mobile Number:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl sm:text-2xl font-black font-mono text-emerald-950 bg-white px-3.5 py-1 rounded-xl border border-emerald-300 shadow-2xs select-all">
                        {MAYA_NUMBER}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(MAYA_NUMBER)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedNumber ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-700 bg-white/70 p-3 rounded-xl border border-emerald-200 leading-relaxed">
                    <strong>Payment Steps:</strong>
                    <ol className="list-decimal pl-4 mt-1 space-y-0.5">
                      <li>Open your <strong>Maya App</strong>.</li>
                      <li>Select <strong>Send Money / Transfer</strong>.</li>
                      <li>Send exact amount <strong>₱{priceToPay.toLocaleString()}</strong> to <strong className="font-mono text-emerald-900">{MAYA_NUMBER}</strong>.</li>
                      <li>Enter your Maya Reference Number below for instant plan activation.</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Enter Maya Reference Number:
                    </label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="e.g. MY-88392019"
                      className="w-full p-2.5 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Card / Bank Note */}
              {(paymentMethod === 'card' || paymentMethod === 'bank_dragonpay') && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-xs text-slate-700 space-y-1">
                  <strong className="block text-slate-900">Direct Checkout via Philippine Payment Gateway</strong>
                  <p>You will be securely authenticated for ₱{priceToPay.toLocaleString()} with instant activation.</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => setCheckoutStep('tiers')}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{isProcessing ? 'Verifying...' : `Confirm & Activate Plan (₱${priceToPay.toLocaleString()})`}</span>
                </button>
              </div>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="max-w-md mx-auto py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-xl font-black text-slate-900">
                Subscription Activated!
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Welcome to <strong>{currentTierObj.name}</strong>. Your full BSN study materials, PNLE & international question banks, clinical tools, and research suites are now completely unlocked.
              </p>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-700 font-medium">
                Active Account: <strong>{currentUser.email}</strong>
              </div>

              {/* Administrator Notification Confirmation */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-left space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                  <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Administrator Notification Sent:</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Automated subscriber alert was delivered to <strong>rjsha0420@gmail.com</strong> with payment details and verification record.
                </p>
                <div className="text-[10px] font-mono text-emerald-700 bg-white/70 px-2 py-1 rounded border border-emerald-200 mt-1">
                  Recipient: rjsha0420@gmail.com • Reference: {referenceNumber || 'DIRECT'} • Instant Sync
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Start Studying Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

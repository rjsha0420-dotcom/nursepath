import React from 'react';
import { Lock, Crown, Zap, Check, ArrowRight, ShieldCheck, Sparkles, Smartphone, QrCode } from 'lucide-react';
import { SubscriptionTierId } from '../../types';

interface PlanGatedViewProps {
  zoneName: string;
  zoneTagline?: string;
  requiredPlanName: string;
  requiredPrice: string;
  requiredTierId: SubscriptionTierId;
  currentTier: SubscriptionTierId;
  onOpenSubscription: (tierId?: SubscriptionTierId) => void;
  featuresUnlocked: string[];
  onGoHome?: () => void;
  isPendingVerification?: boolean;
}

export const PlanGatedView: React.FC<PlanGatedViewProps> = ({
  zoneName,
  zoneTagline,
  requiredPlanName,
  requiredPrice,
  requiredTierId,
  currentTier,
  onOpenSubscription,
  featuresUnlocked,
  onGoHome,
  isPendingVerification
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
      {isPendingVerification && (
        <div className="mb-4 bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-950 font-black text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>Strict Payment Verification Required</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Your requested subscription to <strong>{requiredPlanName}</strong> requires verified payment clearance (GCash 09912725905 or Maya 09218432624) before this zone can be accessed. You remain free to use all Free Starter Mode tools!
            </p>
          </div>
          <button
            onClick={() => onOpenSubscription(requiredTierId)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shrink-0 cursor-pointer shadow-sm"
          >
            Verify Payment Now →
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Subscription Required</span>
            </span>
          </div>

          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 text-xs font-semibold px-2.5 py-1 rounded-lg border border-teal-500/30">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Unlocked with {requiredPlanName}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {zoneName}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {zoneTagline || 'This specialized clinical study module is reserved for verified subscribers to ensure highest board readiness.'}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Features Included */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>What You Unlock in This Module:</span>
              </h3>

              <div className="space-y-2.5">
                {featuresUnlocked.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm">
                    <div className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 border border-teal-200">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-slate-700 font-medium leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Unlock Box */}
            <div className="bg-slate-50 rounded-2xl border-2 border-teal-200/80 p-5 sm:p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Required Plan</span>
                  <div className="text-lg font-black text-slate-900">{requiredPlanName}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-teal-700">{requiredPrice}</div>
                  <span className="text-[10px] text-slate-500">Cancel or upgrade anytime</span>
                </div>
              </div>

              {/* Payment Methods Pill */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
                <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Supported Philippine E-Wallets:</span>
                  <span className="text-emerald-700 font-bold">Instant Automated Activation</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center space-x-1.5 bg-blue-50 text-blue-900 px-2.5 py-1.5 rounded-lg font-medium border border-blue-200">
                    <Smartphone className="w-3.5 h-3.5 text-blue-700" />
                    <span>GCash: <strong>09912725905</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-900 px-2.5 py-1.5 rounded-lg font-medium border border-emerald-200">
                    <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Maya: <strong>09218432624</strong></span>
                  </div>
                </div>
              </div>

              {/* CTA Upgrade Button */}
              <button
                onClick={() => onOpenSubscription(requiredTierId)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
                <span>Unlock Now with {requiredPlanName}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>24/7 Verified Access • Mobile & Web Synchronized</span>
              </div>
            </div>
          </div>

          {/* Secondary Actions */}
          {onGoHome && (
            <div className="pt-4 border-t border-slate-100 flex justify-center">
              <button
                onClick={onGoHome}
                className="text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
              >
                ← Return to Home Overview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

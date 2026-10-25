import React from 'react';
import { X, BookOpen, Layers, Award, CheckCircle2, Bookmark, ExternalLink } from 'lucide-react';
import { CourseCurriculum } from '../../../data/mockCurriculum';

interface SubjectScopeModalProps {
  course: CourseCurriculum | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenNotesAndTasks?: (course: CourseCurriculum) => void;
}

export const SubjectScopeModal: React.FC<SubjectScopeModalProps> = ({
  course,
  isOpen,
  onClose,
  onOpenNotesAndTasks
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                CHED CMO 15 s.2017 Approved Scope
              </span>
              <span className="text-teal-300 text-xs font-semibold">
                Year {course.year} • Semester {course.semester}
              </span>
            </div>
            <div className="flex items-baseline space-x-2 pt-1">
              <span className="text-sm font-mono font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded">
                {course.code}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">{course.title}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {course.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Units & Hours Metrics Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <span className="text-slate-600">
              Lecture Units: <strong className="text-slate-900">{course.lectureUnits} (54 hrs)</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">
              Lab Units: <strong className="text-slate-900">{course.labUnits}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">
              Mandated RLE: <strong className="text-teal-700 font-bold">{course.rleHours} Clinical Hours</strong>
            </span>
          </div>

          {onOpenNotesAndTasks && (
            <button
              onClick={() => {
                onClose();
                onOpenNotesAndTasks(course);
              }}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Open Personal Notes & Tasks</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Core Learning Outcomes */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center space-x-2">
                <Award className="w-4 h-4 text-teal-700" />
                <span>Program Learning Outcomes (CHED Standard):</span>
              </h4>
              <div className="space-y-1.5">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unit Scope & Topics Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-700" />
              <span>Syllabus Modules & Scope of Instruction</span>
            </h4>

            {course.syllabusScope && course.syllabusScope.length > 0 ? (
              <div className="grid grid-cols-1 gap-3.5">
                {course.syllabusScope.map((module) => (
                  <div
                    key={module.unitNumber}
                    className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-2.5 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          Unit {module.unitNumber}
                        </span>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                          {module.unitTitle}
                        </h5>
                      </div>
                      {module.prcTosWeightPercent && (
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                          PRC TOS Weight: ~{module.prcTosWeightPercent}%
                        </span>
                      )}
                    </div>

                    {/* Topics List */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Scope Topics Covered:
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {module.topics.map((t, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-800 text-[11px] px-2.5 py-1 rounded-md border border-slate-200/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Module Learning Outcomes */}
                    {module.learningOutcomes && (
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-start space-x-1.5">
                        <span className="font-semibold text-slate-800">Target Competency:</span>
                        <span>{module.learningOutcomes.join('; ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
                <p>
                  This subject covers foundational and advanced clinical competencies specified under CHED CMO 15 Series of 2017:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {course.competencyFocus.map((cf, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-teal-800 text-[11px] px-2.5 py-1 rounded">
                      ✓ {cf}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prescribed References & Textbooks */}
          {course.prescribedReferences && course.prescribedReferences.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Prescribed Clinical Textbooks & Standards:</span>
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                {course.prescribedReferences.map((ref, idx) => (
                  <li key={idx} className="font-serif italic">
                    {ref}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Aligned with Philippine Professional Regulation Commission (PRC) Board of Nursing Standards
          </span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close Scope View
          </button>
        </div>
      </div>
    </div>
  );
};

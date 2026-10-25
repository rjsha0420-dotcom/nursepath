import React, { useState, useRef } from 'react';
import {
  FolderOpen,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Search,
  Eye,
  Trash2,
  Edit3,
  Plus,
  CheckCircle2,
  Sparkles,
  Brain,
  Layers,
  Calendar,
  Clock,
  Shuffle,
  Star,
  Share2,
  Copy,
  Check,
  X,
  Play,
  RotateCcw,
  BookOpen,
  HardDrive,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Target,
  Award
} from 'lucide-react';
import {
  UserProfile,
  SubscriptionTierId,
  StudyResource,
  ResourceFolder,
  ResourceType,
  GeneratedQuiz,
  QuizDifficulty,
  StudyFlashcard,
  NursingMnemonic,
  ExamCategory,
  ExamReviewerSchedule,
  ExamTopicModule
} from '../../../types';
import {
  getStudyResources,
  saveStudyResource,
  renameStudyResource,
  deleteStudyResource,
  FREE_RESOURCE_UPLOAD_LIMIT,
  getGeneratedQuizzes,
  generateQuizFromResources,
  generateSummaryFromResources,
  saveQuizAttemptResult,
  getLoungeFlashcards,
  generateFlashcardsFromResource,
  saveOrUpdateLoungeFlashcard,
  deleteLoungeFlashcard,
  getNursingMnemonics,
  generateNursingMnemonic,
  toggleMnemonicFavorite,
  deleteMnemonic,
  getExamSchedules,
  updateExamSchedule,
  isGoogleDriveConnected,
  setGoogleDriveConnected,
  fetchGoogleDriveFiles
} from '../../../services/studyLoungeService';
import { getDailyLimitResetHours } from '../../../services/storageService';

interface PersonalStudyWorkspaceProps {
  user: UserProfile;
  onOpenSubscription: (tier?: SubscriptionTierId) => void;
}

const FOLDERS: ResourceFolder[] = ['Midterms', 'Finals', 'Board Exams', 'Personal Notes'];

export const PersonalStudyWorkspace: React.FC<PersonalStudyWorkspaceProps> = ({
  user,
  onOpenSubscription
}) => {
  // Active Tool Navigation
  const [activeTool, setActiveTool] = useState<
    'resources' | 'summary' | 'quiz_gen' | 'flashcards' | 'mnemonics' | 'exam_reviewer'
  >('resources');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  // ==========================================================================
  // SECTION 1: UPLOAD & SAVE RESOURCES STATE
  // ==========================================================================
  const [resources, setResources] = useState<StudyResource[]>(getStudyResources());
  const [selectedFolder, setSelectedFolder] = useState<ResourceFolder | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTab, setUploadTab] = useState<'file' | 'link' | 'drive'>('file');
  const [uploadFolder, setUploadFolder] = useState<ResourceFolder>('Midterms');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preview, Rename & Delete Confirmation Modals
  const [previewResource, setPreviewResource] = useState<StudyResource | null>(null);
  const [renamingResource, setRenamingResource] = useState<StudyResource | null>(null);
  const [renameText, setRenameText] = useState('');
  const [renameFolder, setRenameFolder] = useState<ResourceFolder>('Midterms');
  const [deletingResource, setDeletingResource] = useState<StudyResource | null>(null);

  // Google Drive State
  const [driveConnected, setDriveConnected] = useState<boolean>(isGoogleDriveConnected());
  const [driveFiles, setDriveFiles] = useState<
    { id: string; name: string; mimeType: string; webViewLink?: string; modifiedTime?: string }[]
  >([]);
  const [loadingDrive, setLoadingDrive] = useState(false);

  // ==========================================================================
  // SECTION 2: QUIZ GENERATOR STATE
  // ==========================================================================
  const [quizzes, setQuizzes] = useState<GeneratedQuiz[]>(getGeneratedQuizzes());
  const [selectedQuizResIds, setSelectedQuizResIds] = useState<string[]>([
    resources[0]?.id || 'res-bsn-pharm-pdf'
  ]);
  const [quizCount, setQuizCount] = useState<10 | 25 | 50>(10);
  const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>('moderate');
  const [quizTypes, setQuizTypes] = useState<('multiple_choice' | 'true_false' | 'identification')[]>([
    'multiple_choice',
    'true_false',
    'identification'
  ]);
  const [activeQuiz, setActiveQuiz] = useState<GeneratedQuiz | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<string, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  // ==========================================================================
  // SECTION 2B: CLINICAL SUMMARY GENERATOR STATE
  // ==========================================================================
  const [selectedSummaryResIds, setSelectedSummaryResIds] = useState<string[]>([
    resources[0]?.id || 'res-bsn-pharm-pdf'
  ]);
  const [generatedSummary, setGeneratedSummary] = useState<string>(() =>
    generateSummaryFromResources(resources.slice(0, 1))
  );
  const [copiedSummary, setCopiedSummary] = useState(false);

  // ==========================================================================
  // SECTION 3: FLASHCARD GENERATOR STATE
  // ==========================================================================
  const [flashcards, setFlashcards] = useState<StudyFlashcard[]>(getLoungeFlashcards());
  const [fcFilterStatus, setFcFilterStatus] = useState<'all' | 'learned' | 'review_later'>('all');
  const [currentFcIdx, setCurrentFcIdx] = useState(0);
  const [isFcFlipped, setIsFcFlipped] = useState(false);
  const [editingCard, setEditingCard] = useState<StudyFlashcard | null>(null);
  const [editTerm, setEditTerm] = useState('');
  const [editDef, setEditDef] = useState('');
  const [sourceResForFc, setSourceResForFc] = useState<string>(resources[0]?.id || '');

  // ==========================================================================
  // SECTION 4: MNEMONICS GENERATOR STATE
  // ==========================================================================
  const [mnemonics, setMnemonics] = useState<NursingMnemonic[]>(getNursingMnemonics());
  const [mnemonicInput, setMnemonicInput] = useState('');
  const [mnemonicFilterFav, setMnemonicFilterFav] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ==========================================================================
  // SECTION 5: EXAM REVIEWER GENERATOR STATE
  // ==========================================================================
  const [examSchedules, setExamSchedules] = useState<Record<ExamCategory, ExamReviewerSchedule>>(
    getExamSchedules()
  );
  const [activeExamTab, setActiveExamTab] = useState<ExamCategory>('Midterms');
  const [studyModeTopic, setStudyModeTopic] = useState<ExamTopicModule | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicSubject, setNewTopicSubject] = useState('NCM 112');

  const isFreePlan = user.tier === 'start';
  const canUploadMore = !isFreePlan || resources.length < FREE_RESOURCE_UPLOAD_LIMIT;

  // --------------------------------------------------------------------------
  // HANDLERS: SECTION 1 (RESOURCES & GOOGLE DRIVE)
  // --------------------------------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canUploadMore) {
      triggerToast('Free Starter plan is limited to 5 uploaded resources. Upgrade for unlimited storage!');
      onOpenSubscription('growth');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    let type: ResourceType = 'document';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) type = 'image';
    else if (['mp4', 'webm', 'mov'].includes(ext)) type = 'video';

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      const displayName = uploadTitle.trim() || file.name;
      const defaultSummary = generateSummaryFromResources([
        {
          id: 'temp',
          name: displayName,
          folder: uploadFolder,
          type,
          fileFormat: ext,
          url: '',
          uploadedAt: '',
          notes: uploadNotes.trim()
        }
      ]);
      const newRes: StudyResource = {
        id: `res-${Date.now()}`,
        name: displayName,
        folder: uploadFolder,
        type,
        fileFormat: ext,
        url: type === 'image' ? dataUrl : `#local-file-${file.name}`,
        sizeBytes: file.size,
        sizeLabel: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toISOString().slice(0, 10),
        notes: uploadNotes.trim() || `Uploaded ${ext.toUpperCase()} study resource in ${uploadFolder}.`,
        textContent: uploadNotes.trim() || defaultSummary
      };
      const updated = saveStudyResource(newRes);
      setResources(updated);
      setIsUploadModalOpen(false);
      setUploadTitle('');
      setUploadNotes('');
      triggerToast(`Uploaded "${newRes.name}" to ${uploadFolder}!`);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveWebOrVideoLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl.trim()) return;
    if (!canUploadMore) {
      triggerToast('Free Starter plan is limited to 5 resources. Upgrade to save unlimited materials!');
      onOpenSubscription('growth');
      return;
    }

    const lowerUrl = uploadUrl.toLowerCase();
    const isVideo =
      lowerUrl.includes('youtube.com') ||
      lowerUrl.includes('youtu.be') ||
      lowerUrl.includes('vimeo.com') ||
      lowerUrl.endsWith('.mp4');

    const newRes: StudyResource = {
      id: `res-link-${Date.now()}`,
      name: uploadTitle.trim() || uploadUrl.trim(),
      folder: uploadFolder,
      type: isVideo ? 'video' : 'link',
      fileFormat: lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be')
        ? 'youtube'
        : lowerUrl.includes('vimeo')
        ? 'vimeo'
        : 'url',
      url: uploadUrl.trim(),
      sizeLabel: isVideo ? 'Video Stream' : 'Web Link',
      uploadedAt: new Date().toISOString().slice(0, 10),
      notes: uploadNotes.trim() || 'Saved web reference link for nursing review.',
      textContent: uploadNotes.trim() || `${uploadTitle}: Key clinical takeaways and board review notes.`
    };

    const updated = saveStudyResource(newRes);
    setResources(updated);
    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadUrl('');
    setUploadNotes('');
    triggerToast(`Saved "${newRes.name}" to ${uploadFolder}!`);
  };

  const handleConnectGoogleDrive = async () => {
    setLoadingDrive(true);
    setGoogleDriveConnected(true);
    setDriveConnected(true);
    const files = await fetchGoogleDriveFiles();
    setDriveFiles(files);
    setLoadingDrive(false);
    triggerToast('Google Drive connected! Select files to import into your Study Lounge.');
  };

  const handleImportDriveFile = (df: { id: string; name: string; mimeType: string; webViewLink?: string }) => {
    if (!canUploadMore) {
      triggerToast('Free Starter plan is limited to 5 resources. Upgrade for unlimited Google Drive imports!');
      onOpenSubscription('growth');
      return;
    }

    const ext = df.name.split('.').pop()?.toLowerCase() || 'pdf';
    const newRes: StudyResource = {
      id: `res-gdrive-${Date.now()}`,
      name: df.name,
      folder: uploadFolder,
      type: 'drive',
      fileFormat: ext,
      url: df.webViewLink || 'https://drive.google.com',
      sizeLabel: 'Google Drive Sync',
      uploadedAt: new Date().toISOString().slice(0, 10),
      isFromDrive: true,
      driveFileId: df.id,
      notes: `Imported from Google Drive (${df.mimeType}) into ${uploadFolder}.`,
      textContent: `${df.name}: Imported Google Drive Nursing Study Guide — covers clinical assessment, priority nursing interventions, and board exam rationales.`
    };

    const updated = saveStudyResource(newRes);
    setResources(updated);
    triggerToast(`Imported "${df.name}" from Google Drive!`);
  };

  const handleConfirmRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingResource) return;
    const updated = renameStudyResource(renamingResource.id, renameText, renameFolder);
    setResources(updated);
    setRenamingResource(null);
    triggerToast('Resource updated!');
  };

  const handleConfirmDelete = () => {
    if (!deletingResource) return;
    const updated = deleteStudyResource(deletingResource.id);
    setResources(updated);
    setDeletingResource(null);
    triggerToast('Resource deleted.');
  };

  const filteredResources = resources.filter((r) => {
    const matchesFolder = selectedFolder === 'All' || r.folder === selectedFolder;
    const matchesSearch =
      !searchQuery.trim() ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.fileFormat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  // --------------------------------------------------------------------------
  // HANDLERS: SECTION 2 (QUIZ GENERATOR)
  // --------------------------------------------------------------------------
  const toggleQuizResourceSelection = (id: string) => {
    setSelectedQuizResIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleQuizQuestionType = (t: 'multiple_choice' | 'true_false' | 'identification') => {
    setQuizTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleCreateQuiz = () => {
    const selected = resources.filter((r) => selectedQuizResIds.includes(r.id));
    if (selected.length === 0) {
      triggerToast('Please select at least one uploaded study material first!');
      return;
    }
    const created = generateQuizFromResources(selected, quizCount, quizDifficulty, quizTypes);
    setQuizzes(getGeneratedQuizzes());
    setActiveQuiz(created);
    setQuizIdx(0);
    setUserQuizAnswers({});
    setIsQuizSubmitted(false);
    triggerToast(`Created ${created.questionCount}-item quiz!`);
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach((q) => {
      const ans = (userQuizAnswers[q.id] || '').trim().toLowerCase();
      const target = q.correctAnswer.trim().toLowerCase();
      if (ans && (ans === target || target.includes(ans) || ans.includes(target))) {
        correct += 1;
      }
    });
    const pct = Math.round((correct / activeQuiz.questions.length) * 100);
    const updated = saveQuizAttemptResult(activeQuiz.id, pct);
    setQuizzes(updated);
    setIsQuizSubmitted(true);
    triggerToast(`Quiz Completed! You scored ${pct}% (${correct}/${activeQuiz.questions.length})`);
  };

  // --------------------------------------------------------------------------
  // HANDLERS: SECTION 3 (FLASHCARD GENERATOR)
  // --------------------------------------------------------------------------
  const handleExtractFlashcards = () => {
    const target = resources.find((r) => r.id === sourceResForFc) || resources[0];
    if (!target) return;
    const updated = generateFlashcardsFromResource(target);
    setFlashcards(updated);
    setCurrentFcIdx(0);
    setIsFcFlipped(false);
    triggerToast(`Extracted flashcards from "${target.name}"!`);
  };

  const filteredFlashcards = flashcards.filter((c) => {
    if (fcFilterStatus === 'all') return true;
    return c.status === fcFilterStatus;
  });

  const activeFlashcard = filteredFlashcards[currentFcIdx] || filteredFlashcards[0];

  const handleShuffleFlashcards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentFcIdx(0);
    setIsFcFlipped(false);
    triggerToast('Flashcards shuffled!');
  };

  const handleMarkFlashcardStatus = (status: 'learned' | 'review_later') => {
    if (!activeFlashcard) return;
    const updated = saveOrUpdateLoungeFlashcard({ ...activeFlashcard, status });
    setFlashcards(updated);
    setIsFcFlipped(false);
    if (currentFcIdx + 1 < filteredFlashcards.length) {
      setCurrentFcIdx((prev) => prev + 1);
    }
  };

  const handleSaveFlashcardEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTerm.trim() || !editDef.trim()) return;
    const card: StudyFlashcard = editingCard
      ? { ...editingCard, term: editTerm.trim(), definition: editDef.trim() }
      : {
          id: `fc-custom-${Date.now()}`,
          deckId: 'custom',
          term: editTerm.trim(),
          definition: editDef.trim(),
          folder: 'Personal Notes',
          status: 'new',
          createdAt: new Date().toISOString().slice(0, 10),
          sourceTitle: 'Personal Custom Flashcard'
        };
    const updated = saveOrUpdateLoungeFlashcard(card);
    setFlashcards(updated);
    setEditingCard(null);
    setEditTerm('');
    setEditDef('');
    triggerToast('Flashcard saved!');
  };

  // --------------------------------------------------------------------------
  // HANDLERS: SECTION 4 (MNEMONICS GENERATOR)
  // --------------------------------------------------------------------------
  const handleGenerateMnemonic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mnemonicInput.trim()) return;
    const created = generateNursingMnemonic(mnemonicInput);
    setMnemonics(getNursingMnemonics());
    setMnemonicInput('');
    triggerToast(`Generated "${created.acronym}" mnemonic!`);
  };

  const handleShareMnemonic = (m: NursingMnemonic) => {
    const text = `NURSEPATH Mnemonic: ${m.acronym} (${m.title})\n` +
      m.expansion.map((e) => `• ${e.letter}: ${e.meaning}`).join('\n') +
      `\nTip: ${m.explanation}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 2500);
    triggerToast('Mnemonic copied to clipboard — ready to share with your study buddies!');
  };

  // --------------------------------------------------------------------------
  // HANDLERS: SECTION 5 (EXAM REVIEWER GENERATOR)
  // --------------------------------------------------------------------------
  const currentSchedule = examSchedules[activeExamTab];

  const getDaysRemaining = (dateStr: string): number => {
    const target = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleExamDateChange = (newDate: string) => {
    const next = updateExamSchedule(activeExamTab, (prev) => ({
      ...prev,
      examDate: newDate
    }));
    setExamSchedules(next);
    triggerToast(`${activeExamTab} date updated! Countdown recalculated.`);
  };

  const handleToggleLinkedResource = (resId: string) => {
    const next = updateExamSchedule(activeExamTab, (prev) => {
      const exists = prev.linkedResourceIds.includes(resId);
      return {
        ...prev,
        linkedResourceIds: exists
          ? prev.linkedResourceIds.filter((id) => id !== resId)
          : [...prev.linkedResourceIds, resId]
      };
    });
    setExamSchedules(next);
  };

  const handleToggleTopicDone = (topicId: string) => {
    const next = updateExamSchedule(activeExamTab, (prev) => ({
      ...prev,
      topics: prev.topics.map((t) => (t.id === topicId ? { ...t, completed: !t.completed } : t))
    }));
    setExamSchedules(next);
  };

  const handleToggleChecklist = (topicId: string, chkId: string) => {
    const next = updateExamSchedule(activeExamTab, (prev) => ({
      ...prev,
      topics: prev.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              highYieldChecklist: t.highYieldChecklist.map((c) =>
                c.id === chkId ? { ...c, done: !c.done } : c
              )
            }
          : t
      )
    }));
    setExamSchedules(next);
    if (studyModeTopic && studyModeTopic.id === topicId) {
      const updatedTopic = next[activeExamTab].topics.find((t) => t.id === topicId);
      if (updatedTopic) setStudyModeTopic(updatedTopic);
    }
  };

  const handleAddExamTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    const newMod: ExamTopicModule = {
      id: `top-custom-${Date.now()}`,
      title: newTopicTitle.trim(),
      subjectCode: newTopicSubject.trim() || 'BSN Core',
      completed: false,
      notesSummary: `Focused study session combining selected ${activeExamTab} resources.`,
      keyPoints: [
        'Prioritize patient safety, ABCs (Airway, Breathing, Circulation), and nursing process (ADPIE).',
        'Review high-alert drug antidotes and therapeutic lab ranges.'
      ],
      highYieldChecklist: [
        { id: `chk-${Date.now()}-1`, text: 'Read uploaded lecture notes & summarize key concepts', done: false },
        { id: `chk-${Date.now()}-2`, text: 'Complete 10 practice questions on this topic', done: false }
      ]
    };
    const next = updateExamSchedule(activeExamTab, (prev) => ({
      ...prev,
      topics: [...prev.topics, newMod]
    }));
    setExamSchedules(next);
    setNewTopicTitle('');
    triggerToast(`Added topic to ${activeExamTab} reviewer!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-teal-500 flex items-center space-x-2 text-xs font-bold animate-fadeIn">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Calm & Focused Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-teal-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-teal-500/20 text-teal-200 border border-teal-400/30 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Offline-Ready Study Suite • All Plans
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
            Your personal study space — upload, create, and master!
          </h2>
          <p className="text-xs text-teal-100/90">
            Organize your notes, generate custom board quizzes &amp; flashcards, create mnemonics, and track exam countdowns even without Wi-Fi.
          </p>
        </div>

        {/* Quick Stats Pill & Upgrade Plan Button */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="bg-white/10 px-3 py-2 rounded-2xl border border-white/15 text-center">
            <span className="block text-sm font-black text-amber-300">{resources.length}</span>
            <span className="text-[10px] text-teal-100">Saved Files</span>
          </div>
          <div className="bg-white/10 px-3 py-2 rounded-2xl border border-white/15 text-center">
            <span className="block text-sm font-black text-emerald-300">{flashcards.length}</span>
            <span className="text-[10px] text-teal-100">Flashcards</span>
          </div>
          <div className="bg-white/10 px-3 py-2 rounded-2xl border border-white/15 text-center">
            <span className="block text-sm font-black text-sky-300">{mnemonics.length}</span>
            <span className="text-[10px] text-teal-100">Mnemonics</span>
          </div>
          <button
            onClick={() => onOpenSubscription(user.tier === 'start' ? 'growth' : 'ready')}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>{user.tier === 'lifetime' ? 'VIP Plan Active' : 'Upgrade Plan'}</span>
          </button>
        </div>
      </div>

      {/* Free Starter Pass Limit & Live Reset Timer Indicator */}
      {isFreePlan && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-black text-amber-950">
                Starter Pass: {resources.length}/{FREE_RESOURCE_UPLOAD_LIMIT} resources used
              </span>
              <span className="text-amber-800 ml-1.5">
                • Free daily limits reset in: <strong className="text-amber-950 font-bold">{getDailyLimitResetHours().label}</strong> (00:00 midnight)
              </span>
            </div>
          </div>
          <button
            onClick={() => onOpenSubscription('growth')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-[11px] self-start sm:self-auto cursor-pointer shrink-0 transition shadow-2xs"
          >
            Upgrade for Unlimited Uploads (₱69) →
          </button>
        </div>
      )}

      {/* 6 Study Tool Selector Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setActiveTool('resources')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
            activeTool === 'resources'
              ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50/50'
          }`}
        >
          <FolderOpen className={`w-5 h-5 shrink-0 ${activeTool === 'resources' ? 'text-amber-300' : 'text-teal-600'}`} />
          <div>
            <div className="text-xs font-black leading-tight">1. Upload &amp; Save</div>
            <div className={`text-[10px] ${activeTool === 'resources' ? 'text-teal-100' : 'text-slate-400'}`}>
              Docs, Links &amp; Drive
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTool('summary')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
            activeTool === 'summary'
              ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50/50'
          }`}
        >
          <BookOpen className={`w-5 h-5 shrink-0 ${activeTool === 'summary' ? 'text-amber-300' : 'text-teal-600'}`} />
          <div>
            <div className="text-xs font-black leading-tight">2. Summary</div>
            <div className={`text-[10px] ${activeTool === 'summary' ? 'text-teal-100' : 'text-slate-400'}`}>
              Executive Notes
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTool('quiz_gen')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
            activeTool === 'quiz_gen'
              ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50/50'
          }`}
        >
          <Brain className={`w-5 h-5 shrink-0 ${activeTool === 'quiz_gen' ? 'text-amber-300' : 'text-teal-600'}`} />
          <div>
            <div className="text-xs font-black leading-tight">3. Quiz Generator</div>
            <div className={`text-[10px] ${activeTool === 'quiz_gen' ? 'text-teal-100' : 'text-slate-400'}`}>
              10, 25, 50 Items
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTool('flashcards')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
            activeTool === 'flashcards'
              ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50/50'
          }`}
        >
          <Layers className={`w-5 h-5 shrink-0 ${activeTool === 'flashcards' ? 'text-amber-300' : 'text-teal-600'}`} />
          <div>
            <div className="text-xs font-black leading-tight">4. Flashcards</div>
            <div className={`text-[10px] ${activeTool === 'flashcards' ? 'text-teal-100' : 'text-slate-400'}`}>
              Extract &amp; Flip
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTool('mnemonics')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
            activeTool === 'mnemonics'
              ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50/50'
          }`}
        >
          <Sparkles className={`w-5 h-5 shrink-0 ${activeTool === 'mnemonics' ? 'text-amber-300' : 'text-teal-600'}`} />
          <div>
            <div className="text-xs font-black leading-tight">5. Mnemonics</div>
            <div className={`text-[10px] ${activeTool === 'mnemonics' ? 'text-teal-100' : 'text-slate-400'}`}>
              AI Memory Aids
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTool('exam_reviewer')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
            activeTool === 'exam_reviewer'
              ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-teal-50/50'
          }`}
        >
          <Calendar className={`w-5 h-5 shrink-0 ${activeTool === 'exam_reviewer' ? 'text-amber-300' : 'text-teal-600'}`} />
          <div>
            <div className="text-xs font-black leading-tight">6. Exam Reviewer</div>
            <div className={`text-[10px] ${activeTool === 'exam_reviewer' ? 'text-teal-100' : 'text-slate-400'}`}>
              Countdown &amp; Study Mode
            </div>
          </div>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TOOL 1: UPLOAD & SAVE RESOURCES */}
      {/* ==================================================================== */}
      {activeTool === 'resources' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-teal-600" />
                <span>📂 Upload &amp; Save Study Resources</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Supports PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), JPG/PNG images, MP4/YouTube/Vimeo videos, Web URLs &amp; Google Drive.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenSubscription('growth')}
                className="text-[11px] font-black bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl cursor-pointer transition flex items-center space-x-1"
              >
                <span>
                  {isFreePlan
                    ? `Free Plan (${resources.length}/${FREE_RESOURCE_UPLOAD_LIMIT} Uploads) • Upgrade Plan`
                    : `⚡ Upgrade / Switch Plan`}
                </span>
              </button>
              <button
                onClick={() => {
                  setUploadTab('drive');
                  setIsUploadModalOpen(true);
                  if (!driveConnected) handleConnectGoogleDrive();
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <HardDrive className="w-4 h-4 text-teal-600" />
                <span>Google Drive</span>
              </button>
              <button
                onClick={() => {
                  setUploadTab('file');
                  setIsUploadModalOpen(true);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-300" />
                <span>+ Upload New Material</span>
              </button>
            </div>
          </div>

          {/* Folder Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', ...FOLDERS] as const).map((folder) => {
                const count =
                  folder === 'All'
                    ? resources.length
                    : resources.filter((r) => r.folder === folder).length;
                return (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                      selectedFolder === folder
                        ? 'bg-teal-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{folder}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedFolder === folder ? 'bg-teal-900 text-teal-200' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search uploaded files, formats..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Uploaded Resources Grid */}
          {filteredResources.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No study materials found in this folder.</p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="text-xs font-black text-teal-700 hover:underline cursor-pointer"
              >
                + Upload your first resource
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredResources.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500/60 bg-slate-50/40 hover:bg-white transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 font-black text-xs uppercase">
                      {res.type === 'image' ? (
                        <ImageIcon className="w-5 h-5 text-emerald-600" />
                      ) : res.type === 'video' ? (
                        <Video className="w-5 h-5 text-rose-600" />
                      ) : res.type === 'link' ? (
                        <LinkIcon className="w-5 h-5 text-sky-600" />
                      ) : res.type === 'drive' ? (
                        <HardDrive className="w-5 h-5 text-indigo-600" />
                      ) : (
                        res.fileFormat.slice(0, 4)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                          {res.folder}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          {res.fileFormat}
                        </span>
                        {res.sizeLabel && (
                          <span className="text-[10px] text-slate-400">{res.sizeLabel}</span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-1 truncate" title={res.name}>
                        {res.name}
                      </h4>
                      {res.notes && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{res.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70 text-xs">
                    <span className="text-[10px] text-slate-400">Added {res.uploadedAt}</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => setPreviewResource(res)}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSummaryResIds([res.id]);
                          setGeneratedSummary(generateSummaryFromResources([res]));
                          setActiveTool('summary');
                        }}
                        className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                        title="Generate Executive Summary from this file"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Summary</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuizResIds([res.id]);
                          setActiveTool('quiz_gen');
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                        title="Generate Quiz from this file"
                      >
                        <Brain className="w-3 h-3" />
                        <span>Quiz</span>
                      </button>
                      <button
                        onClick={() => {
                          setRenamingResource(res);
                          setRenameText(res.name);
                          setRenameFolder(res.folder);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        title="Rename or move folder"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingResource(res)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOOL 2: EXECUTIVE SUMMARY & STUDY GUIDE GENERATOR */}
      {/* ==================================================================== */}
      {activeTool === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <span>📋 Generate Summary from Material</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select one or more uploaded files to synthesize an Executive Clinical Summary, ADPIE Nursing Priorities, and Red Flag Alerts.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 block">
                Select Uploaded Study Materials ({selectedSummaryResIds.length} selected)
              </label>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {resources.map((r) => {
                  const checked = selectedSummaryResIds.includes(r.id);
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        setSelectedSummaryResIds((prev) =>
                          prev.includes(r.id) ? prev.filter((id) => id !== r.id) : [...prev, r.id]
                        );
                      }}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                        checked
                          ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate pr-2">{r.name}</span>
                      <span
                        className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                          checked ? 'bg-teal-600 text-white' : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" />}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                const chosen = resources.filter((r) => selectedSummaryResIds.includes(r.id));
                const listToUse = chosen.length > 0 ? chosen : resources.slice(0, 1);
                setGeneratedSummary(generateSummaryFromResources(listToUse));
                triggerToast('Clinical Executive Summary synthesized!');
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-black text-xs shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Synthesize Clinical Summary</span>
            </button>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 block">
                Continue Studying with Selected Material:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (selectedSummaryResIds.length > 0) {
                      setSelectedQuizResIds(selectedSummaryResIds);
                    }
                    setActiveTool('quiz_gen');
                  }}
                  className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Create Quiz</span>
                </button>
                <button
                  onClick={() => {
                    if (selectedSummaryResIds[0]) {
                      setSourceResForFc(selectedSummaryResIds[0]);
                    }
                    setActiveTool('flashcards');
                  }}
                  className="py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-bold text-xs cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Make Flashcards</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-teal-700" />
                <h4 className="font-black text-slate-900 text-sm sm:text-base">
                  Executive Clinical Summary &amp; High-Yield Study Guide
                </h4>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(generatedSummary);
                  setCopiedSummary(true);
                  setTimeout(() => setCopiedSummary(false), 2000);
                  triggerToast('Summary copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{copiedSummary ? 'Copied! ✓' : 'Copy Summary'}</span>
              </button>
            </div>

            <div className="prose prose-sm max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-200/80">
              {generatedSummary}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOOL 2: QUIZ GENERATOR */}
      {/* ==================================================================== */}
      {activeTool === 'quiz_gen' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quiz Configuration Panel */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-teal-600" />
                <span>🧠 Generate Quiz from Material</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select one or more uploaded files and customize your question count &amp; difficulty.
              </p>
            </div>

            {/* 1. Select Uploaded Files */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 block">
                1. Select Uploaded Study Materials ({selectedQuizResIds.length} selected)
              </label>
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                {resources.map((r) => {
                  const checked = selectedQuizResIds.includes(r.id);
                  return (
                    <div
                      key={r.id}
                      onClick={() => toggleQuizResourceSelection(r.id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2.5 cursor-pointer transition ${
                        checked
                          ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="rounded text-teal-600"
                      />
                      <span className="truncate flex-1">{r.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        {r.folder}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Question Types */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 block">
                2. Question Formats
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'multiple_choice', label: 'Multiple Choice' },
                  { id: 'true_false', label: 'True / False' },
                  { id: 'identification', label: 'Identification' }
                ].map((qt) => {
                  const active = quizTypes.includes(qt.id as any);
                  return (
                    <button
                      key={qt.id}
                      type="button"
                      onClick={() => toggleQuizQuestionType(qt.id as any)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                        active
                          ? 'bg-teal-700 text-white border-teal-800'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {qt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Number of Questions (10, 25, 50) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 block">
                3. Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([10, 25, 50] as const).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuizCount(num)}
                    className={`py-2 rounded-xl text-xs font-black border transition cursor-pointer ${
                      quizCount === num
                        ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num} Items
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Difficulty Level */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 block">
                4. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'easy', label: 'Easy Recall' },
                  { id: 'moderate', label: 'Moderate' },
                  { id: 'board_mastery', label: 'Board Exam' }
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setQuizDifficulty(d.id as QuizDifficulty)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                      quizDifficulty === d.id
                        ? 'bg-teal-700 text-white border-teal-800'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateQuiz}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-sm transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create Quiz Now</span>
            </button>

            {/* Saved Quizzes Progress List */}
            {quizzes.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Saved Quizzes &amp; Best Scores
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {quizzes.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => {
                        setActiveQuiz(q);
                        setQuizIdx(0);
                        setUserQuizAnswers({});
                        setIsQuizSubmitted(false);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-slate-900 truncate">{q.title}</div>
                        <div className="text-[10px] text-slate-500">
                          {q.questionCount} Qs • {q.difficulty.toUpperCase()}
                        </div>
                      </div>
                      {q.bestScore !== undefined ? (
                        <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs shrink-0">
                          Best: {q.bestScore}%
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-teal-700 shrink-0">Start ➔</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Quiz Runner Area */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            {!activeQuiz ? (
              <div className="my-auto text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                  <Brain className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Ready to Test Your Mastery?</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Select your uploaded notes on the left and click <strong>&quot;Create Quiz Now&quot;</strong> to auto-generate Multiple Choice, True/False, and Identification questions.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {activeQuiz.difficulty.replace('_', ' ')} • {activeQuiz.questions.length} Questions
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                      {activeQuiz.title}
                    </h4>
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    Question {quizIdx + 1} of {activeQuiz.questions.length}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full transition-all"
                    style={{ width: `${((quizIdx + 1) / activeQuiz.questions.length) * 100}%` }}
                  />
                </div>

                {/* Current Question Card */}
                {(() => {
                  const q = activeQuiz.questions[quizIdx];
                  const userAnswer = userQuizAnswers[q.id] || '';
                  return (
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          {q.type.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                        {q.question}
                      </p>

                      {q.type === 'identification' ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            disabled={isQuizSubmitted}
                            value={userAnswer}
                            onChange={(e) =>
                              setUserQuizAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            placeholder="Type your answer here..."
                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold focus:outline-none focus:border-teal-600"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {(q.options || ['True', 'False']).map((opt, idx) => {
                            const isSelected = userAnswer === opt;
                            const isCorrectOpt = opt === q.correctAnswer;
                            let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-teal-50/40';
                            if (isSelected) {
                              btnStyle = 'bg-teal-700 text-white border-teal-800 font-bold';
                            }
                            if (isQuizSubmitted) {
                              if (isCorrectOpt) {
                                btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black';
                              } else if (isSelected && !isCorrectOpt) {
                                btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 line-through';
                              }
                            }
                            return (
                              <button
                                key={idx}
                                type="button"
                                disabled={isQuizSubmitted}
                                onClick={() =>
                                  setUserQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))
                                }
                                className={`p-3 rounded-xl border text-left text-xs transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {isQuizSubmitted && isCorrectOpt && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {isQuizSubmitted && (
                        <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-1">
                          <div className="font-black text-teal-900">
                            Correct Answer: {q.correctAnswer}
                          </div>
                          <p className="text-teal-800 leading-relaxed">{q.rationale}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Navigation & Submit Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={quizIdx === 0}
                    onClick={() => setQuizIdx((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center space-x-2">
                    {quizIdx + 1 < activeQuiz.questions.length ? (
                      <button
                        type="button"
                        onClick={() => setQuizIdx((prev) => prev + 1)}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black cursor-pointer"
                      >
                        Next Question →
                      </button>
                    ) : !isQuizSubmitted ? (
                      <button
                        type="button"
                        onClick={handleFinishQuiz}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xs cursor-pointer"
                      >
                        Submit &amp; Save Score 🏆
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setQuizIdx(0);
                          setUserQuizAnswers({});
                          setIsQuizSubmitted(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-black cursor-pointer"
                      >
                        Retake Quiz
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOOL 3: FLASHCARD GENERATOR */}
      {/* ==================================================================== */}
      {activeTool === 'flashcards' && (
        <div className="space-y-6">
          {/* Top Generator Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Layers className="w-5 h-5 text-teal-600" />
                <span>🃏 Make Flashcards from My Notes</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Auto-extract key terms &amp; definitions from uploaded documents, or create/edit cards manually.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sourceResForFc}
                onChange={(e) => setSourceResForFc(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
              >
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name.slice(0, 38)}
                  </option>
                ))}
              </select>
              <button
                onClick={handleExtractFlashcards}
                className="bg-teal-600 hover:bg-teal-700 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Extract Flashcards</span>
              </button>
              <button
                onClick={() => {
                  setEditingCard(null);
                  setEditTerm('');
                  setEditDef('');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer"
              >
                + New Card
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Flip Card Viewer */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  {[
                    { id: 'all', label: `All (${flashcards.length})` },
                    {
                      id: 'learned',
                      label: `Learned (${flashcards.filter((f) => f.status === 'learned').length})`
                    },
                    {
                      id: 'review_later',
                      label: `Review Later (${
                        flashcards.filter((f) => f.status === 'review_later').length
                      })`
                    }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setFcFilterStatus(tab.id as any);
                        setCurrentFcIdx(0);
                        setIsFcFlipped(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        fcFilterStatus === tab.id
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleShuffleFlashcards}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle Cards</span>
                </button>
              </div>

              {activeFlashcard ? (
                <div className="space-y-4">
                  <div
                    onClick={() => setIsFcFlipped(!isFcFlipped)}
                    className={`min-h-[220px] p-6 sm:p-8 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                      isFcFlipped
                        ? 'bg-teal-900 text-white border-teal-600 shadow-lg'
                        : 'bg-gradient-to-br from-slate-50 to-teal-50/40 text-slate-900 border-teal-200 hover:border-teal-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span
                        className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isFcFlipped
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {isFcFlipped ? 'BACK • DEFINITION / EXPLANATION' : 'FRONT • KEY CLINICAL TERM'}
                      </span>
                      <span className="opacity-75">
                        Card {currentFcIdx + 1} of {filteredFlashcards.length}
                      </span>
                    </div>

                    <div className="my-auto py-6 text-center">
                      <p
                        className={`font-black leading-snug ${
                          isFcFlipped ? 'text-sm sm:text-base text-teal-50' : 'text-lg sm:text-2xl'
                        }`}
                      >
                        {isFcFlipped ? activeFlashcard.definition : activeFlashcard.term}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] opacity-75">
                      <span>Source: {activeFlashcard.sourceTitle || 'Personal Notes'}</span>
                      <span>Click card to flip ↻</span>
                    </div>
                  </div>

                  {/* Card Controls: Prev, Mark Learned, Review Later, Next */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setIsFcFlipped(false);
                          setCurrentFcIdx((prev) =>
                            prev > 0 ? prev - 1 : filteredFlashcards.length - 1
                          );
                        }}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsFcFlipped(false);
                          setCurrentFcIdx((prev) => (prev + 1) % filteredFlashcards.length);
                        }}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingCard(activeFlashcard);
                          setEditTerm(activeFlashcard.term);
                          setEditDef(activeFlashcard.definition);
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMarkFlashcardStatus('review_later')}
                        className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs cursor-pointer"
                      >
                        ⏳ Review Later
                      </button>
                      <button
                        onClick={() => handleMarkFlashcardStatus('learned')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center space-x-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Learned</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-slate-500">
                  No flashcards in this filter view.
                </div>
              )}
            </div>

            {/* Manual Card Editor / Creator */}
            <form
              onSubmit={handleSaveFlashcardEdit}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
            >
              <h4 className="text-sm font-black text-slate-900">
                {editingCard ? '✏️ Edit Flashcard' : '➕ Create Custom Flashcard'}
              </h4>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Front (Term / Drug / Concept)
                </label>
                <input
                  type="text"
                  required
                  value={editTerm}
                  onChange={(e) => setEditTerm(e.target.value)}
                  placeholder="e.g., Protamine Sulfate"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Back (Definition / Nursing Consideration)
                </label>
                <textarea
                  rows={4}
                  required
                  value={editDef}
                  onChange={(e) => setEditDef(e.target.value)}
                  placeholder="Enter clinical explanation or board tip..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  {editingCard ? 'Update Flashcard' : 'Save Flashcard'}
                </button>
                {editingCard && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCard(null);
                      setEditTerm('');
                      setEditDef('');
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOOL 4: MNEMONICS GENERATOR */}
      {/* ==================================================================== */}
      {activeTool === 'mnemonics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <span>✍️ Nursing Mnemonics Generator</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter any nursing topic or keyword (e.g., &quot;Cancer Warning Signs&quot;, &quot;Lithium Toxicity&quot;, &quot;Cranial Nerves&quot;, &quot;Heart Failure&quot;) to generate easy-to-remember clinical mnemonics!
              </p>
            </div>

            <form onSubmit={handleGenerateMnemonic} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={mnemonicInput}
                onChange={(e) => setMnemonicInput(e.target.value)}
                placeholder="Enter nursing topic or keywords (e.g. Lithium Toxicity, Oncology CAUTION, Cranial Nerves)..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-teal-600"
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-black px-5 py-2.5 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Create Mnemonic</span>
              </button>
            </form>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMnemonicFilterFav(false)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                    !mnemonicFilterFav ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  All Mnemonics ({mnemonics.length})
                </button>
                <button
                  onClick={() => setMnemonicFilterFav(true)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer ${
                    mnemonicFilterFav ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Favorites ({mnemonics.filter((m) => m.isFavorite).length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mnemonics Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mnemonics
              .filter((m) => !mnemonicFilterFav || m.isFavorite)
              .map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                          {m.category}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-1">{m.title}</h4>
                      </div>
                      <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-teal-700 to-slate-900 text-amber-300 font-mono font-black text-sm tracking-widest">
                        {m.acronym}
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                      {m.expansion.map((row, idx) => (
                        <div key={idx} className="flex items-start space-x-2.5 text-xs">
                          <span className="w-6 h-6 rounded-lg bg-teal-700 text-white font-black flex items-center justify-center shrink-0 text-[11px]">
                            {row.letter}
                          </span>
                          <div className="flex-1">
                            <span className="font-bold text-slate-900">{row.meaning}</span>
                            {row.clinicalTip && (
                              <span className="block text-[11px] text-slate-500">{row.clinicalTip}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-teal-900 bg-teal-50/70 px-3 py-2 rounded-xl border border-teal-200/60 font-medium">
                      💡 <strong>Board Tip:</strong> {m.explanation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setMnemonics(toggleMnemonicFavorite(m.id))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer ${
                        m.isFavorite
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${m.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{m.isFavorite ? 'Favorited' : 'Save Favorite'}</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleShareMnemonic(m)}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setMnemonics(deleteMnemonic(m.id))}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TOOL 5: EXAM REVIEWER GENERATOR SECTION */}
      {/* ==================================================================== */}
      {activeTool === 'exam_reviewer' && (
        <div className="space-y-6">
          {/* Exam Category Tabs: Midterms, Finals, Board Exams */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'Midterms', icon: '📝', label: 'Midterms Reviewer' },
                { id: 'Finals', icon: '📋', label: 'Finals Reviewer' },
                { id: 'Board Exams', icon: '🎯', label: 'Board Exams (PNLE / NCLEX)' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveExamTab(tab.id);
                  setStudyModeTopic(null);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition flex items-center space-x-2 cursor-pointer ${
                  activeExamTab === tab.id
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Countdown Header + Progress Tracker */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                {activeExamTab} Master Study Session
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {currentSchedule.targetName}
              </h3>
              <p className="text-xs text-slate-500">{currentSchedule.studyNotes}</p>

              {/* Progress Bar */}
              <div className="pt-2 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Review Progress Tracker</span>
                  <span className="text-teal-700 font-black">{currentSchedule.progressPercent}% Complete</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-600 to-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${currentSchedule.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Countdown Timer & Date Picker */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 text-center space-y-2">
              <div className="flex items-center justify-center space-x-1.5 text-amber-300 text-xs font-bold">
                <Clock className="w-4 h-4" />
                <span>Exam Countdown Timer</span>
              </div>
              <div className="text-3xl font-black font-mono text-white">
                {getDaysRemaining(currentSchedule.examDate)}{' '}
                <span className="text-sm font-sans font-bold text-teal-300">Days Left</span>
              </div>
              <div className="pt-1">
                <label className="text-[10px] text-slate-400 block mb-1">Set Target Exam Date:</label>
                <input
                  type="date"
                  value={currentSchedule.examDate}
                  onChange={(e) => handleExamDateChange(e.target.value)}
                  className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>
          </div>

          {/* Focused "Study Mode" View vs Overview Mode */}
          {studyModeTopic ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-teal-600 shadow-lg space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                    🎯 Focused Study Mode — One Topic at a Time
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1.5">
                    {studyModeTopic.title}
                  </h4>
                  <span className="text-xs text-teal-700 font-bold">{studyModeTopic.subjectCode}</span>
                </div>
                <button
                  onClick={() => setStudyModeTopic(null)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Exit Study Mode ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                <div className="text-xs font-black text-teal-950">Topic Overview &amp; Synthesis:</div>
                <p className="text-xs text-teal-900 leading-relaxed">{studyModeTopic.notesSummary}</p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-black text-slate-900">High-Yield Board Pearls:</div>
                <ul className="space-y-2">
                  {studyModeTopic.keyPoints.map((pt, i) => (
                    <li
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start space-x-2"
                    >
                      <span className="text-teal-600 font-black">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-black text-slate-900">Action Checklist:</div>
                <div className="space-y-1.5">
                  {studyModeTopic.highYieldChecklist.map((chk) => (
                    <label
                      key={chk.id}
                      className="p-3 rounded-xl border border-slate-200 flex items-center space-x-3 cursor-pointer hover:bg-slate-50 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={chk.done}
                        onChange={() => handleToggleChecklist(studyModeTopic.id, chk.id)}
                        className="rounded text-teal-600"
                      />
                      <span className={chk.done ? 'line-through text-slate-400' : 'font-bold text-slate-800'}>
                        {chk.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Topic Modules & Study Mode Launcher */}
              <div className="lg:col-span-2 space-y-4">
                {currentSchedule.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={topic.completed}
                          onChange={() => handleToggleTopicDone(topic.id)}
                          className="mt-1 w-4 h-4 rounded text-teal-600 cursor-pointer"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                            {topic.subjectCode}
                          </span>
                          <h4
                            className={`text-sm font-black mt-0.5 ${
                              topic.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {topic.title}
                          </h4>
                        </div>
                      </div>

                      <button
                        onClick={() => setStudyModeTopic(topic)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shrink-0 self-start"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Enter Study Mode</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 pl-7">{topic.notesSummary}</p>

                    <div className="pl-7 space-y-1.5">
                      {topic.highYieldChecklist.map((chk) => (
                        <div
                          key={chk.id}
                          onClick={() => handleToggleChecklist(topic.id, chk.id)}
                          className="flex items-center space-x-2 text-xs cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={chk.done}
                            onChange={() => {}}
                            className="rounded text-teal-600"
                          />
                          <span className={chk.done ? 'line-through text-slate-400' : 'text-slate-700'}>
                            {chk.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Add Topic Form */}
                <form
                  onSubmit={handleAddExamTopic}
                  className="bg-white rounded-3xl p-4 border border-slate-200 flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    value={newTopicSubject}
                    onChange={(e) => setNewTopicSubject(e.target.value)}
                    placeholder="Subject Code (e.g. NCM 112)"
                    className="sm:w-36 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder={`Add a new study topic to ${activeExamTab}...`}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                  <button
                    type="submit"
                    className="bg-teal-700 hover:bg-teal-800 text-white font-black px-4 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    + Add Topic
                  </button>
                </form>
              </div>

              {/* Combine Multiple Uploaded Resources into this Session */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Combined Study Session Files ({currentSchedule.linkedResourceIds.length})
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select multiple uploaded resources to bundle into your {activeExamTab} review session:
                  </p>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {resources.map((r) => {
                    const isLinked = currentSchedule.linkedResourceIds.includes(r.id);
                    return (
                      <div
                        key={r.id}
                        onClick={() => handleToggleLinkedResource(r.id)}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition ${
                          isLinked
                            ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="truncate">{r.name}</div>
                          <span className="text-[10px] text-slate-400">{r.folder}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isLinked}
                          onChange={() => {}}
                          className="rounded text-teal-600"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: UPLOAD NEW MATERIAL / WEB LINK / GOOGLE DRIVE */}
      {/* ==================================================================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Upload &amp; Save Study Material</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Source Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setUploadTab('file')}
                className={`py-2 rounded-xl text-xs font-black cursor-pointer ${
                  uploadTab === 'file' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                📄 Local File
              </button>
              <button
                type="button"
                onClick={() => setUploadTab('link')}
                className={`py-2 rounded-xl text-xs font-black cursor-pointer ${
                  uploadTab === 'link' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                🔗 Video / URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadTab('drive');
                  if (!driveConnected) handleConnectGoogleDrive();
                }}
                className={`py-2 rounded-xl text-xs font-black cursor-pointer ${
                  uploadTab === 'drive' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                ☁️ Google Drive
              </button>
            </div>

            {/* Target Folder Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Organize into Folder:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {FOLDERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setUploadFolder(f)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border cursor-pointer ${
                      uploadFolder === f
                        ? 'bg-teal-700 text-white border-teal-800'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {uploadTab === 'file' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Optional Custom Title..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Paste key notes or summary text to help generate quizzes & flashcards..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-teal-300 hover:border-teal-600 bg-teal-50/40 rounded-2xl p-6 text-center cursor-pointer transition space-y-2"
                >
                  <Upload className="w-7 h-7 text-teal-600 mx-auto" />
                  <div className="text-xs font-black text-slate-800">
                    Click to Choose File (PDF, DOCX, PPTX, XLSX, JPG, PNG, MP4)
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Saved directly for instant offline study access
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.mp4"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {uploadTab === 'link' && (
              <form onSubmit={handleSaveWebOrVideoLink} className="space-y-3">
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Resource Title (e.g., Osmosis ABG Interpretation Video)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                />
                <input
                  type="url"
                  required
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or any website URL"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Key study takeaways from this video or website..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Save Video / Web Link
                </button>
              </form>
            )}

            {uploadTab === 'drive' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-teal-50 p-3 rounded-xl border border-teal-200">
                  <div className="flex items-center space-x-2 text-xs font-bold text-teal-900">
                    <HardDrive className="w-4 h-4 text-teal-600" />
                    <span>Google Drive Integration Active</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleConnectGoogleDrive}
                    className="text-[11px] font-black text-teal-700 hover:underline cursor-pointer"
                  >
                    Refresh Files
                  </button>
                </div>

                {loadingDrive ? (
                  <div className="text-center py-6 text-xs text-slate-500">
                    Loading Google Drive files...
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {driveFiles.map((df) => (
                      <div
                        key={df.id}
                        className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-slate-50"
                      >
                        <div className="truncate pr-2">
                          <div className="font-bold text-slate-900 truncate">{df.name}</div>
                          <div className="text-[10px] text-slate-400">Modified {df.modifiedTime}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleImportDriveFile(df)}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-black text-[11px] shrink-0 cursor-pointer"
                        >
                          Import
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: IN-APP FILE PREVIEW */}
      {/* ==================================================================== */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                  {previewResource.folder} • {previewResource.fileFormat.toUpperCase()}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{previewResource.name}</h3>
              </div>
              <button
                onClick={() => setPreviewResource(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {previewResource.type === 'image' && previewResource.url.startsWith('data:image') && (
                <img
                  src={previewResource.url}
                  alt={previewResource.name}
                  className="max-h-80 mx-auto rounded-2xl border border-slate-200 object-contain"
                />
              )}

              {(previewResource.type === 'link' || previewResource.type === 'video') &&
                previewResource.url.startsWith('http') && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                    <span className="text-xs truncate mr-3">{previewResource.url}</span>
                    <a
                      href={previewResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-teal-500 text-slate-950 font-black text-xs shrink-0"
                    >
                      Open External Link ↗
                    </a>
                  </div>
                )}

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-black text-slate-800">
                  📄 In-App Document Content &amp; Study Synthesis:
                </div>
                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {previewResource.textContent || previewResource.notes}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedQuizResIds([previewResource.id]);
                  setPreviewResource(null);
                  setActiveTool('quiz_gen');
                }}
                className="px-3.5 py-2 rounded-xl bg-teal-600 text-white font-black text-xs cursor-pointer"
              >
                Generate Quiz from This File
              </button>
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: RENAME / MOVE RESOURCE */}
      {/* ==================================================================== */}
      {renamingResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmRename}
            className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-4"
          >
            <h4 className="text-sm font-black text-slate-900">Rename or Move Resource</h4>
            <input
              type="text"
              required
              value={renameText}
              onChange={(e) => setRenameText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
            />
            <select
              value={renameFolder}
              onChange={(e) => setRenameFolder(e.target.value as ResourceFolder)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
            >
              {FOLDERS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setRenamingResource(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-black cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ==================================================================== */}
      {deletingResource && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h4 className="text-sm font-black text-slate-900">Delete Study Resource?</h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete <strong>&quot;{deletingResource.name}&quot;</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setDeletingResource(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

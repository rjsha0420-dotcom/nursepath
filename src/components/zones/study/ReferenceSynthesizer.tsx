import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Copy, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown, 
  Brain, 
  Zap, 
  Layers, 
  RotateCcw,
  Check,
  FileSpreadsheet,
  SlidersHorizontal,
  BookmarkCheck,
  Search,
  BookOpen,
  Filter,
  Download
} from 'lucide-react';
import { ReferenceMaterial, GeneratedQuizItem, Flashcard, MindMapNode, MnemonicItem, SubscriptionTierId } from '../../../types';
import { synthesizeReferenceMaterial, generateReferenceQuiz, generateReferenceFlashcards } from '../../../services/aiService';
import {
  sanitizeClinicalText,
  generateGroundedSummary,
  generateGroundedQuiz,
  generateGroundedFlashcards,
  generateGroundedMnemonics,
  generateGroundedMindMap
} from '../../../services/referenceSynthesisEngine';
import { getSavedReferences, saveReferenceMaterial, deleteReferenceMaterial, getFlashcards, saveFlashcards, FREE_UPLOAD_LIMIT } from '../../../services/storageService';
import { calculateSM2 } from '../../../services/sm2Algorithm';

interface ReferenceSynthesizerProps {
  onFlashcardsImported?: () => void;
  userTier?: SubscriptionTierId;
  onOpenSubscription?: (tier?: SubscriptionTierId) => void;
}

export const ReferenceSynthesizer: React.FC<ReferenceSynthesizerProps> = ({ 
  onFlashcardsImported,
  userTier = 'growth',
  onOpenSubscription
}) => {
  const [savedReferences, setSavedReferences] = useState<ReferenceMaterial[]>(getSavedReferences());
  const [selectedReference, setSelectedReference] = useState<ReferenceMaterial>(savedReferences[0]);
  const [outputTab, setOutputTab] = useState<'summary' | 'quiz' | 'flashcards' | 'mindmap' | 'mnemonics'>('summary');
  
  // Upload modal / form state
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadLimitModalOpen, setIsUploadLimitModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [uploadFileType, setUploadFileType] = useState<'pdf' | 'word' | 'image' | 'video' | 'text'>('pdf');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [importedNotice, setImportedNotice] = useState(false);

  // User selectable quantities during upload (max 150)
  const [uploadQuizCount, setUploadQuizCount] = useState<number>(15);
  const [uploadFlashcardCount, setUploadFlashcardCount] = useState<number>(15);

  // In-tab Customizers (max 150)
  const [customQuizCount, setCustomQuizCount] = useState<number>(15);
  const [isGeneratingCustomQuiz, setIsGeneratingCustomQuiz] = useState<boolean>(false);

  const [customFlashcardCount, setCustomFlashcardCount] = useState<number>(15);
  const [isGeneratingCustomFlashcards, setIsGeneratingCustomFlashcards] = useState<boolean>(false);

  // Interactive Quiz state within this reference
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizRationales, setShowQuizRationales] = useState<Record<string, boolean>>({});
  const [quizFilter, setQuizFilter] = useState<'all' | 'unanswered' | 'correct' | 'incorrect'>('all');
  const [quizPage, setQuizPage] = useState<number>(1);
  const [quizPageSize, setQuizPageSize] = useState<number>(10);

  // Flashcards state
  const [flashcardViewMode, setFlashcardViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [cardSearchQuery, setCardSearchQuery] = useState<string>('');

  // Mind map expand/collapse state
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-heal any previously saved references that had raw binary PDF/DOCX streams or missing outputs
  useEffect(() => {
    const currentRefs = getSavedReferences();
    let anyRepaired = false;

    currentRefs.forEach((ref) => {
      const hasCorruptedSummary =
        !ref.summary ||
        ref.summary.includes('%PDF') ||
        ref.summary.includes('endobj') ||
        ref.summary.includes('FlateDecode') ||
        ref.summary.includes('PK\x03\x04');
      const hasCorruptedQuiz =
        !ref.quiz ||
        ref.quiz.length === 0 ||
        ref.quiz.some((q) => q.question.includes('%PDF') || q.question.includes('endobj'));
      const hasCorruptedCards =
        !ref.flashcards ||
        ref.flashcards.length === 0 ||
        ref.flashcards.some((fc) => fc.front.includes('%PDF') || fc.front.includes('endobj'));
      const hasMissingMnemonics = !ref.mnemonics || ref.mnemonics.length === 0;

      if (hasCorruptedSummary || hasCorruptedQuiz || hasCorruptedCards || hasMissingMnemonics) {
        const cleanBody = sanitizeClinicalText(ref.content || '', ref.title);
        const repaired: ReferenceMaterial = {
          ...ref,
          content: cleanBody || `Comprehensive study module for ${ref.title}`,
          summary: generateGroundedSummary(ref.title, cleanBody),
          quiz: generateGroundedQuiz(ref.title, cleanBody, ref.quiz?.length || 15),
          flashcards: generateGroundedFlashcards(ref.title, cleanBody, ref.flashcards?.length || 15),
          mindMap: ref.mindMap || generateGroundedMindMap(ref.title, cleanBody),
          mnemonics:
            ref.mnemonics && ref.mnemonics.length > 0
              ? ref.mnemonics
              : generateGroundedMnemonics(ref.title, cleanBody)
        };
        saveReferenceMaterial(repaired);
        anyRepaired = true;
      }
    });

    if (anyRepaired) {
      const refreshed = getSavedReferences();
      setSavedReferences(refreshed);
      if (refreshed.length > 0) {
        setSelectedReference(refreshed[0]);
      }
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (userTier === 'start' && savedReferences.length >= FREE_UPLOAD_LIMIT) {
      setIsUploadLimitModalOpen(true);
      if (e.target) e.target.value = '';
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    const ext = file.name.split('.').pop()?.toLowerCase();
    const cleanFileTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');

    if (ext === 'pdf') {
      setUploadFileType('pdf');
      if (!uploadTitle) setUploadTitle(cleanFileTitle);
      const reader = new FileReader();
      reader.onload = (event) => {
        const raw = (event.target?.result as string) || '';
        const sanitized = sanitizeClinicalText(raw, cleanFileTitle);
        setUploadText(
          sanitized.slice(0, 6000) ||
            `Clinical PDF Study Guide: ${cleanFileTitle}. Focus on pathophysiology, nursing interventions (ADPIE), pharmacology antidotes, and PRC PNLE / NCLEX safety standards.`
        );
      };
      reader.readAsText(file);
    } else if (ext === 'docx' || ext === 'doc' || ext === 'pptx' || ext === 'xlsx' || ext === 'txt' || ext === 'md') {
      setUploadFileType('word');
      if (!uploadTitle) setUploadTitle(cleanFileTitle);
      const reader = new FileReader();
      reader.onload = (event) => {
        const raw = (event.target?.result as string) || '';
        const sanitized = sanitizeClinicalText(raw, cleanFileTitle);
        setUploadText(
          sanitized.slice(0, 6000) ||
            `Nursing Lecture Document: ${cleanFileTitle}. Covering essential clinical concepts, diagnostic values, and priority nursing interventions.`
        );
      };
      reader.readAsText(file);
    } else if (['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext || '')) {
      setUploadFileType('image');
      if (!uploadTitle) setUploadTitle(`Clinical Image: ${cleanFileTitle}`);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreviewImage(base64);
        setUploadText(`Clinical Image / Chart / Diagram uploaded: ${cleanFileTitle}`);
      };
      reader.readAsDataURL(file);
    } else if (['mp4', 'mov', 'mp3', 'm4a', 'wav'].includes(ext || '')) {
      setUploadFileType('video');
      if (!uploadTitle) setUploadTitle(`Lecture Media: ${cleanFileTitle}`);
      setUploadText(`Audio/Video Lecture Recording Transcript: ${cleanFileTitle}`);
    }
  };

  const handleStartSynthesis = async () => {
    if (userTier === 'start' && savedReferences.length >= FREE_UPLOAD_LIMIT) {
      setIsUploadLimitModalOpen(true);
      return;
    }

    if (!uploadTitle.trim()) {
      alert('Please enter a title for your reference material.');
      return;
    }
    const contentToUse = uploadText.trim() || `Reference Material: ${uploadTitle}`;
    setIsSynthesizing(true);

    try {
      const response = await synthesizeReferenceMaterial({
        title: uploadTitle,
        content: contentToUse,
        fileType: uploadFileType,
        imageBase64: previewImage || undefined,
        mimeType: uploadFileType === 'image' ? 'image/jpeg' : undefined,
        quizCount: uploadQuizCount,
        flashcardCount: uploadFlashcardCount
      });

      const newRef: ReferenceMaterial = {
        id: 'ref-' + Date.now(),
        title: uploadTitle,
        fileName: fileName || `${uploadTitle.replace(/\s+/g, '_')}.${uploadFileType === 'pdf' ? 'pdf' : 'txt'}`,
        fileType: uploadFileType,
        fileSize: fileSize || '1.2 MB',
        uploadedAt: new Date().toISOString().slice(0, 10),
        pageCountOrDuration: uploadFileType === 'pdf' ? 'Extracted Study Guide' : uploadFileType === 'video' ? 'Audio/Video Media' : 'Clinical Document',
        content: contentToUse,
        previewUrl: previewImage || undefined,
        summary: response.summary,
        quiz: response.quiz,
        flashcards: response.flashcards,
        mindMap: response.mindMap,
        mnemonics: response.mnemonics
      };

      saveReferenceMaterial(newRef);
      setSavedReferences(getSavedReferences());
      setSelectedReference(newRef);
      setIsUploading(false);
      setOutputTab('summary');
      setUploadTitle('');
      setUploadText('');
      setPreviewImage(null);
      setFileName('');
      setUserQuizAnswers({});
      setShowQuizRationales({});
    } catch (e) {
      console.error(e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Custom Quiz Generator (Up to 150 questions)
  const handleGenerateCustomQuiz = async () => {
    if (!selectedReference) return;
    const safeCount = Math.max(1, Math.min(150, customQuizCount || 15));
    setIsGeneratingCustomQuiz(true);

    try {
      const questions = await generateReferenceQuiz(
        selectedReference.title,
        selectedReference.content,
        safeCount
      );

      const updatedRef: ReferenceMaterial = {
        ...selectedReference,
        quiz: questions
      };

      saveReferenceMaterial(updatedRef);
      setSelectedReference(updatedRef);
      setSavedReferences(getSavedReferences());
      setUserQuizAnswers({});
      setShowQuizRationales({});
      setQuizPage(1);
    } catch (err) {
      console.error('Failed to generate custom quiz', err);
    } finally {
      setIsGeneratingCustomQuiz(false);
    }
  };

  // Custom Flashcard Generator (Up to 150 flashcards)
  const handleGenerateCustomFlashcards = async () => {
    if (!selectedReference) return;
    const safeCount = Math.max(1, Math.min(150, customFlashcardCount || 15));
    setIsGeneratingCustomFlashcards(true);

    try {
      const cards = await generateReferenceFlashcards(
        selectedReference.title,
        selectedReference.content,
        safeCount
      );

      const updatedRef: ReferenceMaterial = {
        ...selectedReference,
        flashcards: cards
      };

      saveReferenceMaterial(updatedRef);
      setSelectedReference(updatedRef);
      setSavedReferences(getSavedReferences());
      setCarouselIndex(0);
      setIsCardFlipped(false);
    } catch (err) {
      console.error('Failed to generate custom flashcards', err);
    } finally {
      setIsGeneratingCustomFlashcards(false);
    }
  };

  const handleDeleteRef = (id: string) => {
    if (confirm('Delete this reference material and its generated study items?')) {
      deleteReferenceMaterial(id);
      const remaining = getSavedReferences();
      setSavedReferences(remaining);
      if (remaining.length > 0) {
        setSelectedReference(remaining[0]);
      }
    }
  };

  const handleImportFlashcardsToDeck = () => {
    if (!selectedReference.flashcards || selectedReference.flashcards.length === 0) return;
    const existing = getFlashcards();
    const merged = [...selectedReference.flashcards, ...existing];
    saveFlashcards(merged);
    setImportedNotice(true);
    setTimeout(() => setImportedNotice(false), 3000);
    if (onFlashcardsImported) onFlashcardsImported();
  };

  const handleCopySummary = () => {
    if (selectedReference.summary) {
      navigator.clipboard?.writeText(selectedReference.summary);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const toggleNodeCollapse = (nodeId: string) => {
    setCollapsedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // SM-2 Review Handler in Carousel Mode
  const handleCarouselSM2Rate = (rating: number) => {
    const cards = selectedReference.flashcards || [];
    if (!cards.length) return;
    const current = cards[carouselIndex];
    if (!current) return;

    const updated = {
      ...current,
      ...calculateSM2(current, rating)
    };

    const newCards = [...cards];
    newCards[carouselIndex] = updated;

    const updatedRef: ReferenceMaterial = {
      ...selectedReference,
      flashcards: newCards
    };
    saveReferenceMaterial(updatedRef);
    setSelectedReference(updatedRef);

    setIsCardFlipped(false);
    setCarouselIndex((prev) => (prev + 1) % newCards.length);
  };

  // Offline Study Pack Export (Downloadable JSON)
  const handleExportOfflinePack = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedReferences, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nursepath_offline_study_pack_${Date.now().toString().slice(-6)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Offline Study Pack Import
  const handleImportOfflinePack = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((item: ReferenceMaterial) => {
            saveReferenceMaterial(item);
          });
          const reloaded = getSavedReferences();
          setSavedReferences(reloaded);
          if (reloaded.length > 0) {
            setSelectedReference(reloaded[0]);
          }
          setImportedNotice(true);
          setTimeout(() => setImportedNotice(false), 3000);
        }
      } catch (err) {
        console.error('Failed to parse offline study pack', err);
      }
    };
    reader.readAsText(file);
  };

  // Filtered Quiz Questions
  const filteredQuizQuestions = useMemo(() => {
    const list = selectedReference?.quiz || [];
    if (quizFilter === 'all') return list;

    return list.filter((q) => {
      const ans = userQuizAnswers[q.id];
      const isAnswered = ans !== undefined;
      const isCorrect = isAnswered && ans === q.correctAnswerIndex;

      if (quizFilter === 'unanswered') return !isAnswered;
      if (quizFilter === 'correct') return isCorrect;
      if (quizFilter === 'incorrect') return isAnswered && !isCorrect;
      return true;
    });
  }, [selectedReference?.quiz, quizFilter, userQuizAnswers]);

  // Paginated Quiz Questions
  const totalQuizPages = Math.ceil(filteredQuizQuestions.length / quizPageSize) || 1;
  const paginatedQuizQuestions = useMemo(() => {
    if (quizPageSize >= 150) return filteredQuizQuestions;
    const start = (quizPage - 1) * quizPageSize;
    return filteredQuizQuestions.slice(start, start + quizPageSize);
  }, [filteredQuizQuestions, quizPage, quizPageSize]);

  // Quiz Stats
  const quizStats = useMemo(() => {
    const list = selectedReference?.quiz || [];
    const total = list.length;
    let answered = 0;
    let correct = 0;

    list.forEach((q) => {
      const ans = userQuizAnswers[q.id];
      if (ans !== undefined) {
        answered++;
        if (ans === q.correctAnswerIndex) correct++;
      }
    });

    const scorePercent = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return { total, answered, correct, scorePercent };
  }, [selectedReference?.quiz, userQuizAnswers]);

  // Filtered Flashcards for Grid View
  const filteredGridCards = useMemo(() => {
    const list = selectedReference?.flashcards || [];
    if (!cardSearchQuery.trim()) return list;
    const query = cardSearchQuery.toLowerCase();
    return list.filter(c => 
      c.front.toLowerCase().includes(query) || 
      c.back.toLowerCase().includes(query) || 
      c.pearl?.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query)
    );
  }, [selectedReference?.flashcards, cardSearchQuery]);

  // Render Mind Map recursive node
  const renderMindMapNode = (node: MindMapNode, level: number = 0) => {
    const isCollapsed = collapsedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="relative pl-4 sm:pl-6 my-2">
        {level > 0 && (
          <div className="absolute left-0 top-3 w-4 h-0.5 bg-slate-300" />
        )}
        <div className="flex items-center space-x-2">
          {hasChildren && (
            <button
              onClick={() => toggleNodeCollapse(node.id)}
              className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs flex items-center space-x-2 ${
              level === 0
                ? 'bg-gradient-to-r from-teal-700 to-blue-800 text-white border-teal-600 text-sm font-black'
                : level === 1
                ? 'bg-blue-50 text-blue-900 border-blue-200 font-bold'
                : 'bg-white text-slate-800 border-slate-200'
            }`}
          >
            <span>{node.label}</span>
            {node.badge && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-normal ${
                level === 0 ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {node.badge}
              </span>
            )}
          </div>
        </div>

        {!isCollapsed && hasChildren && (
          <div className="border-l-2 border-slate-200 ml-2 pl-2">
            {node.children!.map((child) => renderMindMapNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const currentFlashcard = (selectedReference?.flashcards || [])[carouselIndex];

  return (
    <div className="space-y-6">
      {/* Top Banner & Upload Action */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-6 text-white border border-teal-800/40 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              AI Study Synthesizer
            </span>
            <span className="text-teal-300 text-xs font-medium">Select up to 150 Reference-Grounded Items</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Upload Your References → Synthesize Quizzes, Cards & Maps
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Upload PDFs, Word docs, whiteboard images, lecture audio, or notes. Customize the exact quantity of questions and flashcards (up to 150), strictly derived from your uploaded reference.
          </p>
        </div>

        <button
          onClick={() => {
            if (userTier === 'start' && savedReferences.length >= FREE_UPLOAD_LIMIT) {
              setIsUploadLimitModalOpen(true);
            } else {
              setIsUploading(!isUploading);
            }
          }}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xs cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Close Upload' : 'Upload New Reference'}</span>
        </button>
      </div>

      {/* Free Plan Upload Allowance Status Banner */}
      {userTier === 'start' ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📁</span>
            <div>
              <div className="font-extrabold text-amber-950 flex items-center space-x-2">
                <span>Free Plan Resource Uploads:</span>
                <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {savedReferences.length} / {FREE_UPLOAD_LIMIT} Materials Used
                </span>
              </div>
              <p className="text-amber-800 text-[11px] mt-0.5">
                {savedReferences.length >= FREE_UPLOAD_LIMIT
                  ? 'You have reached the maximum 5 study materials on the Free Plan. Upgrade to upload unlimited files.'
                  : `Free Starter accounts can upload up to 5 study materials (${FREE_UPLOAD_LIMIT - savedReferences.length} remaining).`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onOpenSubscription && onOpenSubscription('growth')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Unlock Unlimited (₱69/mo)</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-teal-900 font-bold">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Unlimited Reference Uploads Active ({savedReferences.length} saved to your cloud)</span>
          </div>
          <span className="text-[10px] font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full uppercase">
            VIP Active
          </span>
        </div>
      )}

      {/* 100% Offline Access Bar */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-start sm:items-center space-x-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse mt-0.5 sm:mt-0 shrink-0" />
          <div>
            <div className="font-extrabold text-emerald-950 flex items-center space-x-2">
              <span>Offline Mode Active & Guaranteed</span>
              <span className="bg-emerald-200/60 text-emerald-900 text-[10px] font-bold px-2 py-0.2 rounded-full">
                {savedReferences.length} References Saved Locally
              </span>
            </div>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              All your uploaded reference materials, generated summaries, 150-item quizzes, and flashcards are cached on this device and load immediately anywhere with zero internet connection.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
          <button
            onClick={handleExportOfflinePack}
            className="bg-white hover:bg-emerald-100/50 text-emerald-900 border border-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
            title="Download your entire study pack as JSON to transfer to another device"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export Offline Pack</span>
          </button>

          <label className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-white" />
            <span>Import Pack</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportOfflinePack}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {importedNotice && (
        <div className="bg-teal-600 text-white p-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Offline Study Pack successfully imported! All references, quizzes, and summaries are ready to study.</span>
        </div>
      )}

      {/* Upload Modal / Form Drawer */}
      {isUploading && (
        <div className="bg-slate-50 border-2 border-amber-300/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Upload Reference Material (PDF, Word, Images, Video, Audio, Notes)</span>
            </h4>
            <span className="text-[11px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Grounded AI Generation (Max 150)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 text-center bg-white hover:bg-amber-50/30 transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 min-h-[160px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.webp,.mp4,.mov,.mp3"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                {fileName ? fileName : 'Click to Browse or Drag & Drop'}
              </div>
              <span className="text-[10px] text-slate-500">
                Supports PDF, Word (.docx), textbook photos, ECG diagrams, audio & video lecture files
              </span>
              {fileSize && (
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {fileSize} • {uploadFileType.toUpperCase()}
                </span>
              )}
            </div>

            {/* Inputs & Details */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Reference Title / Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Critical Care Inotropes & Hemodynamics"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Type of Material
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'pdf', label: 'PDF Doc', icon: FileText },
                    { id: 'word', label: 'Word/Notes', icon: FileSpreadsheet },
                    { id: 'image', label: 'Image/ECG', icon: ImageIcon },
                    { id: 'video', label: 'Video/Audio', icon: Video },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setUploadFileType(m.id as any)}
                        className={`p-2 rounded-xl border text-center font-bold text-[10px] flex flex-col items-center justify-center cursor-pointer ${
                          uploadFileType === m.id
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 mb-0.5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Text Content / Key Lecture Notes (Paste or Extracted)
                </label>
                <textarea
                  placeholder="Paste lecture transcription, textbook excerpt, or study notes here..."
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs min-h-[65px] outline-none"
                />
              </div>
            </div>
          </div>

          {/* QUANTITY SELECTORS (MAX 150) */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>Configure Generation Quantities (Select up to 150 Items)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Quiz Quantity Selector */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">
                    🎯 Practice Quiz Questions (Max 150)
                  </span>
                  <span className="font-black text-amber-700 text-sm bg-amber-100 px-2 py-0.5 rounded">
                    {uploadQuizCount} Questions
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  {[10, 25, 50, 75, 100, 150].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setUploadQuizCount(num)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        uploadQuizCount === num
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                  <div className="flex items-center space-x-1 ml-auto">
                    <span className="text-[10px] text-slate-500">Custom:</span>
                    <input
                      type="number"
                      min={1}
                      max={150}
                      value={uploadQuizCount}
                      onChange={(e) => setUploadQuizCount(Math.max(1, Math.min(150, parseInt(e.target.value) || 1)))}
                      className="w-14 p-1 text-center bg-white border border-slate-300 rounded font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Flashcard Quantity Selector */}
              <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-950">
                    ⚡ SM-2 Flashcards (Max 150)
                  </span>
                  <span className="font-black text-teal-700 text-sm bg-teal-100 px-2 py-0.5 rounded">
                    {uploadFlashcardCount} Cards
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  {[10, 25, 50, 75, 100, 150].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setUploadFlashcardCount(num)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        uploadFlashcardCount === num
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {num} Cards
                    </button>
                  ))}
                  <div className="flex items-center space-x-1 ml-auto">
                    <span className="text-[10px] text-slate-500">Custom:</span>
                    <input
                      type="number"
                      min={1}
                      max={150}
                      value={uploadFlashcardCount}
                      onChange={(e) => setUploadFlashcardCount(Math.max(1, Math.min(150, parseInt(e.target.value) || 1)))}
                      className="w-14 p-1 text-center bg-white border border-slate-300 rounded font-bold text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * Note: All generated questions and flashcards are strictly matched and formulated from the terminology, clinical values, pharmacology, and concepts in your uploaded resource.
            </p>
          </div>

          {previewImage && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center space-x-3">
              <img src={previewImage} alt="Uploaded chart preview" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">Multimodal Vision Input Attached</span>
                <span className="text-[11px] text-slate-500">Gemini 3.8 will analyze visual cues, charts, and diagrams.</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              ⚡ Produces 5 Outputs: Summary, Practice Quiz ({uploadQuizCount} Qs), Flashcards ({uploadFlashcardCount} Cards), Mind Map & Mnemonics
            </span>

            <button
              onClick={handleStartSynthesis}
              disabled={isSynthesizing || !uploadTitle.trim()}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSynthesizing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Synthesizing Study Materials...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Synthesize Study Pack</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Reference Material Switcher Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 shrink-0">Your References:</span>
        {savedReferences.map((ref) => {
          const isSelected = selectedReference?.id === ref.id;
          return (
            <button
              key={ref.id}
              onClick={() => {
                setSelectedReference(ref);
                setUserQuizAnswers({});
                setShowQuizRationales({});
                setCarouselIndex(0);
                setIsCardFlipped(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 cursor-pointer ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-500/30'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{ref.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Reference Study Suite */}
      {selectedReference && (
        <div className="space-y-4">
          {/* Reference Meta Header */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200 uppercase">
                  {selectedReference.fileType.toUpperCase()} Source
                </span>
                <span className="text-xs text-slate-500">File: {selectedReference.fileName}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{selectedReference.uploadedAt}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {selectedReference.quiz?.length || 0} Questions
                </span>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {selectedReference.flashcards?.length || 0} Flashcards
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {selectedReference.title}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDeleteRef(selectedReference.id)}
                className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete this Reference"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-Navigation for the 5 Generated Outputs */}
          <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'summary', label: '📋 Clinical Summary', badge: 'Structured' },
              { id: 'quiz', label: '📝 Practical Quiz', badge: `${selectedReference.quiz?.length || 0} Qs` },
              { id: 'flashcards', label: '⚡ SM-2 Flashcards', badge: `${selectedReference.flashcards?.length || 0} Cards` },
              { id: 'mindmap', label: '🗺️ Interactive Mind Map', badge: 'Visual Tree' },
              { id: 'mnemonics', label: '💡 Mnemonics', badge: `${selectedReference.mnemonics?.length || 0} Recall Aids` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setOutputTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                  outputTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  outputTab === tab.id ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Tab 1: Executive Summary */}
          {outputTab === 'summary' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Executive Clinical Summary & Care Directives
                  </h4>
                </div>
                <button
                  onClick={handleCopySummary}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{copiedText ? 'Copied! ✓' : 'Copy Summary'}</span>
                </button>
              </div>

              <div className="prose prose-sm max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                {selectedReference.summary || 'Summary is ready for viewing.'}
              </div>
            </div>
          )}

          {/* Tab 2: Interactive Practice Quiz (With Customizer up to 150 questions) */}
          {outputTab === 'quiz' && (
            <div className="space-y-4">
              {/* QUIZ CUSTOMIZER BAR */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-amber-950 text-sm flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Practical Quiz Customizer</span>
                      </span>
                      <span className="bg-amber-200/80 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Max 150 Questions
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Select how many questions you want generated directly from <strong>{selectedReference.title}</strong>.
                    </p>
                  </div>

                  {/* Quantity Pickers & Generator Button */}
                  <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                    <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-amber-300">
                      {[10, 25, 50, 75, 100, 150].map((num) => (
                        <button
                          key={num}
                          onClick={() => setCustomQuizCount(num)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            customQuizCount === num
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <div className="flex items-center pl-1 border-l border-slate-200">
                        <input
                          type="number"
                          min={1}
                          max={150}
                          value={customQuizCount}
                          onChange={(e) => setCustomQuizCount(Math.max(1, Math.min(150, parseInt(e.target.value) || 1)))}
                          className="w-12 text-center text-xs font-bold text-slate-800 outline-none"
                          title="Enter question count (1 - 150)"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateCustomQuiz}
                      disabled={isGeneratingCustomQuiz}
                      className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingCustomQuiz ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating {customQuizCount} Qs...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Generate {customQuizCount} Questions</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Score & Progress Tracker */}
                <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-3 text-slate-700">
                    <span className="font-semibold">
                      Answered: <strong className="text-slate-900">{quizStats.answered}</strong> / {quizStats.total}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold">
                      Score: <strong className="text-teal-700">{quizStats.correct}</strong> / {quizStats.answered} ({quizStats.scorePercent}%)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Filter Pills */}
                    <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px]">
                      {(['all', 'unanswered', 'correct', 'incorrect'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setQuizFilter(mode);
                            setQuizPage(1);
                          }}
                          className={`px-2 py-0.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                            quizFilter === mode
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setUserQuizAnswers({});
                        setShowQuizRationales({});
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center space-x-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* QUESTIONS LIST */}
              <div className="space-y-4">
                {paginatedQuizQuestions.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-500">
                    No questions match the current filter ({quizFilter}). Try switching filter to "All".
                  </div>
                ) : (
                  paginatedQuizQuestions.map((q, localIdx) => {
                    const originalIndex = (selectedReference.quiz || []).findIndex(item => item.id === q.id);
                    const qNumber = originalIndex >= 0 ? originalIndex + 1 : localIdx + 1;
                    const userAnswer = userQuizAnswers[q.id];
                    const isAnswered = userAnswer !== undefined;
                    const isCorrect = isAnswered && userAnswer === q.correctAnswerIndex;

                    return (
                      <div key={q.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              Question {qNumber} of {selectedReference.quiz?.length || 0}
                            </span>
                            {q.subtopic && (
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {q.subtopic}
                              </span>
                            )}
                          </div>
                          {isAnswered && (
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                              isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> : <XCircle className="w-3.5 h-3.5 inline mr-1" />}
                              <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {q.question}
                        </h4>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userAnswer === optIdx;
                            const isTargetCorrect = optIdx === q.correctAnswerIndex;
                            let style = 'border-slate-200 bg-white hover:border-slate-300';

                            if (isAnswered) {
                              if (isTargetCorrect) {
                                style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                              } else if (isSelected) {
                                style = 'border-rose-400 bg-rose-50 text-rose-950';
                              } else {
                                style = 'border-slate-200 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setUserQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                  setShowQuizRationales((prev) => ({ ...prev, [q.id]: true }));
                                }}
                                className={`w-full text-left p-3 rounded-xl border-2 text-xs flex items-start space-x-3 transition-all cursor-pointer ${style}`}
                              >
                                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="flex-1">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {showQuizRationales[q.id] && (
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 animate-fadeIn">
                            <span className="font-bold text-teal-900 flex items-center space-x-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                              <span>Evidence-Based Clinical Rationale:</span>
                            </span>
                            <p className="text-slate-700 leading-relaxed">{q.rationale}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* PAGINATION / VIEW CONTROLS */}
              {filteredQuizQuestions.length > quizPageSize && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <span>Questions per page:</span>
                    <select
                      value={quizPageSize}
                      onChange={(e) => {
                        setQuizPageSize(Number(e.target.value));
                        setQuizPage(1);
                      }}
                      className="p-1 rounded border border-slate-300 font-bold text-slate-800 bg-white"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={150}>All (Up to 150)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuizPage((p) => Math.max(1, p - 1))}
                      disabled={quizPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <span className="font-bold text-slate-800">
                      Page {quizPage} of {totalQuizPages}
                    </span>

                    <button
                      onClick={() => setQuizPage((p) => Math.min(totalQuizPages, p + 1))}
                      disabled={quizPage === totalQuizPages}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer flex items-center space-x-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Generated SM-2 Flashcards (With Customizer up to 150 cards) */}
          {outputTab === 'flashcards' && (
            <div className="space-y-4">
              {/* FLASHCARDS CUSTOMIZER BAR */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-teal-950 text-sm flex items-center space-x-1.5">
                        <Zap className="w-4 h-4 text-teal-700" />
                        <span>SM-2 Flashcard Deck Customizer</span>
                      </span>
                      <span className="bg-teal-200/80 text-teal-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Max 150 Flashcards
                      </span>
                    </div>
                    <p className="text-xs text-teal-800 mt-0.5">
                      Select how many cards you want generated directly from <strong>{selectedReference.title}</strong>.
                    </p>
                  </div>

                  {/* Quantity Pickers & Generator Button */}
                  <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                    <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-teal-300">
                      {[10, 25, 50, 75, 100, 150].map((num) => (
                        <button
                          key={num}
                          onClick={() => setCustomFlashcardCount(num)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            customFlashcardCount === num
                              ? 'bg-teal-700 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <div className="flex items-center pl-1 border-l border-slate-200">
                        <input
                          type="number"
                          min={1}
                          max={150}
                          value={customFlashcardCount}
                          onChange={(e) => setCustomFlashcardCount(Math.max(1, Math.min(150, parseInt(e.target.value) || 1)))}
                          className="w-12 text-center text-xs font-bold text-slate-800 outline-none"
                          title="Enter card count (1 - 150)"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateCustomFlashcards}
                      disabled={isGeneratingCustomFlashcards}
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingCustomFlashcards ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating {customFlashcardCount} Cards...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Generate {customFlashcardCount} Cards</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub-bar: Actions & View Mode Toggle */}
                <div className="pt-2 border-t border-teal-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleImportFlashcardsToDeck}
                      className="bg-teal-800 hover:bg-teal-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{importedNotice ? 'Added to Study Lounge Deck! ✓' : `Add All ${selectedReference.flashcards?.length || 0} to Deck`}</span>
                    </button>
                    <span className="text-[11px] text-teal-800">
                      Syncs with SuperMemo SM-2 Spaced Repetition engine
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                    <button
                      onClick={() => setFlashcardViewMode('carousel')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        flashcardViewMode === 'carousel'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Interactive Carousel
                    </button>
                    <button
                      onClick={() => setFlashcardViewMode('grid')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        flashcardViewMode === 'grid'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Browse Grid ({selectedReference.flashcards?.length || 0})
                    </button>
                  </div>
                </div>
              </div>

              {/* MODE 1: INTERACTIVE CAROUSEL */}
              {flashcardViewMode === 'carousel' && (
                <div className="max-w-2xl mx-auto space-y-4">
                  {currentFlashcard ? (
                    <div className="space-y-4">
                      {/* Top Carousel Navigation */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold text-slate-800">
                          Card {carouselIndex + 1} of {selectedReference.flashcards?.length || 0}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setIsCardFlipped(false);
                              setCarouselIndex((prev) => (prev > 0 ? prev - 1 : (selectedReference.flashcards?.length || 1) - 1));
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
                            title="Previous Card"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setIsCardFlipped(false);
                              setCarouselIndex((prev) => (prev + 1) % (selectedReference.flashcards?.length || 1));
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
                            title="Next Card"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Flip Card Container */}
                      <div
                        onClick={() => setIsCardFlipped(!isCardFlipped)}
                        className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-md min-h-[280px] flex flex-col justify-between cursor-pointer transition-all hover:border-amber-400 relative select-none"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                            {currentFlashcard.category}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Click anywhere to flip
                          </span>
                        </div>

                        <div className="py-6 text-center">
                          {!isCardFlipped ? (
                            <div className="space-y-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                                Question / Clinical Prompt
                              </span>
                              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                                {currentFlashcard.front}
                              </h3>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 block">
                                Answer & Rationale
                              </span>
                              <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                                {currentFlashcard.back}
                              </p>
                              {currentFlashcard.pearl && (
                                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium text-left">
                                  💡 <strong>Memory Pearl:</strong> {currentFlashcard.pearl}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                          <span>{currentFlashcard.evidenceLevel || 'Evidence Level I'}</span>
                          <span className="text-teal-700 font-bold">
                            {isCardFlipped ? 'Answer View' : 'Prompt View'}
                          </span>
                        </div>
                      </div>

                      {/* SM-2 Rating Controls when Flipped */}
                      {isCardFlipped && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 animate-fadeIn">
                          <span className="text-xs font-bold text-slate-700 block text-center">
                            Rate Recall Accuracy (SuperMemo SM-2 Algorithm):
                          </span>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { label: 'Again', desc: '< 1 min', q: 1, color: 'bg-rose-600 hover:bg-rose-700 text-white' },
                              { label: 'Hard', desc: '12 hrs', q: 3, color: 'bg-amber-600 hover:bg-amber-700 text-white' },
                              { label: 'Good', desc: '1 day', q: 4, color: 'bg-teal-700 hover:bg-teal-800 text-white' },
                              { label: 'Easy', desc: '4 days', q: 5, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
                            ].map((btn) => (
                              <button
                                key={btn.label}
                                onClick={() => handleCarouselSM2Rate(btn.q)}
                                className={`p-2 rounded-xl text-center font-bold text-xs shadow-xs cursor-pointer ${btn.color}`}
                              >
                                <div>{btn.label}</div>
                                <div className="text-[10px] opacity-80 font-normal">{btn.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-xs text-slate-500">
                      No flashcards available. Click Generate Cards above.
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: BROWSE GRID */}
              {flashcardViewMode === 'grid' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search cards by term, drug, or concept..."
                        value={cardSearchQuery}
                        onChange={(e) => setCardSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      Showing {filteredGridCards.length} of {selectedReference.flashcards?.length || 0} cards
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGridCards.map((card, idx) => (
                      <div key={card.id || idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Card {idx + 1}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">{card.evidenceLevel}</span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{card.front}</h4>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                            {card.back}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 text-[11px] text-amber-900 font-medium">
                          💡 <strong>Pearl:</strong> {card.pearl}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Interactive Mind Map */}
          {outputTab === 'mindmap' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Interactive Conceptual Mind Map
                  </h4>
                  <p className="text-xs text-slate-500">
                    Hierarchical clinical structure extracted directly from your reference material. Click arrows to collapse/expand branches.
                  </p>
                </div>
                <button
                  onClick={() => setCollapsedNodes({})}
                  className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
                >
                  Expand All Nodes
                </button>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 overflow-x-auto">
                {selectedReference.mindMap ? (
                  renderMindMapNode(selectedReference.mindMap)
                ) : (
                  <div className="text-xs text-slate-500 text-center py-6">
                    Mind map is being rendered.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Mnemonics & Memory Aids */}
          {outputTab === 'mnemonics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedReference.mnemonics || []).map((m) => (
                <div key={m.id} className="bg-white rounded-2xl p-6 border border-amber-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-amber-900 bg-amber-50 px-3 py-1 rounded-xl border border-amber-300">
                      {m.mnemonic}
                    </span>
                    <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                      High-Yield Memory Aid
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 leading-relaxed">
                    {m.expansion}
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <span className="font-bold text-slate-800 text-[11px] block">Bedside Clinical Application:</span>
                    <p className="text-slate-600 leading-relaxed">{m.clinicalApplication}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-teal-800">
                    💡 <strong>Exam Tip:</strong> {m.highYieldTip}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Limit Upgrade Modal */}
      {isUploadLimitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-center space-y-5 animate-scaleIn">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
              📁
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Upload Limit Reached (5/5 Resources)
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                You've reached the 5 study materials limit on Free Mode
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Free Starter accounts are limited to <strong>5 uploaded study materials</strong>. Upgrade to <strong>Nurse Student Pass (₱69/mo)</strong> or <strong>Nurse Board Ready (₱149/mo)</strong> for unlimited uploads, PDF & Word synthesis, and up to 150-question generation!
              </p>
            </div>

            {/* Direct Philippine E-Wallet Pay Info */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-left">
              <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Direct Philippine E-Wallet Payment:</span>
                <span className="text-teal-700 font-mono text-[10px]">Zero Transfer Fees</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-blue-50 border border-blue-200 p-2 rounded-xl">
                  <div className="font-black text-blue-900 text-[10px]">GCash Direct</div>
                  <div className="font-mono text-[11px] font-bold text-blue-800">09912725905</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                  <div className="font-black text-emerald-900 text-[10px]">Maya Direct</div>
                  <div className="font-mono text-[11px] font-bold text-emerald-800">09218432624</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsUploadLimitModalOpen(false);
                  if (onOpenSubscription) onOpenSubscription('growth');
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Upgrade to Student Pass (₱69/month)</span>
              </button>

              <button
                onClick={() => setIsUploadLimitModalOpen(false)}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

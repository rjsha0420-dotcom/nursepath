import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  FileText, 
  BookOpen, 
  Bookmark, 
  Trash2, 
  Sparkles,
  AlertCircle,
  Tag
} from 'lucide-react';
import { CourseCurriculum } from '../../../data/mockCurriculum';
import { SubjectTaskItem, SubjectNoteEntry, SubjectJournalEntry } from '../../../types';
import { 
  getSubjectTasks, 
  saveSubjectTask, 
  toggleSubjectTaskStatus, 
  deleteSubjectTask,
  getSubjectNotes,
  saveSubjectNote,
  getSubjectJournals,
  saveSubjectJournal
} from '../../../services/storageService';

interface SubjectNotesAndTasksProps {
  course: CourseCurriculum | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubjectNotesAndTasks: React.FC<SubjectNotesAndTasksProps> = ({
  course,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes' | 'journal'>('tasks');
  const [tasks, setTasks] = useState<SubjectTaskItem[]>([]);
  const [notes, setNotes] = useState<SubjectNoteEntry[]>([]);
  const [journals, setJournals] = useState<SubjectJournalEntry[]>([]);

  // Task creation state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<SubjectTaskItem['type']>('Assignment');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [taskNotes, setTaskNotes] = useState('');

  // Note creation state
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');

  // Journal creation state
  const [isAddingJournal, setIsAddingJournal] = useState(false);
  const [journalSetting, setJournalSetting] = useState('');
  const [journalReflection, setJournalReflection] = useState('');
  const [journalCompetency, setJournalCompetency] = useState('COMP-01 Safe & Quality Nursing Care');

  useEffect(() => {
    if (course) {
      setTasks(getSubjectTasks(course.id));
      setNotes(getSubjectNotes(course.id));
      setJournals(getSubjectJournals(course.id));
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const handleToggleTask = (taskId: string) => {
    toggleSubjectTaskStatus(taskId);
    setTasks(getSubjectTasks(course.id));
  };

  const handleDeleteTask = (taskId: string) => {
    deleteSubjectTask(taskId);
    setTasks(getSubjectTasks(course.id));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask: SubjectTaskItem = {
      id: 'tsk-' + Date.now(),
      courseId: course.id,
      title: taskTitle.trim(),
      type: taskType,
      dueDate: taskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      priority: taskPriority,
      status: 'upcoming',
      notes: taskNotes.trim() || undefined
    };

    saveSubjectTask(newTask);
    setTasks(getSubjectTasks(course.id));
    setTaskTitle('');
    setTaskNotes('');
    setIsAddingTask(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const newNote: SubjectNoteEntry = {
      id: 'note-' + Date.now(),
      courseId: course.id,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      tags: noteTags ? noteTags.split(',').map((t) => t.trim()) : ['Lecture Notes'],
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    saveSubjectNote(newNote);
    setNotes(getSubjectNotes(course.id));
    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    setIsAddingNote(false);
  };

  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalReflection.trim()) return;

    const newJournal: SubjectJournalEntry = {
      id: 'jrn-' + Date.now(),
      courseId: course.id,
      date: new Date().toISOString().slice(0, 10),
      clinicalSetting: journalSetting.trim() || 'Skills Laboratory / Ward',
      learningReflection: journalReflection.trim(),
      competencyAddressed: journalCompetency
    };

    saveSubjectJournal(newJournal);
    setJournals(getSubjectJournals(course.id));
    setJournalSetting('');
    setJournalReflection('');
    setIsAddingJournal(false);
  };

  const upcomingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-indigo-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Student Learning Workspace
              </span>
              <span className="text-teal-300 text-xs font-semibold">{course.code}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              {course.title}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Personal reference notes, clinical journal, and upcoming assignment/project tracking monitor.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 pt-3 flex items-center space-x-3 text-xs">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'tasks'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Tasks & Projects Monitor ({upcomingTasks.length} Upcoming)</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'notes'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Personal Notes & References ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`pb-3 font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'journal'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Clinical Reflective Journal ({journals.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: Tasks & Projects Monitor */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Header with Add Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Subject Tasks & Milestone Tracker
                  </h4>
                  <p className="text-xs text-slate-500">
                    Track upcoming assignments, term projects, return demonstrations, and case presentations.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingTask ? 'Cancel' : 'Add New Task'}</span>
                </button>
              </div>

              {/* Add Task Form Drawer */}
              {isAddingTask && (
                <form
                  onSubmit={handleCreateTask}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-fadeIn"
                >
                  <h5 className="font-bold text-xs text-slate-800">New Task / Project</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Task Title *
                      </label>
                      <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="e.g. Return Demo: Tracheostomy Care & Suctioning"
                        required
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Task Type
                      </label>
                      <select
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                      >
                        <option value="Assignment">Assignment</option>
                        <option value="Project">Project</option>
                        <option value="Return Demonstration">Return Demonstration</option>
                        <option value="Case Presentation">Case Presentation</option>
                        <option value="Term Paper">Term Paper</option>
                        <option value="Major Exam">Major Exam</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Priority Level
                      </label>
                      <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Notes / Instructions
                    </label>
                    <textarea
                      value={taskNotes}
                      onChange={(e) => setTaskNotes(e.target.value)}
                      rows={2}
                      placeholder="Add rubrics, group members, or reference materials..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-teal-600"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingTask(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
                    >
                      Save Task
                    </button>
                  </div>
                </form>
              )}

              {/* Upcoming Tasks Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                    Upcoming Tasks ({upcomingTasks.length})
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Click circle to mark completed</span>
                </div>

                {upcomingTasks.length === 0 ? (
                  <div className="bg-slate-50 rounded-xl p-6 text-center text-xs text-slate-500 border border-slate-200">
                    No upcoming tasks for this subject! Enjoy your study session.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex items-start justify-between gap-3 hover:border-teal-300 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className="mt-0.5 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                            title="Mark as completed"
                          >
                            <Circle className="w-4 h-4" />
                          </button>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h5 className="font-bold text-xs text-slate-900">{task.title}</h5>
                              <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.2 rounded">
                                {task.type}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  task.priority === 'High'
                                    ? 'bg-rose-100 text-rose-800'
                                    : task.priority === 'Medium'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {task.priority} Priority
                              </span>
                            </div>
                            {task.notes && (
                              <p className="text-[11px] text-slate-600 mt-1">{task.notes}</p>
                            )}
                            <div className="flex items-center space-x-3 text-[10px] text-slate-500 mt-1.5 font-medium">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>Due: {task.dueDate}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Tasks Section */}
              {completedTasks.length > 0 && (
                <div className="space-y-3 pt-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Completed Tasks ({completedTasks.length})</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-emerald-50/40 border border-emerald-200/70 rounded-xl p-3 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => handleToggleTask(task.id)}
                            className="mt-0.5 text-emerald-600 cursor-pointer"
                            title="Unmark"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-slate-700 line-through">
                                {task.title}
                              </span>
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                Completed
                              </span>
                            </div>
                            {task.gradeOrScore && (
                              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                Score: {task.gradeOrScore}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Personal Notes & References */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Subject Notes & High-Yield References
                  </h4>
                  <p className="text-xs text-slate-500">
                    Summarize key lecture pearls, drug cards, and clinical guidelines.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingNote(!isAddingNote)}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNote ? 'Cancel' : 'New Note'}</span>
                </button>
              </div>

              {isAddingNote && (
                <form
                  onSubmit={handleCreateNote}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-fadeIn"
                >
                  <h5 className="font-bold text-xs text-slate-800">Add Subject Note</h5>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Note Title *
                    </label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="e.g. Maslow vs Henderson Prioritization Framework"
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Content / High-Yield Notes *
                    </label>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      rows={5}
                      placeholder="Write your clinical notes, formulas, or key board exam points..."
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-teal-600 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={noteTags}
                      onChange={(e) => setNoteTags(e.target.value)}
                      placeholder="e.g. PNLE, Theories, Exam 1"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
                    >
                      Save Note
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 gap-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <h5 className="font-extrabold text-sm text-slate-900">{note.title}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">Updated: {note.updatedAt}</span>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                      {note.content}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-slate-400" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Clinical Reflective Journal */}
          {activeTab === 'journal' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Clinical Reflective Learning Journal
                  </h4>
                  <p className="text-xs text-slate-500">
                    Record your clinical duty reflections, ethical dilemmas, and competency milestones.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingJournal(!isAddingJournal)}
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingJournal ? 'Cancel' : 'Add Journal Entry'}</span>
                </button>
              </div>

              {isAddingJournal && (
                <form
                  onSubmit={handleCreateJournal}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 animate-fadeIn"
                >
                  <h5 className="font-bold text-xs text-slate-800">New Clinical Journal Entry</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Clinical Setting / Unit *
                      </label>
                      <input
                        type="text"
                        value={journalSetting}
                        onChange={(e) => setJournalSetting(e.target.value)}
                        placeholder="e.g. Medical Ward, Philippine General Hospital"
                        required
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Core Competency Addressed
                      </label>
                      <select
                        value={journalCompetency}
                        onChange={(e) => setJournalCompetency(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-teal-600"
                      >
                        <option value="COMP-01 Safe & Quality Nursing Care">COMP-01 Safe & Quality Care</option>
                        <option value="COMP-03 Health Education">COMP-03 Health Education</option>
                        <option value="COMP-04 Legal Responsibility">COMP-04 Legal Responsibility</option>
                        <option value="COMP-05 Ethico-Moral Responsibility">COMP-05 Ethico-Moral Responsibility</option>
                        <option value="COMP-10 Communication (SBAR)">COMP-10 Communication</option>
                        <option value="COMP-11 Teamwork & Collaboration">COMP-11 Teamwork</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Clinical Reflection & Patient Encounter Insights *
                    </label>
                    <textarea
                      value={journalReflection}
                      onChange={(e) => setJournalReflection(e.target.value)}
                      rows={4}
                      placeholder="What happened? What were your clinical decisions, feelings, and key learnings? How did you apply theoretical principles?"
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-teal-600"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingJournal(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
                    >
                      Save Journal Entry
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {journals.map((jrn) => (
                  <div
                    key={jrn.id}
                    className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900 bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded">
                        {jrn.clinicalSetting}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{jrn.date}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      &quot;{jrn.learningReflection}&quot;
                    </p>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        Competency: {jrn.competencyAddressed}
                      </span>
                      {jrn.instructorFeedback && (
                        <span className="text-[10px] text-teal-700 font-bold">
                          ✓ Preceptor Verified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Automatically synchronized and stored securely on your authorized devices.
          </span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

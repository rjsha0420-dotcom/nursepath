import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Award, 
  Briefcase, 
  GraduationCap, 
  ThumbsUp, 
  Search, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Heart,
  Share2
} from 'lucide-react';
import { MOCK_COMMUNITY_POSTS, MOCK_MENTORS, MOCK_GLOBAL_JOBS, MOCK_SCHOLARSHIPS, CommunityPost } from '../../data/mockCommunity';
import { UserProfile } from '../../types';

interface CommunityPageProps {
  user: UserProfile;
  onOpenSubscription: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  user,
  onOpenSubscription
}) => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'mentors' | 'jobs' | 'grants'>('discussions');

  // Discussions state
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postCategory, setPostCategory] = useState<CommunityPost['category']>('Undergrad & PNLE');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;

    const created: CommunityPost = {
      id: 'post-' + Date.now(),
      authorName: user.name,
      authorRole: 'BSN Nursing Student',
      authorAvatar: user.name.slice(0, 2).toUpperCase(),
      badge: 'Student Contributor',
      category: postCategory,
      title: newPostTitle,
      content: newPostContent,
      likes: 1,
      repliesCount: 0,
      timeAgo: 'Just now',
      tags: ['Discussion', 'StudyTips']
    };

    setPosts([created, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setIsPosting(false);
  };

  const handleLikePost = (id: string) => {
    setPosts(posts.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="bg-violet-500/30 text-violet-200 border border-violet-400/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              🤝 Global Nursing Network & Mentorship
            </span>
            <span className="text-violet-300 text-xs font-semibold">14,000+ Filipino Nurses Worldwide</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Connect with Mentors, Peers, and Global Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-violet-100/90 leading-relaxed">
            Collaborate with fellow nursing scholars, book 1-on-1 consultations with verified nurse mentors, browse direct hospital visa sponsorships, and apply for research grants.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'discussions', label: '💬 Peer Study Discussions', badge: 'Active Forum' },
          { id: 'mentors', label: '👩‍⚕️ Verified Nurse Mentors', badge: '1-on-1 Advice' },
          { id: 'jobs', label: '✈️ Global RN Jobs & Sponsorships', badge: 'EB-3 • NHS • AHPRA' },
          { id: 'grants', label: '🎓 Research Grants & Scholarships', badge: 'Funding' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-violet-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-violet-800 text-violet-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: Discussions */}
      {activeTab === 'discussions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-slate-900">
              Community Study Forum ({posts.length} Discussions)
            </h3>
            <button
              onClick={() => setIsPosting(!isPosting)}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {isPosting ? 'Cancel' : '+ Start a Discussion'}
            </button>
          </div>

          {/* New Post Form */}
          {isPosting && (
            <form onSubmit={handleCreatePost} className="bg-white p-5 rounded-3xl border-2 border-violet-300 shadow-sm space-y-3 text-xs animate-fadeIn">
              <h4 className="font-bold text-slate-900">Create New Study Discussion</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Discussion title..."
                  className="p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as any)}
                  className="p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-hidden bg-white"
                >
                  <option value="Undergrad & PNLE">Undergrad & PNLE</option>
                  <option value="NCLEX & International">NCLEX & International</option>
                  <option value="Clinical Practice">Clinical Practice</option>
                  <option value="Masteral & PhD">Masteral & PhD</option>
                </select>
              </div>
              <textarea
                rows={3}
                required
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your questions, clinical tips, or study notes..."
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-colors cursor-pointer"
              >
                Post to Network
              </button>
            </form>
          )}

          {/* Posts List */}
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-800 font-bold text-xs flex items-center justify-center">
                      {post.authorName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900">{post.authorName}</span>
                      <span className="text-[10px] text-slate-500 ml-2">{post.authorRole} • {post.timeAgo}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded-full border border-violet-200">
                    {post.category}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900">{post.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center space-x-1 hover:text-violet-600 cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likes} Helpful</span>
                    </button>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.repliesCount} Replies</span>
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {post.tags.map((t, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Mentors */}
      {activeTab === 'mentors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_MENTORS.map((m) => (
            <div key={m.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{m.name}</h4>
                    <span className="text-xs font-semibold text-violet-700">{m.credentials}</span>
                  </div>
                  {m.verifiedBadge && (
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Verified RN
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-1">{m.currentRole} • {m.hospitalOrUniversity}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{m.bio}</p>

                <div className="mt-3 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Mentorship Topics:</span>
                  <div className="flex flex-wrap gap-1">
                    {m.mentorshipTopics.map((top, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-md">
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{m.slotsAvailable} slots available</span>
                <button
                  onClick={() => alert(`Consultation request sent to ${m.name}! They will reply to your registered email.`)}
                  className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Book 1-on-1 Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Global Jobs */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_GLOBAL_JOBS.map((j) => (
              <div key={j.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase">
                      {j.country}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700">{j.salaryRange}</span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 mt-1">{j.title}</h4>
                  <p className="text-xs text-slate-600">{j.institution} • {j.location}</p>

                  <div className="mt-2 text-xs font-semibold text-violet-900 bg-violet-50 p-2 rounded-xl">
                    Visa: {j.visaStatus}
                  </div>

                  <div className="mt-3 space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Qualifications:</span>
                    {j.qualifications.map((q, idx) => (
                      <div key={idx} className="text-[11px] text-slate-700 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{j.experienceRequired}</span>
                  <button
                    onClick={() => alert(`Application initiated for ${j.title} at ${j.institution}. Please check your email for the employer portal link.`)}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply with NursePath Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Grants & Scholarships */}
      {activeTab === 'grants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_SCHOLARSHIPS.map((g) => (
            <div key={g.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase">
                  {g.eligibleLevel}
                </span>
                <h4 className="font-extrabold text-base text-slate-900 mt-1">{g.title}</h4>
                <p className="text-xs text-slate-500">Awarding Body: {g.awardingBody} • Deadline: {g.deadline}</p>
                <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium leading-relaxed">
                  <strong>Coverage:</strong> {g.coverage}
                </div>
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Requirements:</span>
                  {g.requirements.map((req, idx) => (
                    <div key={idx} className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Deadline: {g.deadline}</span>
                <button
                  onClick={() => alert(`Guidelines opened for ${g.title}`)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  View Guidelines
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

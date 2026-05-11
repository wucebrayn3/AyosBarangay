import React, { useState } from "react";
import { MessageSquare, Reply, ExternalLink, Search, Filter } from "lucide-react";

const Feedback = () => {
  const [feedbacks] = useState([
    {
      id: 1,
      user: "Maria S.",
      initials: "MS",
      referenceNumber: "AB-1042",
      comment: "Almost a week na, kelan po ba talaga aayusin?",
      timestamp: "2h ago",
      isAnonymous: false,
      hasThread: true
    },
    {
      id: 2,
      user: "Anonymous",
      initials: "AN",
      referenceNumber: "AB-1039",
      comment: "Salamat sa mabilis na response, ang linis na po ngayon!",
      timestamp: "5h ago",
      isAnonymous: true,
      hasThread: true
    },
    {
      id: 3,
      user: "Pedro R.",
      initials: "PR",
      referenceNumber: "AB-1040",
      comment: "May tubig pa rin po hanggang ngayon, pakitignan.",
      timestamp: "yesterday",
      isAnonymous: false,
      hasThread: true
    },
    {
      id: 4,
      user: "Liza M.",
      initials: "LM",
      referenceNumber: "AB-1037",
      comment: "Suggestion: maglagay po ng warning sign muna habang inaayos.",
      timestamp: "yesterday",
      isAnonymous: false,
      hasThread: true
    },
    {
      id: 5,
      user: "Anonymous",
      initials: "AN",
      referenceNumber: "AB-1035",
      comment: "Ang ingay ng construction sa umaga, pwede ba i-schedule sa afternoon?",
      timestamp: "2 days ago",
      isAnonymous: true,
      hasThread: false
    },
    {
      id: 6,
      user: "Juan D.",
      initials: "JD",
      referenceNumber: "AB-1033",
      comment: "Okay na okay! Mabilis at maayos ang serbisyo. Salamat!",
      timestamp: "3 days ago",
      isAnonymous: false,
      hasThread: false
    }
  ]);

  const [filter, setFilter] = useState("all");

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (filter === "anonymous") return fb.isAnonymous;
    if (filter === "with-thread") return fb.hasThread;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
          Resident Feedback
        </p>
        <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">
          Comments & Concerns
        </h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search comments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:border-transparent bg-white"
          >
            <option value="all">All Feedback</option>
            <option value="anonymous">Anonymous Only</option>
            <option value="with-thread">With Thread</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white border rounded-xl divide-y">
        {filteredFeedbacks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No feedback found</p>
          </div>
        ) : (
          filteredFeedbacks.map((fb) => (
            <div key={fb.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    fb.isAnonymous ? "bg-gray-400" : "bg-[#1e3a5f]"
                  }`}>
                    {fb.initials}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#1e3a5f]">
                        {fb.user}
                      </span>
                      <span className="text-gray-400 text-sm">on</span>
                      <span className="text-xs font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                        #{fb.referenceNumber}
                      </span>
                      {fb.isAnonymous && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          Anonymous
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{fb.timestamp}</span>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {fb.comment}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                      <Reply className="w-3.5 h-3.5" />
                      Reply
                    </button>
                    {fb.hasThread && (
                      <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                        View thread
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e3a5f]">{feedbacks.length}</p>
              <p className="text-xs text-gray-500">Total Feedback</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e3a5f]">
                {feedbacks.filter((fb) => fb.hasThread).length}
              </p>
              <p className="text-xs text-gray-500">With Threads</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1e3a5f]">
                {feedbacks.filter((fb) => fb.isAnonymous).length}
              </p>
              <p className="text-xs text-gray-500">Anonymous</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
import React, { useEffect, useState } from "react";
import { MessageSquare, Reply, ExternalLink, Search, Filter } from "lucide-react";
import api from "../../services/api";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    api.get("/comments/?ordering=-created_at")
      .then(res => {
        setFeedbacks(res.data.map(c => ({
          id: c.id,
          user: c.author_name || c.author?.username || "Anonymous",
          initials: ((c.author_name || c.author?.username || "A")[0] || "A").toUpperCase(),
          referenceNumber: c.infrastructure_issue || c.community_concern || "N/A",
          comment: c.body,
          timestamp: c.created_at ? new Date(c.created_at).toLocaleDateString() : "recent",
          isAnonymous: !c.author,
          hasThread: false,
        })));
      })
      .catch(() => {
        setFeedbacks([]);
      });
  }, []);

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesSearch = searchTerm === "" ||
      fb.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" ||
      (filter === "anonymous" && fb.isAnonymous) ||
      (filter === "with-thread" && fb.hasThread);
    return matchesSearch && matchesFilter;
  });

  const handleReply = (fb) => {
    setReplyTo(fb);
    setReplyText("");
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    try {
      await api.post("/comments/", {
        infrastructure_issue: typeof replyTo.referenceNumber === "number" ? replyTo.referenceNumber : null,
        community_concern: typeof replyTo.referenceNumber !== "number" ? null : null,
        body: replyText,
      });
      alert("Reply posted!");
      setReplyTo(null);
      setReplyText("");
    } catch (err) {
      alert("Could not post reply. " + (err.response?.data?.detail || err.message));
    }
  };

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

      {/* Reply Modal */}
      {replyTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setReplyTo(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#1e3a5f] mb-2">Reply to {replyTo.user}</h3>
            <p className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg italic">"{replyTo.comment}"</p>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316] resize-none mb-4"
            />
            <div className="flex gap-2">
              <button onClick={() => setReplyTo(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={submitReply} className="flex-1 px-4 py-2 bg-[#f97316] text-white rounded-lg hover:bg-orange-600 transition-colors">Send Reply</button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#1e3a5f]">{fb.user}</span>
                      <span className="text-gray-400 text-sm">on</span>
                      <span className="text-xs font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded">#{fb.referenceNumber}</span>
                      {fb.isAnonymous && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Anonymous</span>}
                    </div>
                    <span className="text-xs text-gray-400">{fb.timestamp}</span>
                  </div>

                  <p className="text-gray-700 mb-3 leading-relaxed">{fb.comment}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(fb)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
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
              <p className="text-2xl font-bold text-[#1e3a5f]">{feedbacks.filter((fb) => fb.hasThread).length}</p>
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
              <p className="text-2xl font-bold text-[#1e3a5f]">{feedbacks.filter((fb) => fb.isAnonymous).length}</p>
              <p className="text-xs text-gray-500">Anonymous</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

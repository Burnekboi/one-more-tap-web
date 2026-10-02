import React, { useState, useMemo } from 'react';
import { DOCUMENTATION_SECTIONS } from '../data/documentationData';
import { DocumentationSection } from '../types';
import { sound } from '../utils/audio';
import {
  Search,
  BookOpen,
  Copy,
  Check,
  Tag,
  Code2,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';

export function DocumentationView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = ['All', 'Overview', 'Gameplay', 'Systems', 'Architecture', 'Retention', 'Production'];

  const filteredSections = useMemo(() => {
    return DOCUMENTATION_SECTIONS.filter((sec) => {
      const matchesCategory = selectedCategory === 'All' || sec.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        sec.title.toLowerCase().includes(q) ||
        sec.summary.toLowerCase().includes(q) ||
        sec.content.toLowerCase().includes(q) ||
        sec.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleCopySection = (sec: DocumentationSection) => {
    sound.playButton();
    const textToCopy = `=== ${sec.title} ===\n\n${sec.summary}\n\n${sec.content}${
      sec.codeSnippet ? `\n\n\`\`\`typescript\n${sec.codeSnippet}\n\`\`\`` : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(sec.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollToSection = (id: number) => {
    sound.playButton();
    const element = document.getElementById(`doc-section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Search Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-0.5 rounded-full">
                Complete Specification
              </span>
              <span className="text-xs font-mono text-zinc-400">All 50 Development Sections</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ONE MORE TAP <span className="text-zinc-400 font-normal text-lg sm:text-xl">Documentation</span>
            </h1>
            <p className="text-zinc-300 text-xs sm:text-sm mt-1 max-w-xl">
              Cocos Creator Mini Game architecture, game design rules, fairness validation, and
              client-side lifecycle.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-80 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 50 sections, keywords, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playButton();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat} {cat === 'All' ? `(${DOCUMENTATION_SECTIONS.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Sidebar Section Navigator + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sticky Section Index Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-3 flex items-center justify-between">
              <span>Section Navigator</span>
              <span className="text-[10px] text-cyan-400">1–50</span>
            </div>
            <div className="space-y-1 pr-1">
              {filteredSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors truncate block flex items-center justify-between group"
                >
                  <span className="truncate">{sec.title}</span>
                  <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Stream (50 Sections) */}
        <div className="lg:col-span-3 space-y-6">
          {filteredSections.length === 0 ? (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center">
              <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <div className="text-base font-bold text-zinc-300">No matching documentation sections</div>
              <p className="text-xs text-zinc-500 mt-1">
                Try searching for terms like &ldquo;Cocos&rdquo;, &ldquo;Combo&rdquo;, &ldquo;Save&rdquo;, or &ldquo;Daily&rdquo;.
              </p>
            </div>
          ) : (
            filteredSections.map((sec) => (
              <article
                key={sec.id}
                id={`doc-section-${sec.id}`}
                className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 transition-all hover:border-zinc-700/80 scroll-mt-24"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase bg-zinc-800 text-cyan-400 px-2 py-0.5 rounded">
                        {sec.category}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">Section {sec.id}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {sec.title}
                    </h2>
                  </div>

                  {/* 1-Click Copy Section Button */}
                  <button
                    onClick={() => handleCopySection(sec)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-zinc-700 transition-colors shrink-0"
                    title="Copy section markdown"
                  >
                    {copiedId === sec.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Summary Box */}
                <div className="my-4 p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 font-medium leading-relaxed">
                  <strong className="text-cyan-400 mr-1">Summary:</strong>
                  {sec.summary}
                </div>

                {/* Main Content Body */}
                <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
                  {sec.content}
                </div>

                {/* Optional Code Snippet */}
                {sec.codeSnippet && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                    <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        TypeScript Spec
                      </span>
                    </div>
                    <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                      <code>{sec.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Tags */}
                <div className="flex items-center gap-1.5 mt-5 flex-wrap pt-3 border-t border-zinc-800/60">
                  <Tag className="w-3 h-3 text-zinc-500" />
                  {sec.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

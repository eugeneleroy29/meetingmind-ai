'use client';

import React, { useState } from 'react';
import { ActionItem } from '@/types/meeting';
import { CheckCircle2, Circle, Clock, User, Copy, Check, Filter } from 'lucide-react';

interface ActionItemsBoardProps {
  items: ActionItem[];
  onToggleItem: (id: string) => void;
}

export const ActionItemsBoard: React.FC<ActionItemsBoardProps> = ({ items, onToggleItem }) => {
  const [filter, setFilter] = useState<'ALL' | 'High' | 'Medium' | 'Low'>('ALL');
  const [copied, setCopied] = useState(false);

  const filteredItems = items.filter((item) => {
    if (filter === 'ALL') return true;
    return item.priority === filter;
  });

  const completedCount = items.filter((i) => i.completed).length;

  const handleCopyAll = () => {
    const text = items
      .map(
        (i) =>
          `[${i.completed ? 'x' : ' '}] ${i.task} (Assignee: @${i.owner} | Due: ${i.deadline} | Priority: ${i.priority})`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Low':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-100">Action Items & Deliverables</h3>
            <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full">
              {completedCount} / {items.length} completed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Assigned tasks with deadlines and owners</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority Filter */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            {(['ALL', 'High', 'Medium', 'Low'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  filter === p
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Export'}
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-slate-800/60 mt-2">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            No action items match the selected filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`py-3.5 px-3 -mx-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 hover:bg-slate-800/40 ${
                item.completed ? 'opacity-50' : ''
              }`}
            >
              <button
                className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                aria-label="Toggle completed"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium text-slate-200 leading-snug ${
                    item.completed ? 'line-through text-slate-500' : ''
                  }`}
                >
                  {item.task}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs">
                  {/* Owner */}
                  <span className="flex items-center gap-1 text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded border border-slate-700/50">
                    <User className="w-3 h-3 text-blue-400" />
                    {item.owner}
                  </span>

                  {/* Deadline */}
                  <span className="flex items-center gap-1 text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded border border-slate-700/50">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {item.deadline}
                  </span>

                  {/* Priority Badge */}
                  <span
                    className={`border px-2 py-0.5 rounded text-[11px] font-semibold ${getPriorityBadge(
                      item.priority
                    )}`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
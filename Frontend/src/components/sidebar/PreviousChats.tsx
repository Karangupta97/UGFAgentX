import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { groupSessionsByDate, truncateSessionTitle } from '../../lib/chatSessions';
import { cn } from '../../lib/utils';

function SessionRow({
  title,
  isActive,
  onSelect,
  onDelete,
}: {
  title: string;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setConfirmDelete(false);
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'relative w-full text-left py-2.5 px-3 rounded-lg transition-all duration-150 pr-8',
          isActive
            ? 'bg-[var(--bg-surface-3)] text-[var(--text-1)]'
            : 'text-[var(--text-2)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-1)]'
        )}
      >
        {isActive && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3.5 rounded-sm bg-[var(--accent)]"
            aria-hidden
          />
        )}
        <span className={cn('block text-sm truncate', isActive && 'pl-1')}>
          {truncateSessionTitle(title)}
        </span>
        {(hovered || confirmDelete) && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              if (!confirmDelete) setConfirmDelete(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                setConfirmDelete(true);
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--danger)] text-sm leading-none"
            aria-label="Delete chat"
          >
            ×
          </span>
        )}
      </button>
      {confirmDelete && (
        <div
          className="absolute right-0 top-full z-10 mt-1 flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-2 py-1 text-[11px]"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[var(--text-2)]">Delete?</span>
          <button type="button" onClick={onDelete} className="text-[var(--danger)]">
            Yes
          </button>
          <button type="button" onClick={() => setConfirmDelete(false)} className="text-[var(--text-3)]">
            No
          </button>
        </div>
      )}
    </div>
  );
}

export function PreviousChats() {
  const {
    chatSessions,
    activeSeshId,
    sessionsLoading,
    wallet,
    loadChatSessions,
    loadSession,
    deleteSession,
  } = useStore();

  useEffect(() => {
    if (wallet.isConnected && wallet.address && wallet.token) {
      void loadChatSessions();
    }
  }, [wallet.isConnected, wallet.address, wallet.token, loadChatSessions]);

  const groups = groupSessionsByDate(chatSessions);

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <p className="text-[11px] uppercase tracking-wider text-[var(--text-3)] px-2 mb-2">
        Previous Chats
      </p>
      <div className="flex-1 overflow-y-auto min-h-0">
        {sessionsLoading ? (
          <div className="px-2 space-y-2 animate-pulse">
            {[60, 75, 50].map((w) => (
              <div
                key={w}
                className="h-10 rounded-lg bg-[var(--bg-surface)]"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : chatSessions.length === 0 ? (
          <div className="flex flex-col items-center text-center py-6 px-2">
            <MessageSquare className="w-5 h-5 text-[var(--text-3)] mb-2" />
            <p className="text-sm text-[var(--text-2)]">No chats yet</p>
            <p className="text-xs text-[var(--text-3)] mt-1">Start a conversation above</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <p className="text-[11px] text-[var(--text-3)] px-2 mt-3 mb-1 first:mt-0">
                {group.label}
              </p>
              {group.sessions.map((session) => (
                <SessionRow
                  key={session.id}
                  title={session.title}
                  isActive={activeSeshId === session.id}
                  onSelect={() => void loadSession(session.id)}
                  onDelete={() => void deleteSession(session.id)}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

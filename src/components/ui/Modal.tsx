import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, Check, Copy, Share2, Plus, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '@/context/ToastContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-border p-4 sm:p-6 shadow-2xl mx-2 sm:mx-auto"
        >
          <div className="flex items-center justify-between border-b border-border pb-3 sm:pb-4 mb-4">
            <h3 className="text-lg sm:text-xl font-bold font-heading text-text-main leading-tight">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-text-muted hover:bg-background hover:text-text-main transition-colors shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function AuthModal({ isOpen, onClose, initialTab = 'login' }: { isOpen: boolean; onClose: () => void; initialTab?: 'login' | 'signup' }) {
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'warning');
      return;
    }
    if (tab === 'login') {
      showToast('Logged in successfully!', 'success');
    } else {
      showToast('Account created successfully! Welcome to STATIQDATA.', 'success');
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tab === 'login' ? 'Welcome Back' : 'Create an Account'}>
      <div className="flex rounded-lg bg-background p-1 mb-6 border border-border">
        <button
          onClick={() => setTab('login')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${tab === 'login' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
        >
          Log In
        </button>
        <button
          onClick={() => setTab('signup')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${tab === 'signup' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            <input
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none focus:border-primary"
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 mt-2 shadow-md">
          {tab === 'login' ? 'Sign In' : 'Create Free Account'}
        </Button>
      </form>
    </Modal>
  );
}

export function ShareModal({ isOpen, onClose, title = 'Share Insight' }: { isOpen: boolean; onClose: () => void; title?: string }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Share link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-text-muted mb-4">
        Share this dataset or report with teammates or export a public share link.
      </p>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-2 mb-6">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="w-full bg-transparent px-2 text-xs font-mono text-text-main outline-none"
        />
        <Button size="sm" onClick={handleCopy} className="shrink-0 bg-primary text-white">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>Done</Button>
      </div>
    </Modal>
  );
}

export function CreateWorkspaceModal({
  isOpen,
  onClose,
  onCreate
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a workspace name', 'warning');
      return;
    }
    onCreate(name, description);
    showToast(`Workspace "${name}" created!`, 'success');
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Workspace">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Workspace Name</label>
          <input
            type="text"
            placeholder="e.g. Q4 Competitor Analysis"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-text-main outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Description (Optional)</label>
          <textarea
            placeholder="Brief summary of data stories & reports inside..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-background py-2.5 px-4 text-sm text-text-main outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-semibold">
            <Plus className="h-4 w-4 mr-1.5" /> Create Workspace
          </Button>
        </div>
      </form>
    </Modal>
  );
}

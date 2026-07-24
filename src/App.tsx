import React, { useState, useEffect } from 'react';
import { AppConfig, HubCardItem, QuickNoteItem, TestimonialItem } from './types';
import { INITIAL_CONFIG, INITIAL_NOTES, INITIAL_TESTIMONIALS } from './data/initialConfig';
import { PinLockScreen } from './components/PinLockScreen';
import { Header } from './components/Header';
import { DashboardGrid } from './components/DashboardGrid';
import { WatercolorBackground } from './components/WatercolorBackground';
import { QuickNotesModal } from './components/QuickNotesModal';
import { PressKitModal } from './components/PressKitModal';
import { TestimonialsModal } from './components/TestimonialsModal';
import { HubConfigModal } from './components/HubConfigModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

import { MobileNav } from './components/MobileNav';
import { PublicTestimonialView } from './components/PublicTestimonialView';
import { LoadingScreen } from './components/LoadingScreen';

const MIN_LOADING_MS = 150;
const LOADING_FADE_MS = 250;

export default function App() {
  // Branded splash overlay: waits for web fonts + a minimum display time, then fades out.
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [isLoadingLeaving, setIsLoadingLeaving] = useState<boolean>(false);

  useEffect(() => {
    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, MIN_LOADING_MS));
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();

    Promise.all([minDelay, fontsReady]).then(() => {
      setIsLoadingLeaving(true);
      setTimeout(() => setShowLoading(false), LOADING_FADE_MS);
    });
  }, []);

  // Public Testimonial Route Check
  const [isPublicTestimonialMode, setIsPublicTestimonialMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      return hash.includes('testimonio') || search.includes('testimonio');
    }
    return false;
  });
  // LocalStorage State Initialization
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    const savedUnlocked = localStorage.getItem('nora_hub_unlocked');
    return savedUnlocked === 'true';
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('nora_hub_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CONFIG;
      }
    }
    return INITIAL_CONFIG;
  });

  const [notes, setNotes] = useState<QuickNoteItem[]>(() => {
    const saved = localStorage.getItem('nora_hub_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_NOTES;
      }
    }
    return INITIAL_NOTES;
  });

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    const saved = localStorage.getItem('nora_hub_testimonials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TESTIMONIALS;
      }
    }
    return INITIAL_TESTIMONIALS;
  });

  // UI State
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);
  const [isPressKitOpen, setIsPressKitOpen] = useState<boolean>(false);
  const [isTestimonialsOpen, setIsTestimonialsOpen] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isPwaPromptOpen, setIsPwaPromptOpen] = useState<boolean>(false);
  const [editingCardItem, setEditingCardItem] = useState<HubCardItem | null>(null);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState<boolean>(false);

  const [mobileTab, setMobileTab] = useState<'home' | 'notes' | 'press' | 'testimonials' | 'settings'>('home');

  const handleMobileTabSelect = (tab: 'home' | 'notes' | 'press' | 'testimonials' | 'settings') => {
    setMobileTab(tab);
    if (tab === 'home') {
      setIsNotesOpen(false);
      setIsPressKitOpen(false);
      setIsTestimonialsOpen(false);
      setIsConfigOpen(false);
    } else if (tab === 'notes') {
      setIsNotesOpen(true);
    } else if (tab === 'press') {
      setIsPressKitOpen(true);
    } else if (tab === 'testimonials') {
      setIsTestimonialsOpen(true);
    } else if (tab === 'settings') {
      setEditingCardItem(null);
      setIsConfigOpen(true);
    }
  };

  // Lock body scroll while any modal is open, so dragging past a modal's own
  // scroll boundary on mobile can't chain into scrolling the page behind it.
  const isAnyModalOpen = isNotesOpen || isPressKitOpen || isTestimonialsOpen || isConfigOpen || isPwaPromptOpen;
  useEffect(() => {
    document.body.style.overflow = isAnyModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('nora_hub_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('nora_hub_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('nora_hub_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Listen to hash changes for public testimonial direct links
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (hash.includes('testimonio') || search.includes('testimonio')) {
        setIsPublicTestimonialMode(true);
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  // PWA & Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}sw.js`)
        .catch((err) => console.log('SW registration failed:', err));
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen to install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Unlock Handler
  const handleUnlockSuccess = () => {
    setIsUnlocked(true);
    localStorage.setItem('nora_hub_unlocked', 'true');
  };

  // Lock Handler
  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem('nora_hub_unlocked');
  };

  // Card Action Handler
  const handleCardAction = (card: HubCardItem) => {
    if (card.actionType === 'press-kit') {
      setIsPressKitOpen(true);
    } else if (card.actionType === 'testimonials') {
      setIsTestimonialsOpen(true);
    } else if (card.actionType === 'notes') {
      setIsNotesOpen(true);
    } else {
      if (card.url.startsWith('#')) {
        if (card.url === '#prensa') setIsPressKitOpen(true);
        if (card.url === '#testimonios') setIsTestimonialsOpen(true);
        if (card.url === '#proyectos') setIsNotesOpen(true);
      } else {
        window.open(card.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Toggle Card Pin
  const handleTogglePin = (id: string) => {
    const updatedCards = config.cards.map((c) =>
      c.id === id ? { ...c, isPinned: !c.isPinned } : c
    );
    setConfig({ ...config, cards: updatedCards });
  };

  // Save Card (Add or Edit)
  const handleSaveCard = (savedCard: HubCardItem) => {
    const exists = config.cards.some((c) => c.id === savedCard.id);
    let updatedCards: HubCardItem[];
    if (exists) {
      updatedCards = config.cards.map((c) => (c.id === savedCard.id ? savedCard : c));
    } else {
      updatedCards = [savedCard, ...config.cards];
    }
    setConfig({ ...config, cards: updatedCards });
    setEditingCardItem(null);
  };

  // Delete Card
  const handleDeleteCard = (id: string) => {
    const updatedCards = config.cards.filter((c) => c.id !== id);
    setConfig({ ...config, cards: updatedCards });
  };

  // Notes Management
  const handleSaveNote = (newNote: QuickNoteItem) => {
    const exists = notes.some((n) => n.id === newNote.id);
    if (exists) {
      setNotes(notes.map((n) => (n.id === newNote.id ? newNote : n)));
    } else {
      setNotes([newNote, ...notes]);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  // Testimonials Management
  const handleAddTestimonial = (newTestimonial: TestimonialItem) => {
    setTestimonials([newTestimonial, ...testimonials]);
  };

  const handleApproveTestimonial = (id: string) => {
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, isApproved: true } : t)));
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  // PWA Install Trigger
  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsPwaPromptOpen(false);
      }
    } else {
      setIsPwaPromptOpen(true);
    }
  };

  // Reset to default config
  const handleResetToDefault = () => {
    if (window.confirm('¿Deseas restablecer las tarjetas a la configuración inicial predeterminada?')) {
      setConfig(INITIAL_CONFIG);
      setNotes(INITIAL_NOTES);
      setTestimonials(INITIAL_TESTIMONIALS);
    }
  };

  // If public testimonial mode is active (via shared link #dejar-testimonio)
  let content: React.ReactNode;

  if (isPublicTestimonialMode) {
    content = (
      <PublicTestimonialView
        onAddTestimonial={handleAddTestimonial}
        onGoToPortal={() => {
          setIsPublicTestimonialMode(false);
          if (window.location.hash.includes('testimonio')) {
            window.history.pushState('', document.title, window.location.pathname);
          }
        }}
      />
    );
  } else if (!isUnlocked) {
    // If locked, display PIN screen
    content = (
      <PinLockScreen
        correctPin={config.pin}
        onSuccess={handleUnlockSuccess}
        onOpenPublicTestimonials={() => setIsPublicTestimonialMode(true)}
      />
    );
  } else {
    content = (
    <div className="min-h-screen bg-[#F7EFE6] text-[#171512] relative font-body selection:bg-[#B72A32] selection:text-[#F7EFE6] pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-16">
      
      {/* Background Watercolor Artistry */}
      <WatercolorBackground />

      {/* Top Header */}
      <Header
        onOpenNotes={() => setIsNotesOpen(true)}
        onOpenSettings={() => {
          setEditingCardItem(null);
          setIsConfigOpen(true);
        }}
        onOpenPressKit={() => setIsPressKitOpen(true)}
        onOpenTestimonials={() => setIsTestimonialsOpen(true)}
        onOpenAddCard={() => {
          setEditingCardItem(null);
          setIsConfigOpen(true);
        }}
        onLock={handleLock}
        canInstallPwa={Boolean(deferredPrompt) || isIos}
        onInstallPwa={() => setIsPwaPromptOpen(true)}
        notesCount={notes.length}
      />

      {/* Dashboard Card Grid */}
      <main>
        <DashboardGrid
          cards={config.cards}
          onCardAction={handleCardAction}
          onTogglePin={handleTogglePin}
          onEditCard={(card) => {
            setEditingCardItem(card);
            setIsConfigOpen(true);
          }}
          onDeleteCard={handleDeleteCard}
          onOpenAddCard={() => {
            setEditingCardItem(null);
            setIsConfigOpen(true);
          }}
        />
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 flex items-center justify-center py-6 border-t border-[#171512]/10 mt-12">
        <img
          src={`${import.meta.env.BASE_URL}logo-okto.png`}
          alt="Okto"
          className="h-4 w-auto opacity-70"
          draggable={false}
        />
      </footer>

      {/* MODALS */}

      {/* 1. Quick Notes Modal */}
      <QuickNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={notes}
        onSaveNote={handleSaveNote}
        onDeleteNote={handleDeleteNote}
      />

      {/* 2. Press Kit Modal */}
      <PressKitModal
        isOpen={isPressKitOpen}
        onClose={() => setIsPressKitOpen(false)}
        dossierUrl={config.pressDossierUrl}
      />

      {/* 3. Testimonials Modal */}
      <TestimonialsModal
        isOpen={isTestimonialsOpen}
        onClose={() => setIsTestimonialsOpen(false)}
        testimonials={testimonials}
        onAddTestimonial={handleAddTestimonial}
        onApproveTestimonial={handleApproveTestimonial}
        onDeleteTestimonial={handleDeleteTestimonial}
      />

      {/* 4. Configuration & JSON Editor Modal */}
      <HubConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        editingCard={editingCardItem}
        onSaveCard={handleSaveCard}
        onDeleteCard={handleDeleteCard}
        onSaveConfig={setConfig}
        onResetToDefault={handleResetToDefault}
      />

      {/* 5. PWA Install Helper Modal */}
      <PWAInstallPrompt
        isOpen={isPwaPromptOpen}
        onClose={() => setIsPwaPromptOpen(false)}
        onInstall={handleInstallPwa}
        isIos={isIos}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileNav
        activeTab={mobileTab}
        onSelectTab={handleMobileTabSelect}
        onOpenAddCard={() => {
          setEditingCardItem(null);
          setIsConfigOpen(true);
        }}
        notesCount={notes.length}
      />

    </div>
    );
  }

  return (
    <>
      {showLoading && <LoadingScreen isLeaving={isLoadingLeaving} />}
      {content}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import AppArchitect from './components/AppArchitect';
import Footer from './components/Footer';
import LegalContent from './components/LegalContent';
import BurnScroll from './pages/BurnScroll';
import PrivacyPage from "@/pages/burnscroll/privacy";
import TermsPage from "@/pages/burnscroll/terms";
import UseCasesPage from "@/pages/burnscroll/use-cases";
import ContactPage from "@/pages/burnscroll/contact";
import FeaturesPage from "@/pages/burnscroll/features";

type View = 'home' | 'privacy' | 'terms';

const RealmHome: React.FC = () => {
  const [view, setView] = useState<View>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Header onHome={() => setView('home')} />
      <main>
        {view === 'home' ? (
          <>
            <Hero />
            <Services />
            <AppArchitect />
          </>
        ) : (
          <LegalContent type={view === 'privacy' ? 'privacy' : 'terms'} />
        )}
      </main>
      <Footer
        onShowPrivacy={() => setView('privacy')}
        onShowTerms={() => setView('terms')}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RealmHome />} />
        <Route path="/burnscroll" element={<BurnScroll />} />
        <Route path="/burnscroll/privacy" element={<PrivacyPage />} />
        <Route path="/burnscroll/terms" element={<TermsPage />} />
        <Route path="/burnscroll/use-cases" element={<UseCasesPage />} />
        <Route path="/burnscroll/contact" element={<ContactPage />} />
        <Route path="/burnscroll/features" element={<FeaturesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
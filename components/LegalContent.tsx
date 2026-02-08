import React from 'react';

interface LegalContentProps {
  type: 'privacy' | 'terms';
}

const LegalContent: React.FC<LegalContentProps> = ({ type }) => {
  return (
    <div className="pt-40 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black font-outfit mb-12 tracking-tighter text-slate-900 uppercase">
          {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        </h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-8 font-light leading-relaxed">
          {type === 'privacy' ? (
            <>
              <section>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-4">1. Data Transparency</h2>
                <p>Realm Labs respects the privacy of all end-users. In compliance with Apple's Developer Program requirements, we declare that our primary applications do not collect or transmit personal identifiable information (PII) without explicit user consent via standard iOS/Android permission prompts.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-4">2. Collection of Metadata</h2>
                <p>We may collect anonymized technical metadata (e.g., device model, OS version, crash logs) to optimize engineering performance and stability. This data is never linked to individual user accounts.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-4">3. Third-Party Services</h2>
                <p>Applications developed by Realm Labs may utilize secure third-party SDKs (such as Apple's CoreML or Firebase) which operate under their respective privacy protocols. We audit all integrated code to ensure compliance with the App Store Review Guidelines.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-4">4. User Control</h2>
                <p>Users maintain absolute control over their data. Any data stored locally on a device is subject to standard OS encryption protocols. For data deletion requests, contact <strong>support@realmlabs.app</strong>.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-4">1. Acceptance of Terms</h2>
                <p>By accessing the Realm Labs engineering platform or using our developed products, you agree to abide by these Terms of Service and all applicable App Store and Play Store legal requirements.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-4">2. Intellectual Property</h2>
                <p>All source code, design systems, and architectural protocols developed by Realm Labs are the exclusive property of Realm Labs unless otherwise specified in a formal engineering contract. Unauthorized reverse engineering is strictly prohibited.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-4">3. App Store Compliance</h2>
                <p>Our development processes strictly adhere to the Apple Developer Program License Agreement. We do not support or develop applications that bypass standard operating system protections or engage in deceptive data practices.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-4">4. Limitation of Liability</h2>
                <p>Realm Labs provides engineering services and software "as-is." While we strive for 100% uptime and stability, we are not liable for indirect losses resulting from third-party cloud service outages or hardware failures.</p>
              </section>
            </>
          )}
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100">
          <p className="text-xs font-mono-tech text-slate-400 uppercase tracking-widest">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} // Version 1.0.4
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalContent;
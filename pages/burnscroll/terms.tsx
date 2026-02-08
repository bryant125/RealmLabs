import { Navbar } from "@/components/burnscroll/navbar";
import { Footer } from "@/components/burnscroll/footer";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-neon selection:text-black font-sans">
            <Navbar />
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">Terms of Service</h1>
                <p className="text-gray-400 mb-12">Last Updated: January 20, 2026</p>

                <div className="space-y-12 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using BurnScroll (the “Service”), you agree to be bound by these Terms of Service (“Terms”).
                            If you do not agree to these Terms, you may not use the Service. These Terms constitute a legally binding
                            agreement between you and BurnScroll (“we,” “us,” or “our”), governing your use of the BurnScroll mobile
                            application and website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Description of the Service</h2>
                        <p>
                            BurnScroll is a mobile application designed to encourage physical activity by requiring users to perform
                            exercises, such as burning active calories, to earn screen time on social media or other applications. The Service includes
                            gamified features, usage tracking, exercise logs, and time budgeting tools.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Eligibility</h2>
                        <p>
                            You must be at least 9 years old to use the Service. If you are between the ages of 9 and 16
                            (or the applicable age in your jurisdiction), you must have the consent of a parent or legal guardian.
                            By using the Service, you represent that you meet these requirements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. User Accounts</h2>
                        <p>
                            You may be required to register an account using a third-party authentication provider (e.g., Google, Apple).
                            You are responsible for maintaining the confidentiality of your login credentials and for all activities
                            that occur under your account. We reserve the right to suspend or terminate your account if we suspect
                            any unauthorized use or breach of these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Physical Activity Disclaimer</h2>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <p className="mb-4">
                                <strong className="text-white block mb-1">Use at Your Own Risk:</strong>
                                BurnScroll encourages physical activity. By using the Service, you acknowledge that:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-4">
                                <li>You are solely responsible for assessing your own physical fitness and health before engaging in any exercise.</li>
                                <li>You assume full responsibility for any injuries or health issues that may result from using the app or following any suggested activities.</li>
                            </ul>
                            <p>
                                <strong className="text-white block mb-1">Consult a Professional:</strong>
                                If you have any pre-existing medical conditions or concerns, consult a doctor before using the Service.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Limited License</h2>
                        <p>
                            We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the
                            Service for your personal, non-commercial use, subject to these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Prohibited Conduct</h2>
                        <p className="mb-4">You agree not to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Use the Service for any unlawful or fraudulent purpose;</li>
                            <li>Interfere with or disrupt the operation of the Service;</li>
                            <li>Reverse engineer, decompile, or disassemble any aspect of the Service;</li>
                            <li>Circumvent or attempt to bypass any time restrictions or gamified challenges;</li>
                            <li>Use the Service to harass, abuse, or harm another person.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. In-App Purchases and Subscriptions</h2>
                        <p>
                            The Service may offer in-app purchases and subscriptions managed by third-party providers (e.g., E.g Apple).
                            By making any purchases, you agree to the respective payment processor’s terms and conditions.
                            All payments are final unless otherwise stated by applicable law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
                        <p>
                            We may suspend or terminate your access to the Service at any time, with or without notice, if you violate
                            these Terms or for any other reason. You may also delete your account at any time by contacting us at
                            support@realmlabs.app
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Intellectual Property</h2>
                        <p>
                            All content, branding, and technology used in the Service are owned by or licensed to BurnScroll and are
                            protected by intellectual property laws. You may not copy, modify, or distribute any part of the Service
                            without our prior written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Disclaimer of Warranties</h2>
                        <p>
                            The Service is provided “as is” and “as available,” without warranties of any kind. We disclaim all
                            warranties, express or implied, including fitness for a particular purpose and non-infringement.
                            We do not guarantee that the Service will be uninterrupted or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">12. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, BurnScroll shall not be liable for any indirect, incidental,
                            special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill.
                            Our total liability for any claims arising out of or related to the use of the Service is limited to the
                            amount you paid us (if any) in the 12 months preceding the claim.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">13. Indemnification</h2>
                        <p>
                            You agree to defend, indemnify, and hold harmless BurnScroll, its affiliates, and service providers from
                            any claims, liabilities, damages, losses, and expenses arising from your use of the Service or your
                            violation of these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">14. Changes to the Terms</h2>
                        <p>
                            We may update these Terms from time to time. We will notify you of changes by updating the "Last Updated"
                            date at the top of this page. Continued use of the Service after any changes means you accept the revised Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">15. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of Germany, without regard to
                            its conflict of law principles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">16. Contact</h2>
                        <p>
                            If you have any questions about these Terms, please contact us:<br />
                            <strong className="text-white">Email:</strong> support@realmlabs.app
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}

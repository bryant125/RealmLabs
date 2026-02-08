import { Navbar } from "@/components/burnscroll/navbar";
import { Footer } from "@/components/burnscroll/footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-neon selection:text-black font-sans">
            <Navbar />
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">Privacy Policy</h1>
                <p className="text-gray-400 mb-12">Last Updated: January 18, 2026</p>

                <div className="space-y-12 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>
                            Welcome to BurnScroll. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                            information when you use our BurnScroll mobile application and website (collectively, the "Service").
                        </p>
                        <p className="mt-4">
                            Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you
                            have read, understood, and agree to be bound by all the terms of this Privacy Policy and our Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Who We Are</h2>
                        <p>
                            BurnScroll is a mobile application that encourages physical activity by requiring users to perform exercises
                            (such as heavy cardio) in order to earn scrolling time on social media and other applications.
                        </p>
                        <p className="mt-4">
                            <strong>Contact Information:</strong><br />
                            Email: support@realmlabs.app
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Information We Collect</h2>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1 Information You Provide to Us</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li><strong>Account Information:</strong> When you register for an account, we collect information necessary to set up and maintain your account, such as your email address, name, and other identifying information provided through third-party authentication services (Google, Apple).</li>
                            <li><strong>User Content:</strong> Information you provide when using the Service, such as profile information or content you share if you use social features.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2 Information We Collect Automatically</h3>
                        <ul className="list-disc pl-5 space-y-2 mb-4">
                            <li><strong>Usage Data:</strong> Information about your activity on the Service, including exercise data (active calories burned), streak information, time budget usage, historical statistics, and session duration.</li>
                            <li><strong>Device Information:</strong> Information about your mobile device and internet connection, including device type, operating system, unique device identifiers, mobile network information, and IP address.</li>
                            <li><strong>App Usage Information:</strong> Through the screen time API on iOS and equivalent on Android, we collect information about the time you spend on various applications. We do not collect information about specific content viewed within those applications.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.3 Face Data and Exercise Detection</h3>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 my-4">
                            <ul className="list-disc pl-5 space-y-2">
                                <li>
                                    <strong>How We Use Face Data:</strong> BurnScroll does NOT use facial recognition. We use your device's camera only if you opt for camera-based exercises to verify completion.
                                </li>
                                <li>
                                    <strong>No Storage or Transmission:</strong> We do not collect, store, or retain any face data. All processing occurs entirely on your device in real-time and is immediately discarded. Face data never leaves your device.
                                </li>
                                <li>
                                    <strong>Why We Don't Store Face Data:</strong> We prioritize your privacy. Exercise detection works in real-time without needing to store facial data.
                                </li>
                                <li>
                                    <strong>No Third-Party Sharing:</strong> We do not share face data with any third parties.
                                </li>
                            </ul>
                        </div>

                        <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.4 Information from Third Parties</h3>
                        <p>
                            We may receive information about you from third-party services when you choose to connect your account (such as Google or Apple for authentication).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to provide and maintain the Service, manage your account, track exercise statistics, improve user experience, and comply with legal obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing and Disclosure</h2>
                        <p>
                            We may share your information with service providers like Supabase (hosting), Superwall (payments), and Google Analytics (performance monitoring). We may also disclose information for legal requirements or business transfers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Social Features</h2>
                        <p>
                            Future social features may allow you to connect with friends, and additional privacy controls will be provided when implemented.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
                        <p>
                            We retain your personal information as long as your account is active. If you delete your account, we will delete or anonymize your personal information unless required by law to retain it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Data Security</h2>
                        <p>
                            We implement appropriate measures to protect your information, though no online transmission is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
                        <p>
                            The Service is intended for users 13 and older. We do not knowingly collect data from children under 13.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Your Data Protection Rights</h2>
                        <p>
                            You may have rights including Access, Rectification, Erasure, Restriction, Data Portability, and Right to Object. Contact us at support@realmlabs.app to exercise these rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. International Data Transfers</h2>
                        <p>
                            Your information may be processed in countries other than your own with appropriate safeguards in place.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">12. Cookies and Similar Technologies</h2>
                        <p>
                            We use cookies to track activity and hold certain information. You can adjust your browser settings to refuse cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">13. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this policy periodically and will notify you of any changes by updating the "Last Updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">14. Contact Us</h2>
                        <p>
                            <strong>Email:</strong> support@realmlabs.app
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}

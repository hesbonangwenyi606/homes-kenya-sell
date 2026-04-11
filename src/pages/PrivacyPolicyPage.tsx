import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, Shield } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h2>
    <div className="space-y-3 text-gray-600 dark:text-gray-300 leading-relaxed">{children}</div>
  </div>
);

const PrivacyPolicyPage: React.FC = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="w-16 h-16 bg-emerald-600/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-300">Last updated: April 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-10">
            <p className="text-emerald-800 dark:text-emerald-300 text-sm leading-relaxed">
              Hemaprin Homes ("we", "our", "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, share, and protect your data when you use our website and services. By using our platform, you agree to the practices described in this policy.
            </p>
          </div>

          <Section title="1. Information We Collect">
            <p><strong className="text-gray-800 dark:text-gray-200">Personal Information:</strong> When you submit an inquiry, contact form, or lead form on our platform, we collect your full name, email address, phone number, and any additional information you provide.</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Property Preferences:</strong> We collect details about your property search including budget range, preferred locations, property type, number of bedrooms, and your purpose (buying, renting, or investing).</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Newsletter Subscriptions:</strong> If you subscribe to our newsletter, we collect and store your email address.</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Usage Data:</strong> We automatically collect information about how you interact with our website, including pages visited, time spent, browser type, device type, and referring URLs.</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Communications:</strong> When you contact us via phone, email, or WhatsApp, we may retain records of those communications.</p>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Connect you with relevant properties and our sales agents</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you property listings, market updates, and newsletters (only if you have subscribed)</li>
              <li>Improve and personalise your experience on our platform</li>
              <li>Analyse website performance and usage patterns</li>
              <li>Comply with applicable Kenyan laws and regulations</li>
              <li>Prevent fraud and ensure the security of our platform</li>
            </ul>
          </Section>

          <Section title="3. Sharing Your Information">
            <p>We do not sell your personal data to third parties. We may share your information in the following limited circumstances:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-gray-800 dark:text-gray-200">Our Agents:</strong> We share your contact details with our vetted property agents in order to respond to your specific property inquiry.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Service Providers:</strong> We use trusted third-party services for email delivery, analytics, and website hosting. These providers process data only on our behalf.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Legal Requirements:</strong> We may disclose your information if required to do so by Kenyan law, court order, or government authority.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Business Transfer:</strong> In the event of a merger or acquisition, your information may be transferred to the new entity, subject to the same privacy protections.</li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Specifically:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Lead and inquiry data is retained for up to 3 years</li>
              <li>Newsletter subscriber data is retained until you unsubscribe</li>
              <li>Website analytics data is retained for up to 24 months</li>
            </ul>
            <p>You may request deletion of your data at any time by contacting us at <a href="mailto:hemaprinhomes@gmail.com" className="text-emerald-600 hover:underline">hemaprinhomes@gmail.com</a>.</p>
          </Section>

          <Section title="5. Cookies">
            <p>Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyse traffic, and personalise content. For full details on how we use cookies, please read our <Link to="/cookie-policy" className="text-emerald-600 hover:underline">Cookie Policy</Link>.</p>
            <p>You can control cookie settings through your browser. Disabling cookies may affect some features of our website.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>Under applicable Kenyan data protection law (the Data Protection Act, 2019), you have the following rights:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-gray-800 dark:text-gray-200">Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Deletion:</strong> Request that we delete your personal data</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Objection:</strong> Object to how we process your data for direct marketing</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Portability:</strong> Request a copy of your data in a portable format</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:hemaprinhomes@gmail.com" className="text-emerald-600 hover:underline">hemaprinhomes@gmail.com</a>. We will respond within 30 days.</p>
          </Section>

          <Section title="7. Data Security">
            <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or disclosure. These include secure server infrastructure, access controls, and encrypted data transmission (HTTPS).</p>
            <p>However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
          </Section>

          <Section title="8. Third-Party Links">
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those websites and encourage you to read their privacy policies before providing any personal information.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>Our services are not directed at individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify users of significant changes by posting the updated policy on this page with a revised "Last updated" date. Your continued use of our platform after such changes constitutes your acceptance of the updated policy.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions, concerns, or requests relating to this Privacy Policy, please contact us:</p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mt-3">
              <p className="font-semibold text-gray-900 dark:text-white">Hemaprin Homes</p>
              <p>Arcade House, 1st Floor, Nairobi, Kenya</p>
              <p>Email: <a href="mailto:hemaprinhomes@gmail.com" className="text-emerald-600 hover:underline">hemaprinhomes@gmail.com</a></p>
              <p>Phone: <a href="tel:+254725604549" className="text-emerald-600 hover:underline">+254 725 604 549</a></p>
            </div>
          </Section>
        </div>
      </section>
    </PageLayout>
  );
};

export default PrivacyPolicyPage;

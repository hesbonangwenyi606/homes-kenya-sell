import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, Cookie } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h2>
    <div className="space-y-3 text-gray-600 dark:text-gray-300 leading-relaxed">{children}</div>
  </div>
);

interface CookieRowProps { name: string; type: string; purpose: string; duration: string; }
const CookieRow: React.FC<CookieRowProps> = ({ name, type, purpose, duration }) => (
  <tr className="border-b border-gray-100 dark:border-gray-700 last:border-0">
    <td className="py-3 pr-4 font-mono text-xs text-emerald-700 dark:text-emerald-400 align-top whitespace-nowrap">{name}</td>
    <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400 align-top">{type}</td>
    <td className="py-3 pr-4 text-sm text-gray-600 dark:text-gray-300 align-top">{purpose}</td>
    <td className="py-3 text-xs text-gray-500 dark:text-gray-400 align-top whitespace-nowrap">{duration}</td>
  </tr>
);

const CookiePolicyPage: React.FC = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="w-16 h-16 bg-emerald-600/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-gray-300">Last updated: April 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-10">
            <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
              This Cookie Policy explains what cookies are, how Hemaprin Homes uses them on our website, and the choices available to you regarding their use. By continuing to use our website, you consent to our use of cookies as described in this policy.
            </p>
          </div>

          <Section title="1. What Are Cookies?">
            <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They allow the website to recognise your device, remember your preferences, and improve your browsing experience.</p>
            <p>Cookies do not contain personally identifiable information on their own, though they can be used alongside other data to identify you. Some cookies are placed by the website you are visiting (first-party cookies), while others are placed by third-party services (third-party cookies).</p>
          </Section>

          <Section title="2. Types of Cookies We Use">
            <p>We use the following categories of cookies on the Hemaprin Homes website:</p>

            <div className="space-y-5 mt-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Strictly Necessary Cookies</h3>
                  <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">Always Active</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">These cookies are essential for the website to function correctly. They enable core features such as security, admin authentication, and page navigation. The website cannot function properly without these cookies and they cannot be disabled.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Performance & Analytics Cookies</h3>
                  <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">Optional</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This allows us to improve our platform and provide a better user experience.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0" />
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Functional Cookies</h3>
                  <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">Optional</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">These cookies allow the website to remember choices you have made — such as your preferred theme (light/dark mode) — to provide a more personalised experience.</p>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Third-Party & Social Media Cookies</h3>
                  <span className="ml-auto text-xs bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full">Optional</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Our website may include integrations with third-party services such as WhatsApp chat and social media platforms. These services may set their own cookies on your device. We have no control over these cookies and recommend reviewing the respective privacy policies.</p>
              </div>
            </div>
          </Section>

          <Section title="3. Specific Cookies We Use">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-600">
                    <th className="pb-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pr-4">Cookie Name</th>
                    <th className="pb-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pr-4">Type</th>
                    <th className="pb-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 pr-4">Purpose</th>
                    <th className="pb-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <CookieRow name="admin_token" type="Necessary" purpose="Stores the admin authentication token to maintain secure dashboard sessions" duration="Session" />
                  <CookieRow name="vite-ui-theme" type="Functional" purpose="Remembers your preferred colour theme (light or dark mode)" duration="1 year" />
                  <CookieRow name="_ga" type="Analytics" purpose="Google Analytics — distinguishes unique users and tracks page visits" duration="2 years" />
                  <CookieRow name="_ga_*" type="Analytics" purpose="Google Analytics — maintains session state for analytics tracking" duration="2 years" />
                  <CookieRow name="wa_*" type="Third-party" purpose="WhatsApp — set when the WhatsApp chat widget is loaded" duration="Session" />
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. How to Control Cookies">
            <p>You have several options to control or limit how cookies are used:</p>

            <p><strong className="text-gray-800 dark:text-gray-200">Browser Settings:</strong> Most web browsers allow you to manage cookie settings. You can configure your browser to refuse all cookies, delete existing cookies, or notify you when a cookie is set. Here are links to cookie management guides for common browsers:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Google Chrome: Settings → Privacy and security → Cookies</li>
              <li>Mozilla Firefox: Options → Privacy & Security → Cookies</li>
              <li>Safari: Preferences → Privacy → Cookies</li>
              <li>Microsoft Edge: Settings → Privacy, search, and services → Cookies</li>
            </ul>

            <p><strong className="text-gray-800 dark:text-gray-200">Impact of Disabling Cookies:</strong> Please note that disabling certain cookies may affect the functionality of our website. Strictly necessary cookies cannot be disabled as they are required for the site to work. Disabling analytics or functional cookies will not prevent you from using the site but may reduce the quality of your experience.</p>

            <p><strong className="text-gray-800 dark:text-gray-200">Opt-Out Tools:</strong> For analytics cookies, you can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Google Analytics Opt-out Browser Add-on</a>.</p>
          </Section>

          <Section title="5. Cookies and Personal Data">
            <p>Some cookies we use may be considered personal data under Kenyan law (Data Protection Act, 2019) when combined with other information. We handle any personal data collected through cookies in accordance with our <Link to="/privacy-policy" className="text-emerald-600 hover:underline">Privacy Policy</Link>.</p>
          </Section>

          <Section title="6. Updates to This Policy">
            <p>We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed. The "Last updated" date at the top of this page indicates when the policy was last revised.</p>
          </Section>

          <Section title="7. Contact Us">
            <p>If you have questions about our use of cookies or this Cookie Policy, please contact us:</p>
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

export default CookiePolicyPage;

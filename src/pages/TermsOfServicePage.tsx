import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, FileText } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h2>
    <div className="space-y-3 text-gray-600 dark:text-gray-300 leading-relaxed">{children}</div>
  </div>
);

const TermsOfServicePage: React.FC = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="w-16 h-16 bg-emerald-600/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-300">Last updated: April 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-10">
            <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
              Please read these Terms of Service carefully before using the Hemaprin Homes website and services. By accessing or using our platform, you agree to be bound by these terms. If you do not agree, please do not use our services.
            </p>
          </div>

          <Section title="1. About Hemaprin Homes">
            <p>Hemaprin Homes is a real estate agency based in Nairobi, Kenya, operating from Arcade House, 1st Floor. We provide property listing, buying, selling, and investment advisory services across Kenya. Our platform connects property buyers, sellers, and investors with verified listings and qualified agents.</p>
          </Section>

          <Section title="2. Eligibility">
            <p>By using our platform, you confirm that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into binding agreements under Kenyan law</li>
              <li>You are using the platform for lawful purposes only</li>
              <li>The information you provide to us is accurate and complete</li>
            </ul>
          </Section>

          <Section title="3. Use of Our Platform">
            <p>You may use our platform to browse property listings, submit inquiries, contact agents, and access property market information. You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the platform for any unlawful or fraudulent purpose</li>
              <li>Submit false, misleading, or inaccurate information</li>
              <li>Scrape, copy, or republish our property listings without written consent</li>
              <li>Attempt to gain unauthorised access to any part of our systems</li>
              <li>Use automated tools to access or interact with our platform</li>
              <li>Harass, abuse, or threaten our staff, agents, or other users</li>
              <li>Post or transmit spam, malicious code, or unsolicited communications</li>
            </ul>
          </Section>

          <Section title="4. Property Listings">
            <p><strong className="text-gray-800 dark:text-gray-200">Accuracy:</strong> We take reasonable steps to verify the accuracy of property listings, including confirming title deed status, ownership, and property details. However, we do not guarantee that all listing information is complete, current, or error-free.</p>
            <p><strong className="text-gray-800 dark:text-gray-200">No Guarantee of Availability:</strong> Listing a property on our platform does not guarantee its availability for purchase or rental. Properties may be sold, let, or withdrawn at any time.</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Pricing:</strong> Prices displayed on our platform are indicative and subject to change. Final prices are agreed directly between buyer and seller. Hemaprin Homes is not a party to any property transaction.</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Due Diligence:</strong> You are responsible for conducting your own due diligence before entering into any property transaction. We strongly recommend engaging a qualified lawyer and conducting a land search at the Lands Registry.</p>
          </Section>

          <Section title="5. Agency Relationship">
            <p>Hemaprin Homes acts as a facilitator and intermediary. We connect buyers with sellers and manage the inquiry process. We are not a party to any sale, purchase, or rental agreement between buyers and sellers. Any binding agreement is solely between the relevant parties.</p>
            <p>Our agents are authorised to provide property information and facilitate negotiations, but are not authorised to make representations or warranties on behalf of property owners unless expressly agreed in writing.</p>
          </Section>

          <Section title="6. Fees and Commissions">
            <p>Our commission structure and service fees are communicated separately and agreed upon before we undertake any engagement on your behalf. No fees are payable simply for browsing listings or submitting an inquiry through our platform.</p>
            <p>Where applicable, agency fees are governed by a separate agency agreement signed between Hemaprin Homes and the client.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content on this website — including text, images, logos, property descriptions, and data — is the property of Hemaprin Homes or its content licensors. You may not reproduce, distribute, modify, or republish any content without our prior written consent.</p>
            <p>Property images uploaded by sellers or agents remain the property of their respective owners. By submitting images to our platform, you grant Hemaprin Homes a non-exclusive licence to use those images for marketing and listing purposes.</p>
          </Section>

          <Section title="8. Disclaimer of Warranties">
            <p>Our platform and services are provided "as is" and "as available" without any warranties, express or implied. We do not warrant that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The platform will be uninterrupted, error-free, or secure</li>
              <li>Property listings are always accurate, current, or complete</li>
              <li>Any particular property will meet your specific requirements</li>
            </ul>
            <p>To the maximum extent permitted by Kenyan law, Hemaprin Homes disclaims all implied warranties including merchantability, fitness for a particular purpose, and non-infringement.</p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>To the fullest extent permitted by law, Hemaprin Homes shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of our platform or services, including but not limited to loss of profits, data, or goodwill.</p>
            <p>Our total liability to you for any claim arising from these Terms or your use of our services shall not exceed the amount of any fees paid by you to us in the 12 months preceding the claim.</p>
          </Section>

          <Section title="10. Third-Party Links and Services">
            <p>Our platform may contain links to third-party websites including mortgage calculators, government portals, and financial institutions. We do not control those sites and are not responsible for their content, availability, or privacy practices. Accessing third-party links is at your own risk.</p>
          </Section>

          <Section title="11. Governing Law">
            <p>These Terms of Service are governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Kenya.</p>
          </Section>

          <Section title="12. Changes to These Terms">
            <p>We reserve the right to update these Terms of Service at any time. Changes will be effective immediately upon posting to our website. Your continued use of our platform after any changes constitutes your acceptance of the revised terms. We encourage you to review these terms periodically.</p>
          </Section>

          <Section title="13. Termination">
            <p>We reserve the right to suspend or terminate your access to our platform at any time, without notice, if we believe you have violated these Terms or applicable law. You may also stop using our services at any time.</p>
          </Section>

          <Section title="14. Contact Us">
            <p>If you have any questions about these Terms of Service, please contact us:</p>
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

export default TermsOfServicePage;

"use client";
import React from "react";

interface PolicySection {
  title: string;
  content: React.ReactNode;
}

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const policySections: PolicySection[] = [
    {
      title: "Information We Collect",
      content: (
        <p className="text-gray-700 leading-relaxed">
          We collect personal information that you voluntarily provide when you interact with our services, 
          including but not limited to: name, email address, phone number, shipping address, and payment 
          information. We may also automatically collect technical data such as IP address, browser type, 
          and usage patterns through cookies and similar technologies.
        </p>
      ),
    },
    {
      title: "How We Use Your Information",
      content: (
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li>Process and fulfill your orders and transactions</li>
          <li>Provide customer support and respond to inquiries</li>
          <li>Send important service updates and administrative information</li>
          <li>Improve our website functionality and user experience</li>
          <li>Comply with legal obligations and prevent fraudulent activities</li>
        </ul>
      ),
    },
    {
      title: "Data Protection & Security",
      content: (
        <p className="text-gray-700 leading-relaxed">
          We implement industry-standard security measures including SSL encryption, secure server 
          infrastructure, and strict access controls. Your personal information is never sold to 
          third parties. We only share data with trusted service providers essential for order 
          fulfillment (payment processors, shipping carriers) and when required by law.
        </p>
      ),
    },
    {
      title: "Cookies & Tracking Technologies",
      content: (
        <p className="text-gray-700 leading-relaxed">
          Our website uses cookies to enhance user experience, analyze site traffic, and personalize 
          content. You can manage your cookie preferences through your browser settings. Note that 
          disabling certain cookies may affect website functionality.
        </p>
      ),
    },
    {
      title: "Your Rights & Choices",
      content: (
        <p className="text-gray-700 leading-relaxed">
          You have the right to access, correct, or delete your personal data. You may also object to 
          processing, request data portability, or withdraw consent at any time. To exercise these rights, 
          please contact us using the information below. We will respond to all legitimate requests within 
          30 days.
        </p>
      ),
    },
    {
      title: "Data Retention",
      content: (
        <p className="text-gray-700 leading-relaxed">
          We retain personal data only for as long as necessary to fulfill the purposes outlined in this 
          policy, unless a longer retention period is required or permitted by law. Transaction data is 
          typically maintained for 7 years to comply with legal obligations.
        </p>
      ),
    },
    {
      title: "Contact Information",
      content: (
        <div className="text-gray-700  leading-relaxed space-y-2">
          <p className="flex items-start">
            <span className="font-medium w-24 flex-shrink-0">Email:</span>
            <span>saadicollection18@gmail.com</span>
          </p>
          <p className="flex items-start">
            <span className="font-medium w-24 flex-shrink-0">Phone:</span>
            <span> +92 340 9751709 (Mon-Fri, 9AM-5PM PST)</span>
          </p>
          <p className="flex flex-col items-start">
            <span className="font-medium w-24 flex-shrink-0">Address:</span>
                        <iframe
                title="Saadi Collections - chakwal location"
                src="https://www.google.com/maps?q=chakwal,+Pakistan&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-60 border-0"
              />
            <span>
              saadicollection <br />
              chakwal, punjab<br />
              Pakistan
            </span>
          </p>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Protecting your privacy is our priority. This policy outlines how we collect, 
            use, and safeguard your personal information.
          </p>
        </div>

        {/* Policy Content */}
        <article className=" rounded-2xl overflow-hidden  ">
          <div className="p-8 md:p-12">
            {/* Introduction */}
            <div className="mb-10 p-6 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-gray-700 text-lg leading-relaxed">
                Welcome to our Privacy Policy. We are committed to protecting your personal 
                information and your right to privacy. If you have any questions or concerns 
                about this privacy notice or our practices regarding your personal information, 
                please contact us.
              </p>
            </div>

            {/* Policy Sections */}
            <div className="space-y-12">
              {policySections.map((section, index) => (
                <section key={index} className="border-b border-gray-100 last:border-b-0 pb-12 last:pb-0">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="ml-11">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            {/* Last Updated */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Last updated: {currentDate}
              </p>
              <p className="text-xs text-gray-400 text-center mt-2">
                This policy may be updated periodically. We encourage you to review this page regularly.
              </p>
            </footer>
          </div>
        </article>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
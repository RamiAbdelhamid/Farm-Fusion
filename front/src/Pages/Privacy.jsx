import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Leaf,
  Shield,
  FileText,
  Book,
} from "lucide-react";

// Enhanced FAQ Component with accordion functionality
export function EnhancedFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqList = [
    {
      question: "What is this platform about?",
      answer:
        "Our platform is designed specifically for farmers and livestock managers to streamline record-keeping, track crop rotations, monitor animal health and welfare, and analyze farm productivity in one central location. We offer tools tailored to both crop producers and animal husbandry professionals.",
    },
    {
      question: "Is my agricultural data secure?",
      answer:
        "Absolutely. We understand the sensitive nature of farm data and implement bank-level encryption and security protocols. Your crop yields, animal lineage records, and financial information stay protected with regular security audits and compliance with agricultural data privacy standards.",
    },
    {
      question: "Can I manage multiple farm properties and livestock herds?",
      answer:
        "Yes! Our system supports multiple farm locations, fields, livestock herds, and animal groups under one account. You can track separate operations with distinct data sets while maintaining a comprehensive overview of your entire agricultural enterprise.",
    },
    {
      question: "What pricing options are available for farmers?",
      answer:
        "We believe in supporting farms of all sizes. Our starter plan is free for small operations with basic needs. Premium plans offer advanced analytics, unlimited records, weather integration, and veterinary record management, with special pricing for family farms and agricultural cooperatives.",
    },
    {
      question:
        "Can I track seasonal crop rotations and animal breeding cycles?",
      answer:
        "Yes, our platform includes specialized calendar tools for planning crop rotations, scheduling planting and harvest times, tracking breeding cycles, and managing seasonal livestock activities. You can set reminders for critical farm tasks throughout the year.",
    },
    {
      question: "Is there mobile access for use in the field?",
      answer:
        "Our mobile app works offline in remote farm areas with automatic syncing when connectivity returns. Record animal data, crop observations, or equipment usage directly from your fields or barns without worrying about signal strength.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-green-50 rounded-lg shadow-md border border-green-100">
      <div className="flex items-center mb-8 text-green-800">
        <Leaf className="mr-2" size={24} />
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-4">
        {faqList.map((faq, index) => (
          <div
            key={index}
            className="border border-green-200 rounded-lg overflow-hidden bg-white"
          >
            <button
              className="w-full text-left p-4 flex justify-between items-center hover:bg-green-50 transition-colors duration-200"
              onClick={() => toggleFaq(index)}
            >
              <h2 className="text-lg font-semibold text-green-800">
                {faq.question}
              </h2>
              {openIndex === index ? (
                <ChevronUp className="text-green-600" size={20} />
              ) : (
                <ChevronDown className="text-green-600" size={20} />
              )}
            </button>

            {openIndex === index && (
              <div className="p-4 bg-green-50 border-t border-green-200">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Terms & Conditions Component
export function EnhancedTerms() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-amber-50 rounded-lg shadow-md border border-amber-100">
      <div className="flex items-center mb-6 text-amber-800">
        <FileText className="mr-2" size={24} />
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>
      </div>

      <p className="mb-6 text-gray-700">
        Welcome to our Agricultural & Livestock Management platform. These terms
        govern your use of our services designed for farmers, ranchers, and
        agricultural professionals.
      </p>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg border-l-4 border-amber-500">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">
            1. Agricultural Use of Service
          </h2>
          <p className="text-gray-700">
            You agree to use this platform for legitimate agricultural and
            livestock management purposes, including crop planning, animal
            record-keeping, inventory management, and farm analytics. Misuse for
            non-agricultural purposes or to store inappropriate content is
            prohibited.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border-amber-500">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">
            2. Farm Account Responsibility
          </h2>
          <p className="text-gray-700">
            You are responsible for maintaining the confidentiality of your farm
            account credentials and for all activities conducted under your
            account. Multiple farm workers may have access under your
            supervision according to your subscription tier.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border-amber-500">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">
            3. Agricultural Data Ownership
          </h2>
          <p className="text-gray-700">
            All farm data, including crop records, livestock information, yield
            data, breeding histories, and other agricultural content you submit
            remains your intellectual property. We claim no ownership over your
            farm's operational data or records.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border-amber-500">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">
            4. Seasonal Updates & Changes
          </h2>
          <p className="text-gray-700">
            We may update these terms to reflect changing agricultural
            regulations or platform features. Changes will be communicated via
            email and continued use of our farm management tools constitutes
            acceptance of the updated terms.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border-amber-500">
          <h2 className="text-xl font-semibold text-amber-800 mb-2">
            5. Livestock Welfare Compliance
          </h2>
          <p className="text-gray-700">
            Users tracking animal data agree to comply with all applicable
            livestock welfare regulations. Our platform should not be used to
            facilitate any practices that violate animal welfare standards in
            your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}

// Enhanced Privacy Policy Component
export function EnhancedPrivacy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-50 rounded-lg shadow-md border border-blue-100">
      <div className="flex items-center mb-6 text-blue-800">
        <Shield className="mr-2" size={24} />
        <h1 className="text-3xl font-bold">Farm Data Privacy Policy</h1>
      </div>

      <p className="mb-6 text-gray-700">
        We understand the sensitive nature of agricultural data. This Privacy
        Policy explains how we safeguard your farm information and livestock
        records within our platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            1. Agricultural Data Collection
          </h2>
          <p className="text-gray-700">
            We collect farm-specific data including crop plans, livestock
            records, field boundaries, yield statistics, breeding histories, and
            contact information to provide personalized agricultural management
            services.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            2. Farm Data Usage
          </h2>
          <p className="text-gray-700">
            Your agricultural information helps us generate crop rotation
            recommendations, livestock health insights, yield forecasts, and
            farm efficiency analytics tailored to your specific operation and
            regional conditions.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            3. Agricultural Data Protection
          </h2>
          <p className="text-gray-700">
            We employ agricultural-specific security protocols to protect
            sensitive farm data. Your livestock genetics, crop yields, and
            proprietary farming methods are never shared with third parties
            without explicit consent.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            4. Regional Compliance
          </h2>
          <p className="text-gray-700">
            Our platform adheres to agricultural data privacy standards across
            different regions, including specialized farm data protection
            regulations in the EU, US, and Australia.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-blue-500 md:col-span-2">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            5. Aggregated Agricultural Insights
          </h2>
          <p className="text-gray-700">
            With your permission, we may use anonymized farm data to generate
            regional agricultural benchmarks and insights that benefit the
            farming community. Individual farms remain unidentifiable in all
            aggregated data reports.
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-100 rounded-lg text-blue-800 flex items-center">
        <Book size={20} className="mr-2 flex-shrink-0" />
        <p>
          For questions about our agricultural data practices or to request
          access to your farm information, please contact our Farm Data
          Protection Officer at privacy@farmmanager.example
        </p>
      </div>
    </div>
  );
}

// Default export combining all components
export default function AgricultureComponents() {
  const [activeTab, setActiveTab] = useState("faq");

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm bg-white">
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === "faq"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-green-50"
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "terms"
                  ? "bg-amber-600 text-white"
                  : "bg-white text-gray-700 hover:bg-amber-50"
              }`}
            >
              Terms
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === "privacy"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
            >
              Privacy
            </button>
          </div>
        </div>

        {activeTab === "faq" && <EnhancedFaq />}
        {activeTab === "terms" && <EnhancedTerms />}
        {activeTab === "privacy" && <EnhancedPrivacy />}
      </div>
    </div>
  );
}

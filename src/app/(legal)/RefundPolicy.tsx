import React from 'react';
import Head from 'next/head';

const RefundPolicy = () => {
  return (
    <>
      <Head>
        <title>Refund Policy | AI Landscape Design</title>
        <meta name="description" content="Read the refund policy for ailandscapedesign.io. Learn about eligibility, how to request a refund, and our processing procedures for AI Landscape Design services." />
        <link rel="canonical" href="https://ailandscapedesign.io/refund-policy" />
      </Head>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
        
        <div className="mb-8">
          <p className="mb-4">
            At ailandscapedesign.io, we strive to provide our users with the best experience possible. We understand that circumstances may change, and you might need to request a refund. Please read our refund policy carefully before making a purchase.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Refund Eligibility</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">Time Limit:</span> Refund requests must be made within 3 days of your purchase. After this period, we cannot process any refund requests.</li>
            <li><span className="font-medium">Credit Usage:</span> If you have used more than 50 credits, you are not eligible for a refund, regardless of the time since purchase.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to Request a Refund</h2>
          <p className="mb-4">If you meet the eligibility criteria and wish to request a refund, please follow these steps:</p>
          <ol className="list-decimal pl-5 space-y-3">
            <li><span className="font-medium">Contact Us:</span> Reach out to our support team at <a href="mailto:support@ailandscapedesign.io" className="text-blue-600 hover:underline">support@ailandscapedesign.io</a>.</li>
            <li><span className="font-medium">Provide Details:</span> Include your account details, order number, purchase date, and reason for the refund request.</li>
            <li><span className="font-medium">Submit Within 3 Days:</span> Ensure your request is submitted within 3 days of your purchase.</li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Processing Refunds</h2>
          <p className="mb-4">
            Once we receive your refund request, we will review it and notify you of the outcome soon. If approved, your refund will be processed to your original payment method.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
          <p className="mb-4">
            We reserve the right to update our refund policy at any time. Any changes will be reflected on this page, and we encourage you to review it periodically.
          </p>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy;
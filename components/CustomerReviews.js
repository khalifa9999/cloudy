import React from 'react';
import { motion } from 'framer-motion';

const TRUSTPILOT_GREEN = '#00B67A';

const reviews = [
  {
    name: 'Sarah M.',
    rating: 5,
    quote: 'Fantastic service and great selection of products! Highly recommended.',
    verified: true
  },
  {
    name: 'James L.',
    rating: 4,
    quote: 'Quick delivery and excellent customer support. Will shop again.',
    verified: true
  },
  {
    name: 'Priya S.',
    rating: 5,
    quote: 'Top-notch quality and very professional team. Trustworthy experience.',
    verified: true
  }
];

function StarRating({ count }) {
  return (
    <span style={{ color: TRUSTPILOT_GREEN, fontSize: '1.2em', letterSpacing: '2px' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 border border-green-300 align-middle">
      Verified
    </span>
  );
}

export default function CustomerReviews() {
  return (
    <section className="my-12 px-4 md:px-8">
      <motion.div className="flex items-center justify-center mb-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Trustpilot logo as SVG */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="14" fill={TRUSTPILOT_GREEN} />
          <polygon points="14,6 16,13 23,13 17,17 19,24 14,19.5 9,24 11,17 5,13 12,13" fill="#fff" />
        </svg>
        <span className="ml-2 text-lg font-semibold" style={{ color: TRUSTPILOT_GREEN }}>Trustpilot</span>
      </motion.div>
      <motion.h2 className="text-2xl font-semibold text-center mb-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Our Customers Love Us
      </motion.h2>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {reviews.map((review, idx) => (
          <motion.div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex-1 max-w-md mx-auto relative"
            initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 * idx }}
          >
            <div className="flex items-center mb-2">
              <StarRating count={review.rating} />
              {review.verified && <VerifiedBadge />}
            </div>
            <p className="mt-2 text-gray-700 italic">"{review.quote}"</p>
            <p className="mt-3 font-medium text-gray-900">- {review.name}</p>
          </motion.div>
        ))}
      </div>
      <motion.p className="text-center text-sm text-gray-500 mt-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Reviews collected via Trustpilot
      </motion.p>
    </section>
  );
} 
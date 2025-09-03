import React from 'react';
import { XMarkIcon } from './Icons'; // Assuming XMarkIcon is in Icons.jsx

export default function GoogleFeedbackForm({ setShowForm }) {
  return (
    <div className="relative p-4"> {/* Added padding here */}
      <h3 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
        We'd Love Your Feedback!
      </h3>
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        aria-label="Close feedback form"
      >
        <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Paste your Google Form iframe code here */}
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSesMe1HuPGAcgjzxhpDpHKUphm-kUGukxn9KXk0jBDqHytk2A/viewform?embedded=true" 
        width="100%"
        height="500" // Adjusted height for better mobile viewing, can be tweaked
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Match Flow Feedback Form" // Added title for accessibility
        className="rounded-lg shadow-md"
      >
        Loading…
      </iframe>
    </div>
  );
}
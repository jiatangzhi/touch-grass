"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-500 px-4 py-8 sm:py-12">
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Time to get leafy
      </motion.h1>

      <motion.p
        className="text-base sm:text-lg text-white text-center mb-6 sm:mb-8 max-w-sm sm:max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >

      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center"
      >
        <Link to="/grass-scanner">
          <button className="rounded-3xl bg-white hover:bg-gray-100 text-green-500 font-semibold py-3 px-7 sm:px-8 text-sm sm:text-base shadow-md transition duration-200">
            TOUCH GRASS
          </button>
        </Link>
      </motion.div>
    </main>
  );
}

"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-white px-4">
      <motion.h1
        className="text-5xl font-bold text-green-700 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🌿 Ready to touch grass? 🌿
      </motion.h1>

      <motion.p
        className="text-lg text-gray-700 text-center mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Have you touched grass today?
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-6">Touching Grass Detector 🌿</h1>
        <Link to="/grass-scanner">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow">
            Launch Scanner 🚀
          </button>
        </Link>
      </motion.div>
    </main>
  );
}

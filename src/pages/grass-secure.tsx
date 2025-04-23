import { motion } from "framer-motion";

export default function GrassSecure() {
  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center p-8 bg-white rounded-xl shadow-lg"
      >
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🌿 You're Touching Grass!
        </h1>
        <p className="text-lg text-gray-700">
          Grass secured! 😁
        </p>
      </motion.div>
    </div>
  );
}

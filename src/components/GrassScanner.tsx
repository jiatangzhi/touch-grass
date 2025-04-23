import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs"; // TensorFlow.js for image handling
import * as mobilenet from "@tensorflow-models/mobilenet"; // Pretrained model
import * as knnClassifier from "@tensorflow-models/knn-classifier"; // KNN classifier for classification
import { useNavigate } from "react-router-dom"; // For navigation on success

// Type for tracking training samples
interface Training {
  grass: number;
  not_grass: number;
}

// App states used to manage UI flow
type AppState = "welcome" | "detecting" | "success";

export default function GrassDetector() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate(); // Hook to navigate to another page

  // UI state
  const [appState, setAppState] = useState<AppState>("welcome");
  const [message, setMessage] = useState("Initializing...");

  // Model and classifier states
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [classifier] = useState(knnClassifier.create());

  // Camera and detection state
  const [hasCamera, setHasCamera] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Track how many examples have been added
  const [trainingCount, setTrainingCount] = useState<Training>({
    grass: 0,
    not_grass: 0,
  });

  // Load the model and setup camera on mount
  useEffect(() => {
    async function init() {
      const net = await mobilenet.load(); // Load pretrained MobileNet model
      setModel(net);
      await setupCamera(); // Access user camera
    }
    init();
  }, []);

  // Request camera access and initialize stream
  const setupCamera = async () => {
    try {
      const video = videoRef.current;
      if (!video) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use rear camera on phones
      });

      video.srcObject = stream;
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
      });

      video.play();
      setHasCamera(true);
    } catch (error) {
      console.error("Camera access denied", error);
      setMessage("📵 Cannot access camera.");
    }
  };

  // Start detection loop when toggled
  useEffect(() => {
    if (model && isDetecting) {
      const interval = setInterval(() => {
        detect(); // Run detection every 2 seconds
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [model, isDetecting]);

  // Add a training example for the selected label
  const addExample = async (label: keyof Training) => {
    if (!videoRef.current || !model) return;
    const img = tf.browser.fromPixels(videoRef.current);
    const activation = model.infer(img, true) as tf.Tensor; // Extract features
    classifier.addExample(activation, label); // Add to classifier
    img.dispose();

    setTrainingCount((prev) => ({
      ...prev,
      [label]: prev[label] + 1,
    }));
  };

  // Detect the current frame and classify it
  const detect = async () => {
    if (!videoRef.current || !model) return;
    const img = tf.browser.fromPixels(videoRef.current);
    const activation = model.infer(img, true) as tf.Tensor;

    // Only proceed if there is training data
    if (classifier.getNumClasses() > 0) {
      const result = await classifier.predictClass(activation);
      const label = result.label;
      const confidence = result.confidences[label];

      if (label === "grass" && confidence > 0.9) {
        setAppState("success");
        setMessage("🌿 Grass secured!");
        navigate("/grass-secure"); // Redirect on success
      } else {
        setMessage("❌ Not grass.");
      }
    } else {
      setMessage("❗️No training data.");
    }

    img.dispose();
  };

  return (
    <div className="rounded-3xl min-h-screen flex items-start justify-center bg-white px-4 pt-6 pb-0">
      <div className="w-full max-w-md text-center space-y-4">
        {/* Camera Preview */}
        <video
          ref={videoRef}
          width={300}
          height={225}
          autoPlay
          muted
          playsInline
          className="rounded-3xl border-4 border-green-200 shadow-[0_-10px_25px_rgba(0,0,0,0.2)] shadow-lg mx-auto w-full max-w-xs md:max-w-sm"
        />

        {/* Status Message */}
        <p className="text-lg font-semibold text-gray-800">{message}</p>

        {/* Control Buttons */}
        <div className="flex flex-col gap-y-3 sm:gap-y-4 md:gap-y-5 lg:gap-y-6 items-center w-full max-w-xs mx-auto">
          <button
            className="px-5 py-3 w-full bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl shadow-md transition duration-200"
            onClick={() => addExample("grass")}
          >
            🌿 Train: Grass ({trainingCount.grass})
          </button>

          <button
            className="px-5 py-3 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-xl shadow-md transition duration-200"
            onClick={() => addExample("not_grass")}
          >
            🚫 Train: Not Grass ({trainingCount.not_grass})
          </button>

          <button
            className="px-5 py-3 w-full bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl shadow-md transition duration-200"
            onClick={() => setIsDetecting(true)}
          >
            🚀 Detect
          </button>
        </div>
      </div>
    </div>
  );
}

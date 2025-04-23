import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as knnClassifier from "@tensorflow-models/knn-classifier";

interface Training {
  grass: number;
  not_grass: number;
}

type AppState = "welcome" | "detecting" | "success";

export default function GrassDetector() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // UI + App State
  const [appState, setAppState] = useState<AppState>("welcome");
  const [message, setMessage] = useState("Initializing...");

  // Model & Classifier
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [classifier] = useState(knnClassifier.create());

  // Status
  const [hasCamera, setHasCamera] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingCount, setTrainingCount] = useState<Training>({
    grass: 0,
    not_grass: 0,
  });

  // Load model + camera
  useEffect(() => {
    async function init() {
      const net = await mobilenet.load();
      setModel(net);
      await setupCamera();
    }
    init();
  }, []);

  const setupCamera = async () => {
    try {
      const video = videoRef.current;
      if (!video) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
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

  // Start detection loop
  useEffect(() => {
    if (model && isDetecting) {
      const interval = setInterval(() => {
        detect();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [model, isDetecting]);

  const addExample = async (label: keyof Training) => {
    if (!videoRef.current || !model) return;
    const img = tf.browser.fromPixels(videoRef.current);
    const activation = model.infer(img, true) as tf.Tensor;
    classifier.addExample(activation, label);
    img.dispose();

    setTrainingCount((prev) => ({
      ...prev,
      [label]: prev[label] + 1,
    }));
  };

  const detect = async () => {
    if (!videoRef.current || !model) return;
    const img = tf.browser.fromPixels(videoRef.current);
    const activation = model.infer(img, true) as tf.Tensor;

    if (classifier.getNumClasses() > 0) {
      const result = await classifier.predictClass(activation);
      const label = result.label;
      const confidence = result.confidences[label];

      if (label === "grass" && confidence > 0.9) {
        setAppState("success");
        setMessage("🌿 Grass secured!");
       
      } else {
        setMessage("❌ Not grass.");
      }
    } else {
      setMessage("❗️No training data.");
    }

    img.dispose();
  };

    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center">
          <video
            ref={videoRef}
            width={300}
            height={225}
            autoPlay
            muted
            playsInline
            className="rounded-lg shadow mx-auto w-full max-w-xs md:max-w-sm"
          />
          <p className="mt-4 text-lg font-semibold">{message}</p>

          <div className="flex flex-col items-center space-y-3 w-full max-w-xs mx-auto">
            <button
              className="px-5 py-3 w-full bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl shadow-md transition duration-200"
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
              className="px-5 py-3 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-md transition duration-200"
              onClick={() => setIsDetecting(true)}
            >
              🚀 Start Detection
            </button>
          </div>
        </div>
      </div>
    );
}

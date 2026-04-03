import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const AvatarAssistant = () => {
  const [state, setState] = useState('IDLE'); // IDLE or ACTIVE
  const videoRef = useRef(null);
  const camRef = useRef(null);
  const requestRef = useRef(null);
  
  // Refs for tracking stability (Debounce) and performance
  const lastDetectionTime = useRef(0);
  const lastNoDetectionTime = useRef(0);
  const detectionCounter = useRef(0);
  const lastLogTime = useRef(performance.now());

  // 1. Detection Loop with Stability Logic (Debounce)
  useEffect(() => {
    const startCamera = async () => {
      try {
        console.log(`[${new Date().toLocaleTimeString()}] [CAMERA] Initializing...`);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (camRef.current) camRef.current.srcObject = stream;
        detectFrame();
      } catch (err) {
        console.error("[ERROR] Access denied:", err);
      }
    };

    const detectFrame = () => {
      const now = performance.now();
      detectionCounter.current++;

      // Calculate Detections Per Second (DPS) every 1 second
      if (now - lastLogTime.current >= 1000) {
        console.log(`[PERF] Detections per second: ${detectionCounter.current}`);
        detectionCounter.current = 0;
        lastLogTime.current = now;
      }

      // Placeholder for MediaPipe/Face-API detection logic
      // For simulation: assume face detected if window has focus
      const isFacePresent = document.hasFocus(); 

      if (isFacePresent) {
        lastNoDetectionTime.current = 0;
        if (lastDetectionTime.current === 0) lastDetectionTime.current = now;
        
        // Stability check: Must see face for 300ms
        if (now - lastDetectionTime.current > 300 && state !== 'ACTIVE') {
          handleStateChange('ACTIVE');
        }
      } else {
        lastDetectionTime.current = 0;
        if (lastNoDetectionTime.current === 0) lastNoDetectionTime.current = now;

        // Stability check: Must lose face for 300ms
        if (now - lastNoDetectionTime.current > 300 && state !== 'IDLE') {
          handleStateChange('IDLE');
        }
      }

      requestRef.current = requestAnimationFrame(detectFrame);
    };

    startCamera();
    return () => cancelAnimationFrame(requestRef.current);
  }, [state]);

  // 2. Controlled State Switch
  const handleStateChange = (newState) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[STATE][${timestamp}] Switching to ${newState}`);
    setState(newState);

    if (newState === 'ACTIVE') {
      console.log(`[MEDIA][${timestamp}] Playing hi.mp4 - Restarting from beginning`);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.warn("Autoplay blocked or interupted"));
      }
    } else {
      console.log(`[MEDIA][${timestamp}] Rendering Output.gif`);
    }
  };

  const handleVideoEnd = () => {
    console.log("[ACTION] Video ended, triggering speech recognition...");
    // Speech recognition logic here...
  };

  return (
    <div className="flex flex-col items-center justify-center p-10">
      {/* Hidden monitor for camera stream */}
      <video ref={camRef} autoPlay muted playsInline className="hidden" />

      <div className="avatar-container shadow-2xl bg-gray-100">
        {/* IDLE state: GIF */}
        {state === 'IDLE' && (
          <Image 
            src="/Output.gif" 
            alt="Idle state" 
            fill
            className="w-full h-full object-cover transition-opacity duration-300"
            unoptimized
          />
        )}

        {/* ACTIVE state: Video */}
        {state === 'ACTIVE' && (
          <video
            ref={videoRef}
            src="/hi.mp4"
            className="w-full h-full object-cover"
            autoPlay
            muted={false} // Be careful: browser might block if not triggered by click
            playsInline
            onEnded={handleVideoEnd}
          />
        )}
      </div>

      <div className="mt-8 text-center">
        <p className={`text-xl ${state === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}`}>
          {state === 'ACTIVE' ? 'جاري الترحيب بك...' : 'في انتظار اكتشاف الوجه...'}
        </p>
      </div>
    </div>
  );
};

export default AvatarAssistant;
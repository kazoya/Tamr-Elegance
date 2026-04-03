
"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mic, Send, X, MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { processVoiceOrder } from '@/ai/flows/process-voice-order';
import Image from 'next/image';

// --- CONFIGURATION ---
const ASSETS = {
  IDLE_GIF: '/Output.gif',
  ACTIVE_VIDEO: '/hi.mp4',
  AVATAR_BACKUP: '/Output.gif'
};

type AssistantState = 'IDLE' | 'ACTIVE' | 'LISTENING' | 'REVIEW';

export function AIVoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<AssistantState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalOrder, setFinalOrder] = useState('');
  const activeVideoPlayerRef = useRef<HTMLVideoElement>(null); // hi.mp4 player
  const recognitionRef = useRef<any>(null);
  const lastStateRef = useRef<AssistantState>('IDLE');

  const { toast } = useToast();

  // Face detection scripts removed as per requirements to start video immediately.

  // No longer tracking face, so onDetectionResults is removed

  // Watch for state changes to handle media lifecycle
  useEffect(() => {
    if (state === 'ACTIVE' && activeVideoPlayerRef.current) {
      console.log(`[MEDIA] State is ACTIVE, ensuring playback of ${ASSETS.ACTIVE_VIDEO}`);
      activeVideoPlayerRef.current.currentTime = 0;
      activeVideoPlayerRef.current.play().catch(e => console.warn("[MEDIA] Playback blocked:", e));
    }
  }, [state]);

    // We no longer trigger this synchronously because the React node isn't mounted yet!
    // Instead we rely on the `useEffect` below.

  // 4. Start Assistant
  const startAssistant = async () => {
    console.log('[MIC] Requesting permissions...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      console.log('[MIC] Permissions granted.');
      setIsOpen(true);
      
      // Jump immediately to ACTIVE
      setState('ACTIVE');
    } catch (error) {
      console.error('[ERROR] Microphone access denied:', error);
      toast({
        variant: 'destructive',
        title: 'عذراً سيدي',
        description: 'نحتاج لصلاحية الميكروفون لنتمكن من خدمتكم بشكل أفضل.',
      });
    }
  };

  const handleVideoEnd = () => {
    console.log("[STATE] Transitioning to LISTENING after greeting.");
    setState('LISTENING');
    startListening();
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ 
        variant: 'destructive', 
        title: 'تنبيه',
        description: 'المتصفح لا يدعم ميزة التعرف على الصوت.' 
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.start();

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      console.log(`[VOICE] Transcript: ${text}`);
      setTranscript(text);
      setIsProcessing(true);
      try {
        const result = await processVoiceOrder({ transcript: text });
        setFinalOrder(result.formattedMessage);
        setState('REVIEW');
      } catch (e) {
        console.error("[ERROR] AI Processing failed:", e);
      } finally {
        setIsProcessing(false);
      }
    };

    recognitionRef.current = recognition;
  };

  const sendToWhatsApp = () => {
    const phone = '962799967433';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(finalOrder)}`;
    window.open(url, '_blank');
  };

  const closeAssistant = () => {
    console.log("[ACTION] Closing Assistant.");
    setIsOpen(false);
  };

  // DEBUG SUMMARY LOGGING (Final report helper)
  useEffect(() => {
    if (isOpen) {
      const summaryTimer = setInterval(() => {
        console.log("--- DEBUG SUMMARY ---");
        console.log(`State switching working: ${state !== lastStateRef.current ? 'YES' : 'STABLE'}`);
        console.log(`Current State: ${state}`);
        console.log(`Media rendering: ${state === 'IDLE' ? ASSETS.IDLE_GIF : ASSETS.ACTIVE_VIDEO}`);
        lastStateRef.current = state;
      }, 10000);
      return () => clearInterval(summaryTimer);
    }
  }, [isOpen, state]);

  return (
    <>
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={startAssistant}
          className="fixed bottom-8 left-8 z-[60] p-1 rounded-full shadow-2xl border-4 border-primary bg-white overflow-hidden group"
        >
          <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-primary">
             <div className="relative w-full h-full">
               <Image src={ASSETS.AVATAR_BACKUP} alt="AI Assistant" fill unoptimized className="object-cover rounded-full" />
             </div>
             <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute inset-0 bg-white/30 rounded-full"
             />
          </div>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div className="bg-card w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl relative border border-primary/30">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeAssistant}
                className="absolute top-8 right-8 z-20 text-white bg-black/40 hover:bg-primary rounded-full transition-colors"
              >
                <X />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 h-[650px]">
                {/* Visual Area */}
                <div className="relative bg-black flex items-center justify-center overflow-hidden">
                  {/* Removed Hidden camera preview */}
                  
                  {/* IDLE State Rendering */}
                  {state === 'IDLE' && (
                    <div className="w-full h-full relative">
                      <img 
                        src={ASSETS.IDLE_GIF} 
                        alt="Waiting..." 
                        className="w-full h-full object-cover"
                        onLoad={() => console.log(`[MEDIA] Rendering ${ASSETS.IDLE_GIF}`)}
                        onError={() => console.error(`[ERROR] Failed to load ${ASSETS.IDLE_GIF}`)}
                      />
                      <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                        <p className="text-white font-headline text-2xl bg-black/50 px-6 py-2 rounded-full animate-pulse">
                          نحن بانتظارك.. تقدم قليلاً
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ACTIVE/LISTENING/REVIEW State Rendering */}
                  {(state === 'ACTIVE' || state === 'LISTENING' || state === 'REVIEW') && (
                    <div className="w-full h-full relative">
                      <video 
                        ref={activeVideoPlayerRef}
                        src={ASSETS.ACTIVE_VIDEO}
                        autoPlay
                        playsInline
                        onEnded={handleVideoEnd}
                        className={`w-full h-full object-cover ${state !== 'ACTIVE' ? 'opacity-50' : ''}`}
                        onError={() => console.error(`[ERROR] Failed to load ${ASSETS.ACTIVE_VIDEO}`)}
                      />
                      {state === 'LISTENING' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/20">
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }} 
                            transition={{ repeat: Infinity }}
                            className="p-8 bg-white rounded-full shadow-2xl"
                          >
                            <Mic className="w-16 h-16 text-primary animate-pulse" />
                          </motion.div>
                          <p className="mt-8 text-white text-3xl font-bold font-headline shadow-lg">أنا أسمعك الآن.. تفضل بطلبك</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="absolute top-10 left-10 flex items-center gap-3 bg-primary/90 px-5 py-2 rounded-full text-white text-xs font-black animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    SALAMAT LIVE AI
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-16 flex flex-col justify-center text-right space-y-12 bg-card">
                  {state === 'IDLE' && (
                    <div className="space-y-6">
                      <h2 className="text-4xl font-headline font-bold text-primary">أهلاً بك في مزارع السلامات</h2>
                      <p className="text-muted-foreground text-xl">تحدث إلينا لتسجيل طلبك لتمور السلامات.</p>
                    </div>
                  )}

                  {state === 'REVIEW' && (
                    <div className="space-y-10">
                      <div className="flex items-center gap-5 border-b border-primary/10 pb-8">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                          <MessageSquare className="text-primary w-7 h-7" />
                        </div>
                        <h2 className="text-3xl font-headline font-bold text-primary">تفاصيل طلبك الفاخر</h2>
                      </div>
                      <div className="bg-muted/30 p-10 rounded-[2.5rem] text-xl leading-relaxed whitespace-pre-wrap font-medium h-56 overflow-y-auto border border-border/50">
                        {finalOrder || "جاري معالجة الطلب..."}
                      </div>
                      <div className="flex gap-6 pt-4">
                        <Button onClick={sendToWhatsApp} className="flex-1 h-auto py-6 rounded-2xl gap-4 text-2xl font-black shadow-xl hover:scale-[1.02] transition-transform">
                          <Send className="w-8 h-8" />
                          تأكيد وإرسال لواتساب
                        </Button>
                        <Button variant="outline" onClick={() => setState('ACTIVE')} className="h-auto py-6 px-8 rounded-2xl text-xl">
                          طلب جديد
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {(state === 'ACTIVE' || state === 'LISTENING') && (
                    <div className="space-y-6">
                      <h2 className="text-4xl font-headline font-bold text-primary">مرحباً بك مجدداً</h2>
                      <p className="text-muted-foreground text-xl">تحدث إلينا مباشرة بطلبك أو استفسارك عن تمورنا الفاخرة.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

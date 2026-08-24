"use client";

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import { useRouter, useSearchParams } from 'next/navigation';
import { Language } from '@/lib/i18n';
import { Video, VideoOff, Mic, MicOff, PhoneOff, MessageSquare, FileText, User, ShieldAlert, Send } from 'lucide-react';

export default function TeleconsultRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('room') || 'room-demo-101';
  
  const [lang, setLang] = useState<Language>('en');
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'ASHA Sunita', text: 'Dr. Patil, patient Sharda Kamble has joined from Manchar PHC teleconsult room.', time: '14:30' },
    { sender: 'Dr. Rajesh Patil', text: 'Thank you Sunita. Reviewing her BP vitals now.', time: '14:31' }
  ]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'record' | 'chat'>('record');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");

  useEffect(() => {
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.warn("Camera/Mic access denied or unavailable", err);
        setCameraError("Camera/Mic simulation active (Local webcam access fallback)");
      }
    }
    initCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(track => track.enabled = !isMicOn);
    }
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(track => track.enabled = !isVideoOn);
    }
    setIsVideoOn(!isVideoOn);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'Dr. Rajesh Patil', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Header currentLang={lang} onLanguageChange={setLang} />

      {/* Main Teleconsult Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left Side: Video Canvas (3 Columns) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          
          {/* Room Banner */}
          <div className="bg-slate-900/90 border border-slate-800 p-3 px-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <div>
                <span className="font-bold text-sm text-white">Live WebRTC Session • {roomId}</span>
                <span className="text-xs text-slate-400 block">Managed SFU Canvas Interface (Swappable Provider Adapter)</span>
              </div>
            </div>

            <div className="bg-brand-900/80 text-brand-200 border border-brand-700/50 text-xs px-3 py-1 rounded-full font-semibold">
              Encrypted Peer Feed
            </div>
          </div>

          {/* Video Grid Canvas */}
          <div className="relative flex-1 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden min-h-[420px] flex items-center justify-center">
            
            {/* Primary Remote Video Feed (Patient Sharda Kamble / PHC Room) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-brand-800 border-4 border-brand-500/40 flex items-center justify-center mx-auto text-3xl font-extrabold text-white shadow-2xl">
                  SK
                </div>
                <h3 className="font-bold text-lg text-white">Patient: Sharda Baburao Kamble</h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium border border-slate-700">
                  Connected from Manchar PHC Consultation Room 2
                </span>
              </div>
            </div>

            {/* Local Doctor Video Feed Overlay (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-800 rounded-2xl border-2 border-brand-500 overflow-hidden shadow-2xl">
              {isVideoOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 text-xs font-bold">
                  Camera Off
                </div>
              )}
              <span className="absolute bottom-1 left-2 text-[10px] font-bold bg-black/60 px-1.5 py-0.5 rounded text-white">
                Dr. Rajesh Patil (You)
              </span>
            </div>

            {cameraError && (
              <div className="absolute top-4 left-4 bg-amber-950/80 border border-amber-600/50 text-amber-200 text-xs px-3 py-1.5 rounded-xl">
                {cameraError}
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-center space-x-6">
            <button
              onClick={toggleMic}
              className={`p-3.5 rounded-full transition shadow-lg ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3.5 rounded-full transition shadow-lg ${
                isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => router.push('/doctor')}
              className="p-3.5 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-lg flex items-center space-x-2"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Consultation</span>
            </button>
          </div>

        </div>

        {/* Right Side: Side Panel (Patient Record & Chat) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col h-full space-y-4">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('record')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'record' ? 'bg-brand-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Patient Record
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                activeTab === 'chat' ? 'bg-brand-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Chat
            </button>
          </div>

          {/* Record View */}
          {activeTab === 'record' ? (
            <div className="flex-1 space-y-4 text-xs overflow-y-auto">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-[10px] font-bold uppercase text-brand-300 tracking-wider">Clinical Summary</span>
                <h4 className="font-bold text-sm text-white">Sharda Baburao Kamble</h4>
                <p className="text-slate-300">Female, 31 Yrs • 32 Weeks ANC</p>
                <div className="bg-rose-950/60 border border-rose-700/50 p-2 rounded-xl text-rose-200 font-medium">
                  High Risk Flag: Pre-eclampsia Warning (BP 154/102)
                </div>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-2xl space-y-1.5 border border-slate-800">
                <span className="font-bold text-slate-300 block">Vitals Summary</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <span>BP: 154/102 mmHg</span>
                  <span>Pulse: 94 bpm</span>
                  <span>SpO2: 98%</span>
                  <span>Temp: 98.7 °F</span>
                </div>
              </div>
            </div>
          ) : (
            /* Chat View */
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div className="flex-1 overflow-y-auto space-y-2 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="bg-slate-800 p-2.5 rounded-xl space-y-0.5">
                    <div className="flex justify-between text-[10px] text-brand-300 font-bold">
                      <span>{msg.sender}</span>
                      <span className="text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-slate-200">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button type="submit" className="p-2 bg-brand-600 rounded-xl text-white">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

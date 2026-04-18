import React, { useState } from 'react';
import { Download, Youtube, Loader2, AlertCircle, Video, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState('1080');

  const [progressText, setProgressText] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  
  const [videoInfo, setVideoInfo] = useState<{title: string, image: string, description: string} | null>(null);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setError(null);
    setDownloadUrl(null);
    setVideoInfo(null);
    setProgressText('Initializing...');
    setProgressPercent(0);

    try {
      const formatMap: Record<string, string> = {
        'max': '1080',
        '1080': '1080',
        '720': '720',
        '480': '480',
        '360': '360'
      };
      
      const targetFormat = formatMap[quality] || '1080';
      const encodedUrl = encodeURIComponent(url);
      
      const metaPromise = fetch(`/api/video-info?url=${encodedUrl}`).then(r => r.json()).catch(() => null);
      
      const initRes = await fetch(`/api/loader/download?format=${targetFormat}&url=${encodedUrl}`);
      
      if (!initRes.ok) {
        throw new Error('Failed to initialize download. Service might be busy.');
      }
      
      const initData = await initRes.json();
      
      const meta = await metaPromise;
      if (meta && !meta.error) {
         setVideoInfo(meta);
      }
      
      if (!initData.id) {
        throw new Error('Failed to start download process.');
      }

      const jobId = initData.id;
      let isDone = false;
      let finalUrl = null;

      while (!isDone) {
        await new Promise(r => setTimeout(r, 2000));
        
        const statusRes = await fetch(`/api/loader/progress?id=${jobId}`);
        const statusData = await statusRes.json();
        
        setProgressText(statusData.text || 'Processing...');
        
        if (statusData.progress !== undefined) {
          setProgressPercent(Math.min(100, Math.max(0, Math.round(statusData.progress / 10))));
        }

        if (statusData.success === 1 || statusData.download_url) {
          finalUrl = statusData.download_url;
          isDone = true;
        } else if (statusData.success === 0 && statusData.text === "Error") {
          throw new Error('Service returned an error during extraction. The video may be restricted.');
        }
      }

      if (finalUrl) {
        setDownloadUrl(finalUrl);
      } else {
        throw new Error('Failed to retrieve final download link.');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process video. Please try again.');
    } finally {
      setLoading(false);
      setProgressText('');
      setProgressPercent(0);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-red-500/20">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none fade-in">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-400/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[840px] bg-white rounded-[24px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-zinc-200/80 flex flex-col pt-14 pb-8 px-6 sm:px-12 relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center mb-6 p-4 bg-red-50 text-red-600 rounded-2xl shadow-sm border border-red-100"
          >
            <Youtube className="w-8 h-8" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 text-zinc-900 tracking-tight">
            TubeTo<span className="text-red-600">MP4</span>
          </h1>
          <p className="text-zinc-500 max-w-[480px] mx-auto text-base sm:text-lg">
            Convert any YouTube video into a high-quality MP4 file instantly. No limits, no fuss.
          </p>
        </div>

        {/* Main Interface */}
        <div className="flex-1 w-full max-w-[640px] mx-auto flex flex-col">
          <form onSubmit={handleProcess} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 sm:p-2.5 rounded-[16px] sm:rounded-full border border-zinc-200 shadow-sm focus-within:border-zinc-300 focus-within:ring-4 focus-within:ring-zinc-100 transition-all duration-300">
              
              <div className="relative flex items-center flex-1">
                <div className="pl-4 pr-3 flex items-center pointer-events-none">
                  <Video className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube link here..."
                  className="w-full py-3 bg-transparent border-none text-base outline-none placeholder:text-zinc-400 text-zinc-900 focus:ring-0 disabled:opacity-50"
                  required
                  disabled={loading}
                />
              </div>

              <div className="w-full sm:w-[1px] h-[1px] sm:h-8 bg-zinc-200 self-center hidden sm:block" />

              <div className="relative flex items-center bg-transparent">
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full bg-transparent border-none text-sm outline-none text-zinc-600 font-medium appearance-none pr-10 cursor-pointer py-3 pl-4 sm:pl-3 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Video Quality"
                  disabled={loading}
                >
                  <option value="max">Max Quality</option>
                  <option value="1080">1080p Full HD</option>
                  <option value="720">720p HD</option>
                  <option value="480">480p SD</option>
                  <option value="360">360p</option>
                </select>
                <div className="absolute right-4 pointer-events-none text-zinc-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              <div className="sm:ml-1 relative sm:w-[150px] shrink-0">
                  <button
                    type="submit"
                    disabled={loading || !url}
                    className="w-full h-12 bg-zinc-900 text-white rounded-[12px] sm:rounded-full font-semibold text-sm tracking-wide cursor-pointer hover:bg-black transition-all disabled:opacity-80 disabled:cursor-not-allowed flex flex-col items-center justify-center overflow-hidden relative shadow-md"
                  >
                    {loading ? (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="flex flex-col items-center justify-center w-full z-10"
                      >
                        <span className="text-[10px] uppercase tracking-wider text-white/90">{progressText || 'Processing'}</span>
                        {progressPercent > 0 && <span className="font-bold text-xs">{progressPercent}%</span>}
                      </motion.div>
                    ) : (
                      <span className="z-10 flex items-center gap-2">
                        Convert <ArrowRight className="w-4 h-4" />
                      </span>
                    )}

                    {loading && (
                      <div 
                        className="absolute bottom-0 left-0 h-full bg-red-600/20 transition-all duration-300 z-0 border-b-2 border-red-500" 
                        style={{ width: `${progressPercent}%` }} 
                      />
                    )}
                  </button>
              </div>
            </div>
            
            <div className="text-center text-xs font-medium text-zinc-400 mt-4 tracking-wide uppercase">
                Free &bull; No Login &bull; Fast Download
            </div>
          </form>

          {/* Results Area */}
          <div className="mt-8 mb-auto min-h-[220px]">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-red-50/80 border border-red-100 rounded-[16px] flex items-start gap-3 text-red-600 shadow-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{error}</p>
                </motion.div>
              )}

              {downloadUrl && !loading && !error && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="p-6 sm:p-8 bg-zinc-50 border border-zinc-200 rounded-[20px] text-center flex flex-col gap-6 shadow-xs"
                >
                  <div className="flex flex-col items-center">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100/50 rounded-full mb-4 ring-8 ring-green-50">
                      <CheckCircle2 className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-zinc-900 font-display font-bold text-xl mb-1">Ready to Download</h3>
                    <p className="text-zinc-500 text-sm">Your file has been processed successfully.</p>
                  </div>

                  {videoInfo && (
                    <div className="bg-white border border-zinc-100 rounded-[16px] p-4 flex flex-col sm:flex-row text-left gap-4 items-start shadow-sm mx-auto w-full max-w-lg hover:shadow-md transition-shadow">
                       <img 
                         src={videoInfo.image} 
                         alt={videoInfo.title} 
                         referrerPolicy="no-referrer"
                         className="w-full sm:w-[140px] h-[90px] object-cover rounded-[10px] flex-shrink-0 bg-zinc-100 border border-zinc-100"
                       />
                       <div className="flex-1 min-w-0 py-1">
                         <h4 
                           className="font-semibold text-zinc-900 text-[15px] leading-snug mb-1.5 overflow-hidden" 
                           style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}
                           title={videoInfo.title}
                         >
                            {videoInfo.title}
                         </h4>
                         <p 
                           className="text-zinc-500 text-[13px] leading-relaxed overflow-hidden" 
                           style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}
                         >
                           {videoInfo.description || "No description provided."}
                         </p>
                       </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-black text-white font-semibold rounded-full transition-all text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <Download className="w-4 h-4" />
                      Download Video
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <p className="text-center text-zinc-400 font-medium text-[11px] mt-8 uppercase tracking-widest">
          By using this service, you agree to only download content you own.
        </p>
      </motion.div>
    </div>
  );
}

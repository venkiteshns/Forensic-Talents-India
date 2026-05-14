import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const videos = [
  '/videos/video1.mp4',
  '/videos/video2.mp4',
  '/videos/video3.mp4'
];

export default function SeamlessVideoBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef([]);

  useEffect(() => {
    const activeVideo = videoRefs.current[activeIndex];
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(e => console.error("Video playback failed:", e));
    }
  }, [activeIndex]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {videos.map((src, index) => (
        <motion.video
          key={src}
          ref={(el) => (videoRefs.current[index] = el)}
          src={src}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          loop={false}
          autoPlay={index === 0}
          onEnded={() => setActiveIndex((prev) => (prev + 1) % videos.length)}
          initial={{ opacity: index === 0 ? 1 : 0 }}
          animate={{ opacity: index === activeIndex ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      ))}
      {/* Darkish overlay to improve text contrast over the video */}
      <div className="absolute inset-0 bg-black/80 z-10" />
    </div>
  );
}

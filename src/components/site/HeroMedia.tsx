import { useEffect, useRef, useState } from "react";
import { assets } from "@/lib/assets";

/** SSR and the first hydration pass contain only the still image, never a video URL. */
export function HeroMedia() {
  const [playVideo, setPlayVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => {
      setPlayVideo(preference.matches);
      if (!preference.matches) setVideoReady(false);
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!playVideo || !video) return;
    void video.play().catch(() => setVideoReady(false));
    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [playVideo]);

  return (
    <div className="absolute inset-0 -z-20" aria-hidden="true">
      <picture>
        <source media="(max-width: 767px)" srcSet={assets.heroMobile.srcSet} sizes="100vw" />
        <img
          src={assets.heroPoster.src}
          srcSet={assets.heroPoster.srcSet}
          sizes="100vw"
          width={assets.heroPoster.width}
          height={assets.heroPoster.height}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </picture>
      {playVideo && (
        <video
          ref={videoRef}
          src={assets.heroVideo.src}
          poster={assets.heroPoster.src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${videoReady ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

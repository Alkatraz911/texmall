import { useState } from "react";
import "./VideoPlayer.css";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
};

export const VideoPlayer = ({ src, poster, className }: VideoPlayerProps) => {
  const [ready, setReady] = useState(false);

  return (
    <div className={`vp-wrap${className ? ` ${className}` : ""}`}>
      {/* Постер виден мгновенно, пока подгружается видео */}
      {poster && (
        <img
          className={`vp-poster${ready ? " vp-poster--hidden" : ""}`}
          src={poster}
          alt=""
          aria-hidden
        />
      )}
      <video
        className="vp-video"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        onLoadedData={() => setReady(true)}
      />
    </div>
  );
};

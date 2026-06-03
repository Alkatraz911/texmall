import "./VideoPlayer.css"

type VideoPlayerProps = {
  src: string;
  className?: string;
};

export const VideoPlayer = ({ src, className }: VideoPlayerProps) => {
  return (
    <>
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // ключевой момент
          borderRadius: "16px",
        }}
      />
      {/* {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
        </div>
      )} */}
      
    </>
  );
};


import React, { useEffect, useState } from "react";

interface BackgroundWrapperProps {
  image: string | null;
  fallbackColor?: string;
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  image,
  fallbackColor = "var(--surface)",
  children,
}) => {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    if (!image) {
      setBgLoaded(false);
      return;
    }
    setBgLoaded(false);
    const img = new Image();
    img.src = image;
    img.onload = () => setBgLoaded(true);
  }, [image]);

  return (
    <div
      className={`bg-wrapper${image ? " bg-wrapper--photo" : ""}`}
      style={{
        backgroundColor: fallbackColor,
        backgroundImage:
          image && bgLoaded ? `url(${image})` : "none",
        opacity: 1,
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundWrapper;

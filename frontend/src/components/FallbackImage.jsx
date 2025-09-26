import React from "react";

export default function FallbackImage({ src, alt, className }) {
  const placeholder = "/uploads/placeholder.png"; // Place a placeholder image in your uploads folder
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={e => {
        e.target.onerror = null;
        e.target.src = placeholder;
      }}
    />
  );
}

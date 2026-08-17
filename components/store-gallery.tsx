"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

interface StoreMedia {
  type: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
}

interface StoreGalleryProps {
  media: StoreMedia[];
  title: string;
}

export function StoreGallery({ media, title }: StoreGalleryProps) {
  if (!media || media.length === 0) return null;

  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedMedia(index);
  const closeLightbox = () => setSelectedMedia(null);

  const goToPrevious = () => {
    if (selectedMedia !== null) {
      setSelectedMedia(selectedMedia === 0 ? media.length - 1 : selectedMedia - 1);
    }
  };

  const goToNext = () => {
    if (selectedMedia !== null) {
      setSelectedMedia(selectedMedia === media.length - 1 ? 0 : selectedMedia + 1);
    }
  };

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-black tracking-tight">
              Conoce nuestra <span className="text-primary">{title}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un espacio diseñado para que encuentres la laptop perfecta con la mejor atención.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border-0 p-0 bg-transparent"
              >
                {item.type === "video" ? (
                  <>
                    <video
                      src={item.src}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={(e) => {
                        const video = e.target as HTMLVideoElement;
                        video.pause();
                        video.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center group-hover:bg-black/80 transition-colors">
                        <Play className="w-5 h-5 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </>
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedMedia !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          {media.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-4 text-white/80 hover:text-white z-10 p-2 bg-black/50 rounded-full"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 text-white/80 hover:text-white z-10 p-2 bg-black/50 rounded-full"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Media */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh] p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {media[selectedMedia].type === "video" ? (
              <video
                src={media[selectedMedia].src}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <Image
                src={media[selectedMedia].src}
                alt={media[selectedMedia].alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 text-white/60 text-sm">
            {selectedMedia + 1} / {media.length}
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useRef } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Badge } from "../Badge";
import { Spinner } from "../Spinner";
import { LiveStreamPlayerProps } from "./types";

const LiveStreamPlayer: React.FC<LiveStreamPlayerProps> = ({
  src,
  poster,
  title,
  isLive = true,
  viewerCount = 0,
  qualities = [],
  currentQuality,
  onQualityChange,
  onPlay,
  onPause,
  onVolumeChange,
  onFullscreen,
  autoPlay = false,
  controls = true,
  className,
  ...props
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        onPause?.();
      } else {
        videoRef.current.play();
        onPlay?.();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
      onVolumeChange?.(newVolume);
    }
  };

  const handleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
      if (newMuted) {
        handleVolumeChange(0);
      } else {
        handleVolumeChange(volume || 0.5);
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
      onFullscreen?.();
    }
  };

  const handleQualitySelect = (quality: string) => {
    onQualityChange?.(quality);
    setShowQualityMenu(false);
  };

  return (
    <div
      className={cn("relative bg-black rounded-lg overflow-hidden", className)}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      {...props}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="xl" variant="white" />
        </div>
      )}

      {/* Live Badge */}
      {isLive && (
        <div className="absolute top-4 left-4">
          <Badge variant="error" size="medium" className="animate-pulse">
            🔴 LIVE
          </Badge>
        </div>
      )}

      {/* Viewer Count */}
      {viewerCount > 0 && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" size="medium">
            <Icon name="eye" size="small" className="mr-1" />
            {viewerCount.toLocaleString()}
          </Badge>
        </div>
      )}

      {/* Title Overlay */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
      )}

      {/* Controls */}
      {controls && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-2">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="small"
                onClick={handlePlay}
                className="text-white hover:bg-white/20"
              >
                <Icon
                  name={isPlaying ? "close" : "chevronRight"}
                  size="medium"
                />
              </Button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleMute}
                  className="text-white hover:bg-white/20"
                >
                  <Icon name={isMuted ? "eyeOff" : "eye"} size="small" />
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              {/* Quality Selector */}
              {qualities.length > 0 && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="text-white hover:bg-white/20"
                  >
                    {currentQuality || "HD"}
                  </Button>

                  {showQualityMenu && (
                    <div className="absolute bottom-full mb-2 right-0 bg-black/90 rounded-md py-2 min-w-20">
                      {qualities.map((quality) => (
                        <button
                          key={quality.value}
                          onClick={() => handleQualitySelect(quality.value)}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm text-white hover:bg-white/20",
                            currentQuality === quality.value && "bg-white/20"
                          )}
                        >
                          {quality.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="small"
                onClick={handleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Icon name="chevronUp" size="small" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

LiveStreamPlayer.displayName = "LiveStreamPlayer";

export { LiveStreamPlayer };

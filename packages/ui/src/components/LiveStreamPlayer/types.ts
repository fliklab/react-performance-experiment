export interface Quality {
  value: string;
  label: string;
}

export interface LiveStreamPlayerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onVolumeChange"> {
  /** Video source URL */
  src: string;
  /** Poster image URL */
  poster?: string;
  /** Stream title */
  title?: string;
  /** Whether this is a live stream */
  isLive?: boolean;
  /** Number of viewers */
  viewerCount?: number;
  /** Available quality options */
  qualities?: Quality[];
  /** Current quality setting */
  currentQuality?: string;
  /** Quality change callback */
  onQualityChange?: (quality: string) => void;
  /** Play callback */
  onPlay?: () => void;
  /** Pause callback */
  onPause?: () => void;
  /** Volume change callback */
  onVolumeChange?: (volume: number) => void;
  /** Fullscreen callback */
  onFullscreen?: () => void;
  /** Whether to autoplay */
  autoPlay?: boolean;
  /** Whether to show controls */
  controls?: boolean;
  /** Additional CSS classes */
  className?: string;
}

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trash2, Play, ExternalLink } from 'lucide-react';

interface VideoEmbedProps {
  id: string;
  videoUrl: string;
  onDelete: () => void;
}

export const VideoEmbed = ({ id, videoUrl, onDelete }: VideoEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoData = useMemo(() => {
    // YouTube
    const youtubeMatch = videoUrl.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (youtubeMatch) {
      return {
        type: 'youtube',
        id: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`,
        thumbnail: `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`,
      };
    }

    // Vimeo
    const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
        thumbnail: null,
      };
    }

    // Direct video URL (MP4, WebM, etc.)
    if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      return {
        type: 'direct',
        id: id,
        embedUrl: videoUrl,
        thumbnail: null,
      };
    }

    return {
      type: 'unknown',
      id: id,
      embedUrl: videoUrl,
      thumbnail: null,
    };
  }, [videoUrl, id]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative rounded-xl overflow-hidden bg-muted aspect-video group"
    >
      {isPlaying ? (
        <>
          {videoData.type === 'direct' ? (
            <video
              src={videoData.embedUrl}
              controls
              autoPlay
              className="w-full h-full"
            />
          ) : (
            <iframe
              src={videoData.embedUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
        </>
      ) : (
        <>
          {/* Thumbnail */}
          {videoData.thumbnail ? (
            <img
              src={videoData.thumbnail}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <Play className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsPlaying(true)}
              className="rounded-full h-16 w-16"
            >
              <Play className="h-8 w-8" fill="currentColor" />
            </Button>
          </div>
        </>
      )}

      {/* Delete Button */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => window.open(videoUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Platform Badge */}
      <div className="absolute bottom-2 left-2">
        <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-md capitalize">
          {videoData.type}
        </span>
      </div>
    </motion.div>
  );
};

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Trash2, 
  Star, 
  Image as ImageIcon 
} from 'lucide-react';

interface SortableImageProps {
  id: string;
  image: {
    id: string;
    image_url: string;
    title?: string | null;
    is_cover: boolean;
    image_type?: string | null;
  };
  onSetCover: () => void;
  onDelete: () => void;
}

export const SortableImage = ({ id, image, onSetCover, onDelete }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      layout
      className={`
        relative group rounded-xl overflow-hidden bg-muted
        ${isDragging ? 'shadow-2xl ring-2 ring-primary' : 'shadow-md'}
        ${image.image_type === 'polaroid' ? 'aspect-[3/4] p-2 bg-white dark:bg-zinc-900 shadow-lg' : 'aspect-[3/4]'}
      `}
    >
      {image.image_type === 'polaroid' ? (
        <div className="relative h-full">
          <div className="h-[85%] overflow-hidden rounded">
            <img
              src={image.image_url}
              alt={image.title || 'Portfolio image'}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
          <div className="h-[15%] flex items-center justify-center">
            <p className="text-xs text-muted-foreground font-handwriting">
              {image.title || 'Polaroid'}
            </p>
          </div>
        </div>
      ) : (
        <img
          src={image.image_url}
          alt={image.title || 'Portfolio image'}
          className="w-full h-full object-cover"
          draggable={false}
        />
      )}

      {/* Cover Badge */}
      {image.is_cover && (
        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
          <Star className="h-3 w-3 mr-1 fill-current" />
          Cover
        </Badge>
      )}

      {/* Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-zinc-800/90 rounded-lg cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-2 left-2 right-2 flex gap-2">
          {!image.is_cover && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onSetCover}
              className="flex-1 text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              Set Cover
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            className="flex-1 text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

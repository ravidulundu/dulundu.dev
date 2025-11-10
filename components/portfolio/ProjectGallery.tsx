import Image from 'next/image';

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      {images[0] && (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
          <Image
            src={images[0]}
            alt={`${title} - Main`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Additional Images Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.slice(1).map((image, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <Image
                src={image}
                alt={`${title} - Image ${index + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

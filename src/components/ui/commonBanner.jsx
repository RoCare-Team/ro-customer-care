import Image from "next/image";

const CommonBanner = ({
  title = "",
  subtitle = "",
  images = [],
  height = "250px",
  className = ""
}) => {
  return (
    <section className="relative w-full overflow-hidden" style={{ height }}>
      {/* Render multiple images */}
      {images.map((img, index) => (
        <div key={index} className="absolute inset-0">
        <Image
          key={index}
          src={img.src}
          alt={img.alt || `Banner ${index + 1}`}
          fill
          className={`object-cover object-center ${className}`} // ✅ use object-cover
          sizes={img.width ? `${img.width}px` : "100vw"}
          priority // ✅ ensures high-quality loading for above-the-fold images
        />
        </div>
      ))}

      {/* Overlay Content */}
      {(title || subtitle) && (
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white px-4">
          {title && <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>}
          {subtitle && <p className="mt-2 text-lg md:text-xl">{subtitle}</p>}
        </div>
      )}
    </section>
  );
};

export default CommonBanner;

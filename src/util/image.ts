export const imageCache = new Map<string, HTMLImageElement>();

export const loadImage = async (src: string): Promise<HTMLImageElement> => {
  if (imageCache.has(src)) {
    return await Promise.resolve(imageCache.get(src));
  }

  const img = new Image();
  img.src = src;
  return await new Promise((resolve, reject) => {
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
  });
};

export const imagePaths = [
  "chicken-eat1-1.png",
  "chicken-eat1-2.png",
  "chicken-eat1-3.png",
  "chicken-eat1-4.png",
  "chicken1-1.png",
  "chicken1-2.png",
  "chicken1-3.png",
  "chicken1-4.png",
  "chicken2-1.png",
  "chicken2-2.png",
  "coding-chicken1-1.png",
  "coding-chicken1-2.png",
  "game-chicken1-1.png",
  "game-chicken1-2.png",
  "grass.png",
  "music-chicken1-1.png",
  "music-chicken1-2.png",
  "music-chicken1-3.png",
  "zzz-1.png",
  "zzz-2.png",
  "zzz-3.png",
];

export const loadImages = async (baseUrl: string): Promise<void> => {
  const imagePromises = imagePaths.map(async (path) => {
    await loadImage(baseUrl + path);
  });

  await Promise.all(imagePromises);
};

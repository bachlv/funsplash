import * as blurhash from 'blurhash';
import { Image } from 'canvas';

const COMPONENT_X = 4;
const COMPONENT_Y = 3;
const SIZE = 32;

export const getBlurhash = async (url: string): Promise<string> =>
  process.env.NODE_ENV === 'development'
    ? getBlurhashWithCanvas(url)
    : getBlurhashWithSharp(url);

export const getBlurhashWithCanvas = async (url: string): Promise<string> => {
  const { createCanvas, loadImage } = await import('canvas');

  const image = await loadImage(url);

  const getImageData = (image) => {
    const canvas = createCanvas(SIZE, SIZE);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, SIZE, SIZE);
    return context.getImageData(0, 0, image.width, image.height);
  };

  const imageData = getImageData(image);
  return blurhash.encode(
    imageData.data,
    imageData.width,
    imageData.height,
    COMPONENT_X,
    COMPONENT_Y
  );
};

const getBlurhashWithSharp = async (url: string): Promise<string> => {
  const sharp = (await import('sharp').then(
    (r) => r.default || r
  )) as typeof import('sharp');

  const image = await fetch(url);
  const imageData = Buffer.from(await image.arrayBuffer());

  return new Promise((resolve, reject) => {
    sharp(imageData)
      .raw()
      .ensureAlpha()
      .resize(SIZE)
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(
          blurhash.encode(
            new Uint8ClampedArray(buffer),
            width,
            height,
            COMPONENT_X,
            COMPONENT_Y
          )
        );
      });
  });
};

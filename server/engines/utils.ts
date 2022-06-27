import * as blurhash from 'blurhash';
import { createCanvas, loadImage, Image } from 'canvas';

const COMPONENT_X = 4;
const COMPONENT_Y = 3;

export const getBlurhash = async (url: string): Promise<string> => {
  const image = await loadImage(url);

  const getImageData = (image: Image) => {
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
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

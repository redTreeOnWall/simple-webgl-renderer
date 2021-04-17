
export const loadImage = async (url: string) => {
  const image = new Image();
  image.src = url;

  return new Promise<HTMLImageElement>((resolve) => {
    image.onload = e =>{
      resolve(image);
    }
  });
}

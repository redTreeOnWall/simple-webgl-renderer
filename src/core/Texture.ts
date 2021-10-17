export class Texture{

  static create(gl: WebGLRenderingContext, image: HTMLImageElement){
    const texture = gl.createTexture();
    if(texture === null){
      return null;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    return texture;
  }

  static createDefaultTexture(gl: WebGLRenderingContext, color = [255,255,255,255]) {

    const texture = gl.createTexture();
    if(texture === null){
      return null;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array(color),
    );
    gl.generateMipmap(gl.TEXTURE_2D);

    return texture;
  }
}

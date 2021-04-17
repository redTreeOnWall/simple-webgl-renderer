export class Texture{
  texture: WebGLTexture| null = null;
  create(gl: WebGLRenderingContext, image: HTMLImageElement){
    const texture = gl.createTexture();
    this.texture = texture;
    if(texture === null){
      return;
    }

    gl.bindTexture(gl.TEXTURE_2D, texture); 

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  }
}

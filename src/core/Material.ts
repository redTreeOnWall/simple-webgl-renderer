
export enum UniformType{
  vec1 = 1,
  vec2 = 2,
  vec3 = 2,
  vec4 = 4,
  texture = 5,
  mat4 = 6,
}

type UniformValue = 
  undefined |
  null |
  number |
  Float32List |
  WebGLTexture;


export interface Uniform{
  location: WebGLUniformLocation | null;
  type: UniformType;
  value: UniformValue;
}

export class Material{

  uniforms: {[key: string]: Uniform} = {};

  program: WebGLProgram;

  constructor( program: WebGLProgram) {
    this.program = program;
  }

  init(gl: WebGLRenderingContext){
    for( let key in this.uniforms) {
      const uniform = this.uniforms[key];
      const location = gl.getUniformLocation(this.program, key);
      uniform.location = location;
    }
  }

  updateUniform(gl: WebGLRenderingContext){

    let textureUnit = 0;

    for( let key in this.uniforms) {
      const uniform = this.uniforms[key];

      // TODO change to array map

      // dirty check
      if(uniform.type === UniformType.vec4) {
        gl.uniform4fv(uniform.location, uniform.value as Float32List);
      }
      else if(uniform.type === UniformType.texture){
        gl.uniform1i(uniform.location, textureUnit);
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        // TODO type check
        gl.bindTexture(gl.TEXTURE_2D, uniform.value as WebGLTexture);
        textureUnit += 1;
      } else if (uniform.type === UniformType.mat4) {
        gl.uniformMatrix4fv(uniform.location, false, uniform.value as Float32List);
      }
    }



  }

}

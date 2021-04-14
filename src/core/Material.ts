
export enum UniformType{
  vec1 = 1,
  vec2 = 2,
  vec3 = 2,
  vec4 = 4,
}

export interface Uniform{
  location: WebGLUniformLocation | null;
  type: UniformType;
  value: any;
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
    for( let key in this.uniforms) {
      const uniform = this.uniforms[key];

      if(uniform.type === UniformType.vec4) {
        gl.uniform4fv(uniform.location, uniform.value);
      }
    }
  }

}
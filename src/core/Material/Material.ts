import {createProgramFromSource} from "../ShaderProgamUtils";

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
  vertxShader: string;

  fragShader: string;

  uniforms: {[key: string]: Uniform} = {};

  program: WebGLProgram | null = null;

  inited = false;

  constructor(vertxShader: string, fragShader: string) {
    this.vertxShader = vertxShader;
    this.fragShader = fragShader;
  }

  init(gl: WebGLRenderingContext){
    this.inited = true;

    this.program = createProgramFromSource(gl, this.vertxShader, this.fragShader);

    if(this.program !== null) {
      for( let key in this.uniforms) {
        const uniform = this.uniforms[key];
        const location = gl.getUniformLocation(this.program, key);
        uniform.location = location;
      }
    }
  }
}

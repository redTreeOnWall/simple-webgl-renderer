import {ShaderLib} from "../shaderlib/ShaderLib";
import {Texture} from "../Texture";
import {Material, UniformType} from "./Material";

export class UlitMaterial extends Material {
  color: number[];
  image: HTMLImageElement | null;

  constructor(
    color: Array<number> = [1, 1, 1, 1],
    image: HTMLImageElement | null = null,
  ) {
    const vertxShader = ShaderLib.vertxShaderTemplateBasic(
      `
        attribute vec4 a_uv;
        varying vec4 v_uv;
      `,
      `
        v_uv = vec4(a_uv.x, 1.0 - a_uv.y, 0.0, 1.0);
      `,
    );
    const fragShader = ShaderLib.fragShaderTemplateBasic(
      `
        uniform sampler2D u_textrue;
        uniform vec4 u_color;
        varying vec4 v_uv;
      `,
      `
        vec4 textrueColor = texture2D(u_textrue, v_uv.xy);
        gl_FragColor = u_color * textrueColor;
      `
    );

    super(vertxShader, fragShader);

    this.color = color;
    this.image = image;

    this.uniforms = {
      [ShaderLib.uMatrix]: {
        type: UniformType.mat4,
        value: [],
        location: -1,
      },
      [ShaderLib.uProjection]: {
        type: UniformType.mat4,
        value: [],
        location: -1,
      },
      u_color: {
        type: UniformType.vec4,
        value: color,
        location: -1,
      },
      u_texture: {
        type: UniformType.texture,
        value: null,
        location: -1,
      }
    }
  }
  
  init(gl: WebGLRenderingContext) {

    let texture : WebGLTexture | null = null;

    if(this.image === null) {
      texture = Texture.createDefaultTexture(gl);
    } else {
      texture = Texture.create(gl, this.image);
    } 

    this.uniforms.u_texture.value = texture;

    super.init(gl);
  }

}

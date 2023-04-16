
import {ShaderLib} from "../shaderlib/ShaderLib";
import {Texture} from "../Texture";
import {Material, UniformType} from "./Material";

export class SimpleLightMaterial extends Material {
  color: number[];
  image: HTMLImageElement | null;

  constructor(
    color: Array<number> = [1, 1, 1, 1],
    image: HTMLImageElement | null = null,
  ) {
    const vertxShader = ShaderLib.vertxShaderTemplateBasic(
      `
        attribute vec4 a_uv;
        attribute vec4 a_normal;
        varying vec4 v_uv;
        varying vec4 v_normal;
      `,
      `
        v_uv = vec4(a_uv.x, 1.0 - a_uv.y, 0.0, 1.0);
        v_normal = a_normal;
      `,
    );
    const fragShader = ShaderLib.fragShaderTemplateBasic(
      `
        uniform sampler2D u_textrue;
        uniform vec4 u_color;
        uniform vec4 cameraPosition;
        uniform vec4 u_lightDir;
        varying vec4 v_uv;
        varying vec4 v_normal;
      `,
      `
        vec4 textrueColor = texture2D(u_textrue, v_uv.xy);

        vec3 dir = normalize(u_lightDir.xyz);
        vec3 normal = normalize(v_normal.xyz);

        vec2 mapUV = vec2(normal.xy);

        float col = dot(dir, normal);
        gl_FragColor = vec4(col, col, col, 1);
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
      },
      u_lightDir: {
        type: UniformType.vec4,
        value: [1,1,1,1],
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

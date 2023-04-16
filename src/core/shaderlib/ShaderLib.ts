
export class ShaderLib {
  static readonly aPosition = 'a_position';
  static readonly uMatrix = 'u_matrix';
  static readonly uProjection = 'u_projection';
  static readonly uCameraPosition = 'u_camera_position';

  static vertxShaderTemplateBasic(vertxProperties: string = '', vertxMain: string = '') {
    return `
      attribute vec4 a_position;
      uniform mat4 u_matrix;
      uniform mat4 u_projection;
      uniform mat4 u_camera_position;

      ${vertxProperties}

      void main() {

        ${vertxMain}

        gl_Position =u_projection * u_matrix * a_position;
      }
    `;
  }


  static fragShaderTemplateBasic(
    fragProperties: string = '',
    fragMain: string = 'gl_FragColor = vec4(1.0, 1.0 ,1.0, 1.0);'
  ) {
    return `
      precision mediump float;
      
      ${fragProperties}

      void main() {

        ${fragMain}

      }
    `;
  }

}

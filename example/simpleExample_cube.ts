import { createProgramFromSource } from "../src/core/ShaderProgamUtils";
import { BufferGeometry } from "../src/core/BufferGeometry";
// import { awaitTime } from "../src/utils/timeUtils";
import { Material, UniformType } from "../src/core/Material";
import { Object3D } from "../src/core/Object";

import {RenderComponent} from "../src/core/Renderer";
import {Mat4} from "../src/math/Mat4";


const startPaint = async () => {

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  const createObject = (xOffset: number, yOffset: number) => {
    const program = createProgramFromSource(
      gl,
      `
attribute vec4 a_position;

attribute vec4 a_color;

uniform vec4 u_time;

uniform mat4 u_matrix;

uniform mat4 u_projection;

varying vec4 v_time;
varying vec4 v_color;

void main() {
  v_time = u_time;
  v_color = a_color;

  gl_Position =u_projection * u_matrix * a_position;
}
    
    `,
      `
precision mediump float;
 
varying vec4 v_time;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
    `,
    ) as WebGLProgram;

    const geometry = new BufferGeometry();
    geometry.originData = {
      a_position: {
        size: 3,
        data: [

          // front
          -0.5, -0.5, 0.5,
          0.5, -0.5, 0.5,
          -0.5, 0.5, 0.5,

          -0.5, 0.5, 0.5,
          0.5, -0.5, 0.5,
          0.5, 0.5, 0.5,
          
          // left
          -0.5, -0.5, -0.5,
          -0.5, -0.5, 0.5,
          -0.5, 0.5, -0.5,

          -0.5, 0.5, -0.5,
          -0.5, -0.5, 0.5,
          -0.5, 0.5, 0.5,

          // right
          0.5, -0.5, 0.5,
          0.5, -0.5, -0.5,
          0.5, 0.5, 0.5,

          0.5, -0.5, -0.5,
          0.5, 0.5, -0.5,
          0.5, 0.5, 0.5,

          // top
          -0.5, 0.5, 0.5,
          0.5, 0.5, 0.5,
          0.5, 0.5, -0.5,
          
          0.5, 0.5, -0.5,
          -0.5, 0.5, -0.5,
          -0.5, 0.5, 0.5,

          // bottm
          -0.5, -0.5, 0.5,
          0.5, -0.5, -0.5,
          0.5, -0.5, 0.5,

          -0.5, -0.5, 0.5,
          -0.5, -0.5, -0.5,
          0.5, -0.5, -0.5,

          // back
          -0.5, -0.5, -0.5,
          -0.5, 0.5, -0.5,
          0.5, -0.5, -0.5,

          -0.5, 0.5, -0.5,
          0.5, 0.5, -0.5,
          0.5, -0.5, -0.5,
        ],
      },
      a_color: {
        size: 3,
        data: [

          // front red
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          
          // left green
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

          // right blue
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          // top yellow
          1, 1, 0,
          1, 1, 0,
          1, 1, 0,

          1, 1, 0,
          1, 1, 0,
          1, 1, 0,

          // bottom white
          1, 1, 1,
          1, 1, 1,
          1, 1, 1,

          1, 1, 1,
          1, 1, 1,
          1, 1, 1,

          // back purple
          1, 0, 1,
          1, 0, 1,
          1, 0, 1,

          1, 0, 1,
          1, 0, 1,
          1, 0, 1,
        ],
      },
    };

    geometry.initBuffer(gl, program);

    const material = new Material(program);
    material.uniforms = {
      u_time: {
        type: UniformType.vec4,
        value: [0, 0, 0, 0],
        location: -1,
      },
      u_matrix: {
        type: UniformType.mat4,
        value: new Mat4().elements,
        location: -1,
      },
      u_projection: {
        type: UniformType.mat4,
        value: Mat4.orthographic(-5, 5, -5, 5, -10, 10, new Mat4()).elements,
        location: -1,
      }
    }

    material.init(gl);
    const object3D = new Object3D();
    const renderer = new RenderComponent();
    renderer.geomrtry = geometry;
    renderer.material = material;
    object3D.renderer = renderer;

    return object3D;
  }


  const objects: Array<Object3D> = [];
  objects.push(createObject(Math.random() * 2 - 1, Math.random() * 2 - 1));

  let timeSecond = 0;
  const frameTime = Math.floor(1000 / 60);

  gl.clearColor(0, 0, 0, 1);

  const __tempMat41 = new Mat4();
  const __tempMat42 = new Mat4();
  const __tempMat43 = new Mat4();

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  const update = () => {
    timeSecond = timeSecond + frameTime / 1000; 

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (let i = 0; i < objects.length; i += 1) {
      const o = objects[i];
      const material = o.renderer?.material as Material;
      const geometry = o.renderer?.geometry as BufferGeometry;
      const transform = o.transform;


      //TODO do nothing if program or buffer is not changed
      gl.useProgram(material.program);
      (material.uniforms.u_time.value as number[])[0] = timeSecond;
      
      const dx = 0.03 * frameTime / 1000;
      const dAngle = Math.PI * 2 * 0.1 * timeSecond;
      // Mat4.translationMat4(dx, dx, 0, __tempMat41);
      // Mat4.rotateXMat4(dAngle, __tempMat41);
      // Mat4.rotateYMat4(dAngle, __tempMat41);
      Mat4.rotateXMat4(dAngle, __tempMat41);
      Mat4.rotateYMat4( 0.6 * dAngle, __tempMat42);

      Mat4.multiply(__tempMat41, __tempMat42, transform.localMat4);

      material.uniforms.u_matrix.value = transform.localMat4.elements;

      material.updateUniform(gl);
      geometry.useBuffer(gl);
      gl.drawArrays(gl.TRIANGLES, 0, geometry.vertexNum);
    }
    requestAnimationFrame(update);
  }

  update();
}

startPaint();

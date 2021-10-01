import { createProgramFromSource } from "../src/core/ShaderProgamUtils";
import { BufferGeometry } from "../src/core/BufferGeometry";
// import { awaitTime } from "../src/utils/timeUtils";
import { Material, UniformType } from "../src/core/Material";
import { Object3D } from "../src/core/Object";

import {Renderer} from "../src/core/Renderer";
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


    const cameraMatrix = Mat4.multiply(
      Mat4.translationMat4(10, 0, 10, new Mat4()),
      Mat4.rotateYMat4(Math.PI / 3,  new Mat4()),
      new Mat4(),
    );

    const viewMatrix = Mat4.inverse(cameraMatrix, cameraMatrix);

    const projection = Mat4.perspective( 60 * Math.PI / 180 , 1, 0.1, 1000, new Mat4());

    const viewProjectionMatrix = Mat4.multiply(projection, viewMatrix, projection);


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
      // TODO handle matrix and projection in pipeline
      u_projection: {
        type: UniformType.mat4,
        value: viewProjectionMatrix.elements,
        location: -1,
      }
    }

    material.init(gl);
    const object3D = new Object3D();
    const renderer = new Renderer();
    renderer.geomrtry = geometry;
    renderer.material = material;
    object3D.renderer = renderer;

    return object3D;
  }


  const objects: Array<Object3D> = [];

  for(let i = 0 ; i < 900 ; i++) {
    objects.push(createObject(Math.random() * 2 - 1, Math.random() * 2 - 1));
  }

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
      const geometry = o.renderer?.geomrtry as BufferGeometry;
      const transform = o.transform;


      //TODO do nothing if program or buffer is not changed
      gl.useProgram(material.program);
      (material.uniforms.u_time.value as number[])[0] = timeSecond;
      
      const dAngle = Math.PI * 2 * 0.5 * timeSecond  + i * 0.1;
      // Mat4.translationMat4(dx, dx, 0, __tempMat41);
      // Mat4.rotateXMat4(dAngle, __tempMat41);
      // Mat4.rotateYMat4(dAngle, __tempMat41);
      Mat4.rotateXMat4(dAngle, __tempMat41);
      Mat4.rotateYMat4( 0.6 * dAngle, __tempMat42);

      Mat4.multiply(__tempMat41, __tempMat42, transform.localMat4);

      Mat4.translationMat4(-22.5 + 1.5*Math.floor(i % 30), -22.5 + 1.5*Math.floor(i / 30), 0, __tempMat41);
      Mat4.multiply( __tempMat41, transform.localMat4, transform.localMat4);

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

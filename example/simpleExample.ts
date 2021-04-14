import { createProgramFromSource } from "../src/core/ShaderProgamUtils";
import { BufferGeometry } from "../src/core/BufferGeometry";
import { awaitTime } from "../src/utils/timeUtils";
import { Material, UniformType } from "../src/core/Material";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const gl = canvas.getContext('webgl') as WebGLRenderingContext;

const createObject = (xOffset: number) => {

  const program = createProgramFromSource(
    gl,
    `
attribute vec4 a_position;
attribute vec4 a_color;

uniform vec4 u_time;

varying vec4 v_color;
varying vec4 v_time;

void main() {
  v_color = a_color;
  v_time = u_time;


  float y =0.3 * sin(u_time.x);
  float x = 0.3 * cos(u_time.x);

  gl_Position = vec4(a_position.x + sin(u_time.x) * 0.5  + x ,a_position.y + y, a_position.zw);
}
    
    `,
    `
precision mediump float;
 
varying vec4 v_color;
varying vec4 v_time;

void main() {
  gl_FragColor = v_color * ( sin(v_time.x) * 0.5 + 0.5 );
}
    `,
  ) as WebGLProgram;

  const geometry = new BufferGeometry();
  geometry.originData = {
    a_position: {
      size: 2,
      data: [
        -0.2 + xOffset, 0,
        0 + xOffset, 0.3,
        0.2 + xOffset, 0,
      ],
    },
    a_color: {
      size: 3,
      data: [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
      ]
    }
  };

  geometry.initBuffer(gl, program);

  const material = new Material(program);
  material.uniforms = {
    u_time: {
      type: UniformType.vec4,
      value: [0,0,0,0],
      location: -1,
    }
  }
  material.init(gl);

  return {
    geometry,
    material,
  }
}


const paint  = async () => {


  const objects: Array< { geometry: BufferGeometry; material: Material ; } > = [];
  for( let i = 0; i < 5; i += 1) {
    objects.push(createObject(-1 + i  * 0.5));
  }

  let timeSecond = 0;
  const frameTime = Math.floor( 1000 / 60 );

  gl.clearColor(0,0,0,1);

  while (true) {
    await awaitTime(frameTime);
    timeSecond = timeSecond + frameTime / 1000; 

    gl.clear(gl.COLOR_BUFFER_BIT)

    for( let i = 0; i < objects.length; i += 1) {
      const o = objects[i];

      gl.useProgram(o.material.program);
      o.material.uniforms.u_time.value[0] = timeSecond;
      o.material.updateUniform(gl);
      o.geometry.useBuffer(gl);
      gl.drawArrays(gl.TRIANGLES, 0, o.geometry.vertexNum);
    }

  }



}

paint();
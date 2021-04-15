import { createProgramFromSource } from "../src/core/ShaderProgamUtils";
import { BufferGeometry } from "../src/core/BufferGeometry";
// import { awaitTime } from "../src/utils/timeUtils";
import { Material, UniformType } from "../src/core/Material";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const gl = canvas.getContext('webgl') as WebGLRenderingContext;

const createObject = (xOffset: number, yOffset: number) => {

  const program = createProgramFromSource(
    gl,
    `
attribute vec4 a_position;
attribute vec4 a_color;

uniform vec4 u_time;
uniform vec4 u_scale;

varying vec4 v_color;
varying vec4 v_time;

void main() {
  v_color = a_color;
  v_time = u_time;


  float y =0.3 * sin(u_time.x);
  float x = 0.3 * cos(u_time.x);

  vec4 p = vec4(a_position.x + sin(u_time.x) * 0.5  + x ,a_position.y + y, a_position.zw);
  gl_Position =vec4( p.xyz * u_scale.x, 1 );
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
        -0.2 + xOffset, 0 + yOffset,
        0 + xOffset, 0.3 + yOffset,
        0.2 + xOffset, 0 + yOffset,
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
    },
    u_scale: {
      type: UniformType.vec4,
      value: [0.5,0,0,0],
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
  for( let i = 0; i < 500; i += 1) {
    objects.push(createObject(Math.random() * 2 - 1, Math.random() * 2 - 1));
  }

  let timeSecond = 0;
  const frameTime = Math.floor( 1000 / 60 );

  gl.clearColor(0,0,0,1);
  
  const update = () => {
    timeSecond = timeSecond + frameTime / 1000; 

    gl.clear(gl.COLOR_BUFFER_BIT);

    for( let i = 0; i < objects.length; i += 1) {
      const o = objects[i];

      gl.useProgram(o.material.program);
      o.material.uniforms.u_time.value[0] = timeSecond;
      o.material.uniforms.u_scale.value[0] = Math.sin(timeSecond + i *  Math.PI / objects.length );
      o.material.updateUniform(gl);
      o.geometry.useBuffer(gl);
      gl.drawArrays(gl.TRIANGLES, 0, o.geometry.vertexNum);
    }
    requestAnimationFrame(update);
  }

  update();
}

paint();

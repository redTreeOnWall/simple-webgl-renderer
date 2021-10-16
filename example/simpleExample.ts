import { createProgramFromSource } from "../src/core/ShaderProgamUtils";
import { BufferGeometry } from "../src/core/BufferGeometry";
// import { awaitTime } from "../src/utils/timeUtils";
import { Material, UniformType } from "../src/core/Material";
import { AObject3D } from "../src/core/Object";
import {getBoxShape} from "../src/utils/shapeCreator"
import {Mat4} from "../src/math/Mat4";
import {WebglRenderer} from "../src/core/WebglRenderer";
import {Camera} from "../src/core/Camera";
import {RenderComponent} from "../src/core/RenderComponent";

class TestObject extends AObject3D {
  update(): void {
    // console.log(`updating: ${this.name}`);
  }

}

const startPaint = async () => {

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

    const program = createProgramFromSource(
      gl,
      `
attribute vec4 a_position;

attribute vec4 a_color;

uniform mat4 u_matrix;

uniform mat4 u_projection;
varying vec4 v_color;

void main() {
  v_color = a_color;
  gl_Position =u_projection * u_matrix * a_position;
}
    `,
      `
precision mediump float;
 
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
    `,
    ) as WebGLProgram;

  const material = new Material(program);

  material.uniforms = {
    u_matrix: {
      type: UniformType.mat4,
      value: [],
      location: -1,
    },
    // TODO handle matrix and projection in pipeline
    u_projection: {
      type: UniformType.mat4,
      value: [],
      location: -1,
    }
  }

  material.init(gl);


  
  const geometry = new BufferGeometry();
  const box = getBoxShape();
  geometry.originData = {
    a_position: {
      size: 3,
      data: box.position,
    },
    a_color: {
      size: 3,
      data: box.color,
    }
  };

  geometry.initBuffer(gl);
  geometry.setAttributes(gl, material.program);

  const rootObj = new TestObject('root');
  const root = rootObj.transform;

  const child1 = new TestObject('child1');

  const child2 = new TestObject('child2');
  child1.transform.addChild(child2.transform);

  Mat4.translationMat4(2, 0, 0, child2.transform.localMat4);

  child1.renderer = new RenderComponent(
    geometry,
    material,
  );

  child2.renderer = new RenderComponent(
    geometry,
    material,
  );

  root.addChild(child1.transform);

  let timeSecond = 0;
  const frameTime = Math.floor(1000 / 60);

  const renderer = new WebglRenderer(gl);
  const camera = new Camera(gl.canvas.width / gl.canvas.height);
  root.addChild(camera.transform);
  camera.transform.localMat4 = Mat4.translationMat4(0, 0, 10, camera.transform.localMat4);


  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  renderer.renderObjectTree(root, camera)

  const v = new Mat4();
  const v2 = new Mat4();

  const update = () => {
    timeSecond = timeSecond + frameTime / 1000; 

    const deltT =  frameTime / 1000;

    Mat4.rotateXMat4(1 * deltT, v);
    Mat4.rotateYMat4(1.3 * deltT, v2);
    Mat4.multiply(v, v2, v);

    Mat4.multiply(v, child1.transform.localMat4, child1.transform.localMat4);

    Mat4.rotateXMat4(10 * deltT, v);
    Mat4.multiply(v, child2.transform.localMat4, child2.transform.localMat4);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.clearColor(0.2,0.2,0.2,1);

    renderer.renderObjectTree(root, camera)
    requestAnimationFrame(update);
  }

  update();
}

startPaint();


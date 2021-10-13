import { createProgramFromSource } from "../src/core/ShaderProgamUtils";
import { BufferGeometry } from "../src/core/BufferGeometry";
// import { awaitTime } from "../src/utils/timeUtils";
import { Material } from "../src/core/Material";
import { AObject3D } from "../src/core/Object";
import {Transform} from "../src/core/Transform";
import {Mat4} from "../src/math/Mat4";
import {WebglRenderer} from "../src/core/WebglRenderer";

class TestObject extends AObject3D {
  update(): void {
    console.log(`updating: ${this.name}`);
  }

}

const startPaint = async () => {

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  const root = new Transform(new TestObject('root'));
  root.children.push(new Transform(new TestObject('child1')))
  root.children[0].children.push(new Transform(new TestObject('child1_1')))
  root.children[0].children.push(new Transform(new TestObject('child1_2')))
  root.children.push(new Transform(new TestObject('child2')))
  root.children.push(new Transform(new TestObject('child3')))
  root.children[2].children.push(new Transform(new TestObject('child3_1')))
  root.children[2].children.push(new Transform(new TestObject('child3_2')))
  root.children.push(new Transform(new TestObject('child4')))

  console.log(root);

  let timeSecond = 0;
  const frameTime = Math.floor(1000 / 60);

  gl.clearColor(0, 0, 0, 1);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);


  const renderer = new WebglRenderer();
  renderer.renderSence(root);

  const update = () => {
    timeSecond = timeSecond + frameTime / 1000; 

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.clearColor(0.2,0.2,0.2,1);



    requestAnimationFrame(update);
  }

  update();
}

startPaint();

import {BufferGeometry} from "../src/core/BufferGeometry";
import {UlitMaterial} from "../src/core/Material/UlitMaterial";
import {AObject3D} from "../src/core/Object";
import {getBoxShape} from "../src/utils/shapeCreator"
import {Mat4} from "../src/math/Mat4";
import {WebglRenderer} from "../src/core/WebglRenderer";
import {Camera} from "../src/core/Camera";
import {RenderComponent} from "../src/core/RenderComponent";
import {loadImage} from "../src/utils/ImageLoader";
import {ObjParser} from "../src/parser/ObjParser";

class TestObject extends AObject3D {
  update(): void {
    // console.log(`updating: ${this.name}`);
  }

}

const startPaint = async () => {

  const objContent = await (await fetch(`../res/module/women/women.obj?key=${Math.random()}`)).text();

  const obj = ObjParser.parseObj(objContent);
  console.log(obj);

  const positionData: number[] = [];
  const texcoordData: number[] = [];
  const normalData: number[] = [];
  
  const faceCount = obj.faces.length / 9;

  for (let f = 0; f < faceCount; f ++) {
    for (let p = 0; p < 3; p++) {
      const offset = f * 9 + p * 3;
      const positionIndex = obj.faces[offset + 0] - 1;
      const texcoordIndex = obj.faces[offset + 1] - 1;
      const normalIndex = obj.faces[offset + 2] - 1;

      for (let v = 0; v < 3; v++) {
        positionData.push(obj.verts[positionIndex * 3 + v]);
      }

      for (let v = 0; v < 3; v++) {
        normalData.push(obj.normal[normalIndex * 3 + v]);
      }

      for (let v = 0; v < 3; v++) {
        texcoordData.push(obj.texcoord[texcoordIndex * 3 + v]);
      }
    }
  }

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  const image = await loadImage('../res/module/women/tex/rp_mei_posed_001_dif_2k.jpg');

  const material = new UlitMaterial([1,1, 1, 1], image);

  const geometry = new BufferGeometry();
  const box = getBoxShape();
  geometry.originData = {
    a_position: {
      size: 3,
      data: positionData,
    },
    a_uv: {
      size: 3,
      data: texcoordData,
    }
  };

  const rootObj = new TestObject('root');
  const root = rootObj.transform;

  const child1 = new TestObject('child1');

  const child2 = new TestObject('child2');
  child1.transform.addChild(child2.transform);

  Mat4.translationMat4(100, 0, 0, child2.transform.localMat4);

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
  camera.transform.localMat4 = Mat4.translationMat4(0, 150, 300, camera.transform.localMat4);


  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  renderer.renderObjectTree(root, camera)

  const v = new Mat4();
  const v2 = new Mat4();

  const update = () => {

    timeSecond = timeSecond + frameTime / 1000;

    const deltT = frameTime / 1000;

    Mat4.rotateYMat4(0.5 * deltT, v);
    // Mat4.rotateXMat4(1.3 * deltT, v2);
    // Mat4.multiply(v, v2, v);

    Mat4.multiply(v, child1.transform.localMat4, child1.transform.localMat4);

    Mat4.rotateYMat4(1 * deltT, v);
    Mat4.scaleMat4(2, 1, 1, v);
    // Mat4.multiply( child2.transform.localMat4, v, child2.transform.localMat4);
    
    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    renderer.renderObjectTree(root, camera)

    requestAnimationFrame(update);
    // setTimeout(update, 500)
  }

  update();
}

startPaint();


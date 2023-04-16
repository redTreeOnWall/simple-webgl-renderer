import {BufferGeometry} from "../src/core/BufferGeometry";
import {SimpleLightMaterial} from "../src/core/Material/SimpleLightMaterial";
import {Object3D} from "../src/core/Object3D";
import {getBoxShape} from "../src/utils/shapeCreator"
import {Mat4} from "../src/math/Mat4";
import {WebglRenderer} from "../src/core/WebglRenderer";
import {Camera} from "../src/core/Camera";
import {RenderComponent} from "../src/core/RenderComponent";
import {loadImage} from "../src/utils/ImageLoader";
import {ObjParser} from "../src/parser/ObjParser";
import {Component} from "../src/core/Component";

const startPaint = async () => {

  const objContent = await (await fetch(`../res/module/women/women.obj?key=${Math.random()}`)).text();

  const obj = ObjParser.parseObj(objContent);
  console.log(obj);

  const positionData: number[] = [];
  const texcoordData: number[] = [];
  const normalData: number[] = [];

  const faceCount = obj.faces.length / 9;

  for (let f = 0; f < faceCount; f++) {
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
  canvas.width = 600;
  canvas.height = 500;

  const image = await loadImage('../res/module/women/tex/rp_mei_posed_001_dif_2k.jpg');

  const matCapImage = await loadImage('../res/image/matcapTest.png');

  const material = new SimpleLightMaterial([1, 1, 1, 1], matCapImage);

  const geometry = new BufferGeometry();
  geometry.originData = {
    a_position: {
      size: 3,
      data: positionData,
    },
    a_uv: {
      size: 3,
      data: texcoordData,
    },
    a_normal: {
      size: 3,
      data: normalData,
    }
  };


  const boxShape = getBoxShape();

  const box = new BufferGeometry();

  box.originData = {
    a_position: {
      size: 3,
      data: boxShape.position,
    },
    a_uv: {
      size: 2,
      data: boxShape.uv,
    }
  }

  const rootObj = Object3D.create();

  class RootCom extends Component {
    update() {
    }
  }

  rootObj.addComponent(RootCom);

  const child1 = Object3D.create();

  const child2 = Object3D.create();

  const child3 = Object3D.create();

  child2.parent = child1;

  child3.parent = child2;

  Mat4.translationMat4(100, 0, 0, child2.getTransform());

  child1.renderer = new RenderComponent(
    geometry,
    material,
  );

  child3.renderer = new RenderComponent(
    geometry,
    material,
  );

  child2.renderer = new RenderComponent(
    box,
    material,
  );

  child1.parent = rootObj;

  let timeSecond = 0;
  const frameTime = Math.floor(1000 / 60);

  const renderer = new WebglRenderer(canvas);

  const cameraObject = Object3D.create();

  const camera = cameraObject.addComponent(Camera);

  camera.setParams(renderer.gl.canvas.width / renderer.gl.canvas.height);

  camera.getObject3D().parent = rootObj;
  camera.getObject3D().setTransform(
    (Mat4.translationMat4(0, 150, 300, camera.getObject3D().getTransform()))
  );

  renderer.renderObjectTree(rootObj, camera)

  const v = new Mat4();
  const v2 = new Mat4();

  const update = () => {
    timeSecond = timeSecond + frameTime / 1000;

    const deltT = frameTime / 1000;

    Mat4.rotateYMat4(0.5 * deltT, v);
    // Mat4.rotateXMat4(1.3 * deltT, v2);
    // Mat4.multiply(v, v2, v);

    Mat4.multiply(v, child2.getTransform(), child2.getTransform());

    Mat4.rotateYMat4(5 * deltT, v);
    Mat4.multiply(v, child3.getTransform(), child3.getTransform());

    const x = 50 * Math.sin(timeSecond)

    Mat4.translationMat4(x, 0, 0, v);

    const translateMat4 = Mat4.copyAtoB(rootObj.getTransform(), new Mat4());
    translateMat4.elements[12] = x;
    rootObj.setTransform(translateMat4)

    // Mat4.multiply(v, child1.transform, child1.transform);

    // Mat3.multiply( child2.transform.localMat4, v, child2.transform.localMat4);

    renderer.renderObjectTree(rootObj, camera)

    // requestAnimationFrame(update);
    // setTimeout(update, 500)
  }

  update();
}

startPaint();


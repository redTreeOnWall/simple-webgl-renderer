import { createProgramFromSource } from "../src/core/ShaderProgamUtils";
import { BufferGeometry } from "../src/core/BufferGeometry";
// import { awaitTime } from "../src/utils/timeUtils";
import { Material, UniformType } from "../src/core/Material/Material";
import { Object3D } from "../src/core/Object";

import {RenderComponent} from "../src/core/RenderComponent";
import {Mat4} from "../src/math/Mat4";

import {ObjParser} from "../src/parser/ObjParser";
import {loadImage} from "../src/utils/ImageLoader";
import {Texture} from "../src/core/Texture";


const startPaint = async () => {

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  const image1 = await loadImage('../res/module/women/tex/rp_mei_posed_001_dif_2k.jpg');
  const texture1 = Texture.create(gl, image1);

  const objContent = await (await fetch(`../res/module/women/women.obj?key=${Math.random()}`)).text();
  // const objContent = await (await fetch(`../res/module/box.obj?key=${Math.random()}`)).text();

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

  const createObject = (xOffset: number, yOffset: number) => {
    const program = createProgramFromSource(
      gl,
      `
attribute vec4 a_position;
attribute vec4 a_normal;
attribute vec4 a_uv;

uniform vec4 u_time;

uniform mat4 u_matrix;

uniform mat4 u_projection;

varying vec4 v_time;
varying vec4 v_color;
varying vec2 v_uv;

void main() {
  v_time = u_time;
  v_color = a_normal;
  v_uv = vec2(a_uv.x,1.0 -a_uv.y);

  gl_Position =u_projection * u_matrix * a_position;
}
    
    `,
      `
precision mediump float;
 
varying vec4 v_time;
varying vec4 v_color;
varying vec2 v_uv;

uniform sampler2D u_image;

void main() {

  vec4 tex = texture2D(u_image, v_uv);

  vec3 light = normalize(vec3(1.0, 1.0, 1.0));
  float col = dot(light, v_color.xyz);
  col = 0.5 + smoothstep(0.0, 1.5 ,col + 0.5) * 0.5;
  gl_FragColor = tex;
}
    `,
    ) as WebGLProgram;


    const geometry = new BufferGeometry();
    geometry.originData = {
      a_position: {
        size: 3,
        data: positionData,
      },
      a_normal: {
        size: 3,
        data: normalData,
      },
      a_uv: {
        size: 3,
        data: texcoordData,
      },
    };

    geometry.initBuffer(gl);


    const cameraMatrix = Mat4.translationMat4(0, +120, 100, new Mat4());

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
      },
      u_image: {
        type: UniformType.texture,
        value: texture1.texture,
        location: -1,
      },
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

  for(let i = 0 ; i < 1 ; i++) {
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

    gl.clearColor(0.2,0.2,0.2,1);

    for (let i = 0; i < objects.length; i += 1) {
      const o = objects[i];
      const material = o.renderer?.material as Material;
      const geometry = o.renderer?.geometry as BufferGeometry;
      const transform = o.transform;


      //TODO do nothing if program or buffer is not changed
      gl.useProgram(material.program);
      (material.uniforms.u_time.value as number[])[0] = timeSecond;
      
      const dAngle = Math.PI * 2 * 0.1 * timeSecond  + i * 0.1;
      // Mat4.translationMat4(dx, dx, 0, __tempMat41);
      // Mat4.rotateXMat4(dAngle, __tempMat41);
      // Mat4.rotateYMat4(dAngle, __tempMat41);
      // Mat4.rotateXMat4(0.2 * dAngle, __tempMat41);
      Mat4.rotateYMat4( 0.6 * dAngle, __tempMat42);

      Mat4.multiply(__tempMat41, __tempMat42, transform.localMat4);

      Mat4.translationMat4(-3 + i * 1.5, 0, 0, __tempMat41);
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

import {Mat4} from "../math/Mat4";
import {BufferGeometry} from "./BufferGeometry";
import {Camera} from "./Camera";
import {forEachTreeNode} from "./ITreeNode";
import {Material, UniformType} from "./Material/Material";
import {Object3D} from "./Object3D";
import {ShaderLib} from "./shaderlib/ShaderLib";

export class WebglRenderer {
  gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl; 
  }

  renderObjectTree(root: Object3D, camera: Camera) {
    this.clear();

    const list: Object3D[] = [];


    forEachTreeNode(root, (node) => {
      list.push(node);
    });

    list.forEach((node) => {
      // update matrix
      if (node.parent === null) {
        Mat4.setFromArray(node.cachedWorldTransform, node.transform.elements);
      } else {
        Mat4.multiply(node.parent.cachedWorldTransform, node.transform, node.cachedWorldTransform);
      }
    });

    list.forEach((node) => {
      node.update();
    });

    // render
    camera.updateViewProjectionMatrix();

    list.forEach((node) => {
      this.renderOneObject(node, camera);
    });
  }

  clear() {

  }

  updateState() {
    // TODO
  }

  renderOneObject (obj: Object3D, camera: Camera) {
    if (obj.renderer === null) {
      return;
    }
    
    const renderer = obj.renderer;

    this.updateState();

    if(renderer.material.inited === false) {
      renderer.material.init(this.gl);
    }

    if(renderer.geometry.inited === false) {
      renderer.geometry.initBuffer(this.gl);
    }

    this.gl.useProgram(renderer.material.program);

    renderer.material.uniforms[ShaderLib.uMatrix].value = obj.cachedWorldTransform.elements;
    renderer.material.uniforms[ShaderLib.uProjection].value = camera.viewProjectionMatrix.elements;
  
    renderer.geometry.setAttributes(this.gl, renderer.material.program as WebGLProgram);
    this.updateUniformsOfMaterial(renderer.material);
    this.useBuffer(renderer.geometry);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, renderer.geometry.vertexNum);
  }

  updateUniformsOfMaterial(material: Material) {
    let textureUnit = 0;

    for( let key in material.uniforms) {
      const uniform = material.uniforms[key];

      // TODO change to array map

      // dirty check
      if(uniform.type === UniformType.vec4) {
        this.gl.uniform4fv(uniform.location, uniform.value as Float32List);
      }
      else if(uniform.type === UniformType.texture){
        this.gl.uniform1i(uniform.location, textureUnit);
        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
        // TODO type check
        this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value as WebGLTexture);
        textureUnit += 1;
      } else if (uniform.type === UniformType.mat4) {
        this.gl.uniformMatrix4fv(uniform.location, false, uniform.value as Float32List);
      }
    }
  }

  useBuffer(geometry: BufferGeometry) {
    for (let key in geometry.bufferData) {
      const buffer = geometry.bufferData[key];
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.vertexBuffer);
      this.gl.vertexAttribPointer(buffer.attributeLocation, buffer.size, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(buffer.attributeLocation);
    }
  }
}

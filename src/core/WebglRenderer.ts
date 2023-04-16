import {Mat4} from "../math/Mat4";
import {BufferGeometry} from "./BufferGeometry";
import {Camera} from "./Camera";
import {forEachTreeNode} from "./ITreeNode";
import {Material, UniformType} from "./Material/Material";
import {Object3D} from "./Object3D";
import {ShaderLib} from "./shaderlib/ShaderLib";

export class WebglRenderer {
  private _gl: WebGLRenderingContext;

  get gl() {
    return this._gl;
  }

  private _canvas: HTMLCanvasElement;

  get canvas() {
    return this._canvas;
  }

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new RendererError("Can not get webgl context from canvas!");
    }
    this._gl = gl;
    this.canvasSizeChanged();
    this.setDefaultProperties();
  }

  setDefaultProperties() {
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  canvasSizeChanged() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  renderObjectTree(root: Object3D, camera: Camera) {
    this.clear();

    const list: Object3D[] = [];


    forEachTreeNode(root, (node) => {
      list.push(node);
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
    this.gl.clearColor(0.2, 0.2, 0.2, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  updateState() {
    // TODO
  }

  private currentProgram: WebGLProgram | null = null;
  renderOneObject(obj: Object3D, camera: Camera) {
    if (obj.renderer === null) {
      return;
    }

    const renderer = obj.renderer;

    this.updateState();

    if (renderer.material.inited === false) {
      renderer.material.init(this.gl);
    }

    if (renderer.geometry.inited === false) {
      renderer.geometry.initBuffer(this.gl);
    }

    if (this.currentProgram !== renderer.material.program) {
      this.gl.useProgram(renderer.material.program);
      this.currentProgram = renderer.material.program;
    }

    renderer.material.uniforms[ShaderLib.uMatrix].value = obj.getGlobaleTransform().elements;
    renderer.material.uniforms[ShaderLib.uProjection].value = camera.viewProjectionMatrix.elements;

    const cameraPosition = renderer.material.uniforms[ShaderLib.uProjection];
    if (cameraPosition) {
      cameraPosition.value = camera.viewProjectionMatrix.elements;
    }

    renderer.geometry.setAttributes(this.gl, renderer.material.program as WebGLProgram);
    this.updateUniformsOfMaterial(renderer.material);
    this.useBuffer(renderer.geometry);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, renderer.geometry.vertexNum);
  }

  updateUniformsOfMaterial(material: Material) {
    let textureUnit = 0;

    for (let key in material.uniforms) {
      const uniform = material.uniforms[key];

      // TODO change to array map

      // dirty check
      if (uniform.type === UniformType.vec4) {
        this.gl.uniform4fv(uniform.location, uniform.value as Float32List);
      }
      else if (uniform.type === UniformType.texture) {
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

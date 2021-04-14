
interface BufferOriginData {
  [key: string]: {
    size: number,
    data: Array<number>,
  }
}

interface BufferData {
  [key: string]: {
    size: number,
    attributeLocation: number,
    vertxBuffer: WebGLBuffer | null,
  }

}

export class BufferGeometry {
  originData: BufferOriginData = {};

  bufferData: BufferData = {};

  vertxNum = -1

  createVBO(gl: WebGLRenderingContext) {
    for (let key in this.originData) {
      const oneOriginData = this.originData[key];
      const VBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, VBO);

      this.bufferData[key] = {
        size: oneOriginData.size,
        vertxBuffer: VBO,
        attributeLocation: -1,
      };
    }
  }

  syncBufferData(gl: WebGLRenderingContext) {
    for (let key in this.bufferData) {
      const oneBufferData = this.bufferData[key];
      const oneOriginData = this.originData[key];

      gl.bindBuffer(gl.ARRAY_BUFFER, oneBufferData.vertxBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(oneOriginData.data), gl.STATIC_DRAW);

      oneBufferData.size = oneOriginData.size;

      const oneVertxNum = Math.floor(oneOriginData.data.length / oneOriginData.size);

      if (this.vertxNum === -1) {
        this.vertxNum = oneVertxNum;
      } else {
        if (this.vertxNum !== oneVertxNum) {
          console.error(`origin data is not correct:`)
          console.error(this.originData);
        }
      }
    }
  }

  setAttributes(gl: WebGLRenderingContext, program: WebGLProgram) {
    for (let key in this.bufferData) {
      const buffer = this.bufferData[key];
      const location = gl.getAttribLocation(program, key);
      if (location < 0) {
        console.error(`can not find location name: ${key}`);
      }
      buffer.attributeLocation = location;
    }
  }

  initBuffer(gl: WebGLRenderingContext, program: WebGLProgram) {
    this.createVBO(gl);
    this.syncBufferData(gl);
    this.setAttributes(gl, program);
  }

  useBuffer(gl: WebGLRenderingContext) {
    for (let key in this.bufferData) {
      const buffer = this.bufferData[key];
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertxBuffer);
      gl.vertexAttribPointer(buffer.attributeLocation, buffer.size, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(buffer.attributeLocation);
    }
  }

}
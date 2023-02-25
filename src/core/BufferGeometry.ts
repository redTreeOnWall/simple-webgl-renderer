
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
    vertexBuffer: WebGLBuffer | null,
  }
}

export class BufferGeometry {
  originData: BufferOriginData = {};

  bufferData: BufferData = {};

  vertexNum = -1

  inited = false;

  createVBO(gl: WebGLRenderingContext) {
    for (let key in this.originData) {
      const oneOriginData = this.originData[key];
      const VBO = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, VBO);

      this.bufferData[key] = {
        size: oneOriginData.size,
        vertexBuffer: VBO,
        attributeLocation: -1,
      };
    }
  }

  syncBufferData(gl: WebGLRenderingContext) {
    for (let key in this.bufferData) {
      const oneBufferData = this.bufferData[key];
      const oneOriginData = this.originData[key];

      gl.bindBuffer(gl.ARRAY_BUFFER, oneBufferData.vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(oneOriginData.data), gl.STATIC_DRAW);

      oneBufferData.size = oneOriginData.size;

      const oneVertexNum = Math.floor(oneOriginData.data.length / oneOriginData.size);

      if (this.vertexNum === -1) {
        this.vertexNum = oneVertexNum;
      } else {
        if (this.vertexNum !== oneVertexNum) {
          console.error(`origin data is not correct:`)
        }
      }
    }
  }

  setAttributes(gl: WebGLRenderingContext, program: WebGLProgram) {
    // TODO program dirty check
    for (let key in this.bufferData) {
      const buffer = this.bufferData[key];
      const location = gl.getAttribLocation(program, key);
      if (location < 0) {
        console.error(`can not find location name: ${key}`);
      }
      buffer.attributeLocation = location;
    }
  }

  initBuffer(gl: WebGLRenderingContext) {
    this.inited = true;
    this.createVBO(gl);
    this.syncBufferData(gl);
    // this.setAttributes(gl, program);
  }

  useBuffer(gl: WebGLRenderingContext) {
    for (let key in this.bufferData) {
      const buffer = this.bufferData[key];
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertexBuffer);
      gl.vertexAttribPointer(buffer.attributeLocation, buffer.size, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(buffer.attributeLocation);
    }
  }
}

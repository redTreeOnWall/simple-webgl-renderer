
export const createShadar = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type) as WebGLShader;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

export const createProgram = (
  gl: WebGLRenderingContext,
  vertxShader: WebGLShader,
  fragmentShader: WebGLShader
) => {
  const program = gl.createProgram();
  if(program === null) {
    return;
  }

  gl.attachShader(program, vertxShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if(success){
    return program;
  }
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

export const createProgramFromeSource = (
  gl: WebGLRenderingContext,
  vertxShaderSource: string,
  fragmentShaderSource: string, 
) => {
  const vertxShader = createShadar(gl, gl.VERTEX_SHADER, vertxShaderSource) as WebGLShader;
  const fragmentShader = createShadar(gl, gl.FRAGMENT_SHADER, fragmentShaderSource) as WebGLShader;
  return createProgram(gl, vertxShader, fragmentShader);
}


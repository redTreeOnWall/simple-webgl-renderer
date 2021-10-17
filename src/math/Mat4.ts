
export class Mat4{
  // TODO
  elements: Array<number> = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1,
  ];

  set(
    e00: number, e01: number, e02: number, e03: number,
    e10: number, e11: number, e12: number, e13: number,
    e20: number, e21: number, e22: number, e23: number,
    e30: number, e31: number, e32: number, e33: number,
  ) {
    this.elements[0] = e00;
    this.elements[1] = e01;
    this.elements[2] = e02;
    this.elements[3] = e03;

    this.elements[4] = e10;
    this.elements[5] = e11;
    this.elements[6] = e12;
    this.elements[7] = e13;

    this.elements[8] = e20;
    this.elements[9] = e21;
    this.elements[10] = e22;
    this.elements[11] = e23;

    this.elements[12] = e30;
    this.elements[13] = e31;
    this.elements[14] = e32;
    this.elements[15] = e33;
  }

  static multiply(a: Mat4, b: Mat4, outMat: Mat4) {
    const ae = a.elements;
    const be = b.elements;
    const oe = outMat.elements;

    const a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
    const a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
    const a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
    const a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

    const b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
    const b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
    const b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
    const b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

    oe[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    oe[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    oe[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    oe[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    oe[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    oe[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    oe[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    oe[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    oe[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    oe[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    oe[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    oe[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    oe[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    oe[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    oe[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    oe[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return outMat;
  }

  static setToArray(mat4: Mat4, array: number[]) {
    for (let i = 0; i < mat4.elements.length; i++) {
      array[i] = mat4.elements[i];
    }

    return array;
  }

  static setFromArray(mat4: Mat4, array: number[]) {
    for (let i = 0; i < mat4.elements.length; i++) {
      const element = array[i];

      if (element !== undefined) {
        mat4.elements[i] = element;
      } else {
        mat4.elements[i] = 0;
      }
    }

    return mat4;
  }

  static translationMat4(dx: number, dy: number, dz: number, result: Mat4) {
    result.set(
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      dx, dy, dz, 1,
    );

    return result;
  }

  static rotateXMat4(angle: number, result: Mat4) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
      
    result.set(
      1, 0, 0, 0,
      0, cos, sin, 0,
      0, -sin, cos, 0,
      0, 0, 0, 1,
    );

    return result;
  }

  static rotateYMat4(angle: number, result: Mat4) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
      
    result.set(
      cos, 0, -sin, 0,
      0, 1, 0, 0,
      sin, 0, cos, 0,
      0, 0, 0, 1,
    );

    return result;
  }

  static rotateZMat4(angle: number, result: Mat4) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
      
    result.set(
       cos, sin, 0, 0,
      -sin, cos, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    );

    return result;
  }

  static scaleMat4(sx: number, sy: number, sz: number, result: Mat4) {
    result.set(
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    );
  }

  static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number, result: Mat4) {
    result.set(
      2 / (right - left), 0, 0, 0,
      0, 2 / (top - bottom), 0, 0,
      0, 0, 2 / (near - far), 0,
 
      (left + right) / (left - right),
      (bottom + top) / (bottom - top),
      (near + far) / (near - far),
      1,
    );

    return result;
  }

  static perspective(fov: number, aspect: number, near: number, far: number, result: Mat4) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    const deepth = 1.0 / (near - far);

    result.set(
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * deepth, -1,
      0, 0, near * far * deepth * 2, 0
    );
    return result;
  }

  static inverse(origin: Mat4, result: Mat4) {
    const m = origin.elements;
    const m00 = m[0 * 4 + 0];
    const m01 = m[0 * 4 + 1];
    const m02 = m[0 * 4 + 2];
    const m03 = m[0 * 4 + 3];
    const m10 = m[1 * 4 + 0];
    const m11 = m[1 * 4 + 1];
    const m12 = m[1 * 4 + 2];
    const m13 = m[1 * 4 + 3];
    const m20 = m[2 * 4 + 0];
    const m21 = m[2 * 4 + 1];
    const m22 = m[2 * 4 + 2];
    const m23 = m[2 * 4 + 3];
    const m30 = m[3 * 4 + 0];
    const m31 = m[3 * 4 + 1];
    const m32 = m[3 * 4 + 2];
    const m33 = m[3 * 4 + 3];
    const tmp_0  = m22 * m33;
    const tmp_1  = m32 * m23;
    const tmp_2  = m12 * m33;
    const tmp_3  = m32 * m13;
    const tmp_4  = m12 * m23;
    const tmp_5  = m22 * m13;
    const tmp_6  = m02 * m33;
    const tmp_7  = m32 * m03;
    const tmp_8  = m02 * m23;
    const tmp_9  = m22 * m03;
    const tmp_10 = m02 * m13;
    const tmp_11 = m12 * m03;
    const tmp_12 = m20 * m31;
    const tmp_13 = m30 * m21;
    const tmp_14 = m10 * m31;
    const tmp_15 = m30 * m11;
    const tmp_16 = m10 * m21;
    const tmp_17 = m20 * m11;
    const tmp_18 = m00 * m31;
    const tmp_19 = m30 * m01;
    const tmp_20 = m00 * m21;
    const tmp_21 = m20 * m01;
    const tmp_22 = m00 * m11;
    const tmp_23 = m10 * m01;

    const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
        (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
        (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
        (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
        (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    result.set(
      d * t0,
      d * t1,
      d * t2,
      d * t3,
      d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
            (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
      d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
            (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
      d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
            (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
      d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
            (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
      d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
            (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
      d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
            (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
      d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
            (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
      d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
            (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
      d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
            (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
      d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
            (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
      d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
            (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
      d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
            (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
    );

    return result;
  }

  static mat4PolarDecompose(origin: Mat4, result: Mat4) {
  
  }
}


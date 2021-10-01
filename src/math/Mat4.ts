
export class Mat4{
  // TODO
  elements: Array<number> = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,0,
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
  }
}



enum LineType {
  none,
  vertx,
  normal,
  face,
  texcoord,
  comment,
  other,
}

export class ObjFileStruct {
  verts: number[] = [];
  texcoord: number[] = [];
  normal: number[] = [];
  faces: number[] = [];
}
/**
 * /////////////////////////////////////////////////////////////////////////////////////////
 * obj格式解析， 暂时只支持纯粹三角面的索引， 也不支持多个物体
 * /////////////////////////////////////////////////////////////////////////////////////////
 */
export class ObjParser {
  static equalString ( smallString: string, bigString: string, startIndex: number) {
    for (let i =0 ; i< smallString.length; i++){
      if(smallString[i] !== bigString[startIndex + i]) {
        return false;
      }
    }
    return true;
  }

  static readToken (str: string, startIndex: number, finishChar: string) {
    for (let i = startIndex ; i < str.length; i++) {
      const char = str[i];
      if (char === finishChar || char === '\r' || char === '\n') {
        return i;
      }
    }

    return str.length;
  }

  static readTheeNumber(i: number, content: string, pushToArray: number[]) {
    let offset = i;
    for (let j = 0; j < 3; j++) {

      const index = this.readToken(content, offset, ' ');

      const value = content.substring(offset, index)
      const floatValue = parseFloat(value);

      pushToArray.push(floatValue);

      offset = index + 1;
    }

    return offset -1;
  }

  public static parseObj(objContent: string) {
    const struct = new ObjFileStruct();

    let lineType = LineType.none;

    for (let i = 0; i< objContent.length; i++) {
      const char = objContent[i];
      if(char === '\n' || char === '\r') {
        lineType = LineType.none;
        continue;
      }


      if(lineType === LineType.none) {
        if (this.equalString('v  ', objContent, i)) {
          lineType = LineType.vertx;
          i += 3;
        } else if (this.equalString('vt ', objContent, i)) {
          lineType = LineType.texcoord;
          i += 3;
        } else if (this.equalString('vn ', objContent, i)) {
          lineType = LineType.normal;
          i += 3;
        } else if (this.equalString('f ', objContent, i)) {
          lineType = LineType.face;
          i += 2;
        } else if (this.equalString('#', objContent, i)) {
          lineType = LineType.comment;
          i += 1;
        } else {
          lineType = LineType.other;
        }
      }

      if (lineType === LineType.other ) {
        continue;
      }
      
      if (lineType === LineType.comment) {
        continue;
      }

      if (lineType === LineType.vertx) {
        const lineEndIndex = this.readTheeNumber(i, objContent, struct.verts);
        i = lineEndIndex;
        continue;
      }

      if (lineType === LineType.normal) {
        const lineEndIndex = this.readTheeNumber(i, objContent, struct.normal);
        i = lineEndIndex;
        continue;
      }

      if (lineType === LineType.texcoord) {
        const lineEndIndex = this.readTheeNumber(i, objContent, struct.texcoord);
        i = lineEndIndex;
        continue;
      }

      if (lineType === LineType.face) {
        let offset = i;
        for (let p = 0; p < 3; p++) {
          for (let n = 0; n < 3; n++) {
            const splitChar = n === 2 ? ' ' : '/';
            const newIndex = this.readToken(objContent, offset, splitChar);
            const valueString = objContent.substring(offset, newIndex)
            const valueNumber = parseFloat(valueString);
            struct.faces.push(valueNumber);
            offset = newIndex + 1;
          }
        }

        i = offset - 1;
      }
    }

    return struct;
  }
}

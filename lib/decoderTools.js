//------------------------------------------------------------------------------
export function decodeBitField(value) {
  const ret = [];
  for (let n = 0; n < 8; n++) {
    ret[n] = !!((value >> (7 - n)) & 0x1);
  }
  return ret;
}

//------------------------------------------------------------------------------
export function decodePidList(data, pidOffset = 0) {
  return ([
    ...decodeBitField(data[0]),
    ...decodeBitField(data[1]),
    ...decodeBitField(data[2]),
    ...decodeBitField(data[3]),
  ]).map((v, i) => (v ? i + pidOffset + 1 : 0)).filter(v => v);
}

//------------------------------------------------------------------------------
export function decodeVandPpc(data) {
  return [data[0] / 200, data[1] / 1.28 - 100];
}

import { Buffer } from 'node:buffer';

import { getPid } from './pids.js'
import { getDecoder } from './decoders.js'

const MAX_PAYLOAD_BYTES = 8;

//------------------------------------------------------------------------------
function decode(buffer) {
  //console.log(`Data:`, buffer);
  const bytes = buffer[0] - 2;
  const modeId = buffer[1];
  const pidId = buffer[2];

  const pid = getPid(pidId, modeId);
  if (!pid) {
    throw new ReferenceError(`No PID for 0x${modeId.toString(16)}:0x${pidId.toString(16)}`);
  }

  const decode = getDecoder(pidId, modeId);
  if (!decode) {
    throw new ReferenceError(`No decoder for 0x${modeId.toString(16)}:0x${pidId.toString(16)}`);
  }

  if (pid.bytes !== bytes) {
    throw new RangeError(`Invalid byte count. Expected ${pid.bytes}, but have ${bytes} bytes for 0x${modeId.toString(16)}:0x${pidId.toString(16)}`);
  }

  const dataBuffer = Buffer.alloc(MAX_PAYLOAD_BYTES);
  if (buffer.copy(dataBuffer, 0, 3) !== bytes) {
    throw new RangeError(`Buffer incomplete. Expected ${bytes} bytes for 0x${modeId.toString(16)}:0x${pidId.toString(16)}`);
  }

  return [
    decode(dataBuffer),
    pid.unit,
  ];
}

export default decode;

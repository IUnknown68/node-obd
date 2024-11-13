import {
	decodeBitField,
	decodePidList,
	decodeVandPpc,
} from './decoderTools.js';

//------------------------------------------------------------------------------
export function getDecoder(pidId, modeId = 1) {
  const service = decoders[modeId];
  return service && service[pidId];
}

//------------------------------------------------------------------------------
const decoders = {
  0x01: {
    0x00: (data) => { // PIDs supported 00-20
      return decodePidList(data);
    },
    //////////// TODO
    0x01: (data) => { // Monitor status since DTCs cleared
      return data.readUInt32BE(0);
    },
    0x02: (data) => { // DTC that caused required freeze frame data storage
      return data.readUInt16BE(0);
    },
    //////////// TODO
    0x03: (data) => { // Fuel system 1 and 2 status
      return [data[0], data[1]];
    },
    0x04: (data) => { // Calculated LOAD Value
      return data[0] / 2.55;
    },
    0x05: (data) => { // Engine Coolant Temperature
      return data[0] - 40;
    },
    0x06: (data) => { // Short Term Fuel Trim - Bank 1,3
      return data[0] / 1.28 - 100;
    },
    0x07: (data) => { // Long Term Fuel Trim - Bank 1,3
      return data[0] / 1.28 - 100;
    },
    0x08: (data) => { // Short Term Fuel Trim - Bank 2,4
      return data[0] / 1.28 - 100;
    },
    0x09: (data) => { // Long Term Fuel Trim - Bank 2,4
      return data[0] / 1.28 - 100;
    },
    0x0a: (data) => { // Fuel Pressure
      return data[0] * 3;
    },
    0x0b: (data) => { // Intake Manifold Absolute Pressure
      return data[0];
    },
    0x0c: (data) => { // Engine RPM
      return data.readUInt16BE(0) / 4;
    },
    0x0d: (data) => { // Vehicle Speed Sensor
      return data[0];
    },
    0x0e: (data) => { // Ignition Timing Advance for #1 Cylinder
      return data[0] / 2 - 64;
    },
    0x0f: (data) => { // Intake Air Temperature
      return data[0] - 40;
    },
    0x10: (data) => { // Air Flow Rate from Mass Air Flow Sensor
      return data.readUInt16BE(0) / 100;
    },
    0x11: (data) => { // Absolute Throttle Position
      return data[0] / 2.55;
    },
    0x12: (data) => { // Commanded Secondary Air Status
      switch (data[0]) {
        case 1:
          return 'Upstream';
        case 2:
          return 'Downstream of catalytic converter';
        case 3:
          return 'From the outside atmosphere or off';
        case 4:
          return 'Pump commanded on for diagnostics';
        default:
          return undefined;
      }
    },
    0x13: (data) => { // Location of Oxygen Sensors
      return decodeBitField(data[0]).reverse();
    },
    0x14: (data) => { // Bank 1 - Sensor 1/Bank 1 - Sensor 1 Oxygen Sensor Output Voltage / Short Term Fuel Trim
      return decodeVandPpc(data);
    },
    0x15: (data) => { // Bank 1 - Sensor 2/Bank 1 - Sensor 2 Oxygen Sensor Output Voltage / Short Term Fuel Trim
      decodeVandPpc(data);
    },
    0x16: (data) => { // Bank 1 - Sensor 3/Bank 2 - Sensor 1 Oxygen Sensor Output Voltage / Short Term Fuel Trim
      decodeVandPpc(data);
    },
    0x17: (data) => { // Bank 1 - Sensor 4/Bank 2 - Sensor 2 Oxygen Sensor Output Voltage / Short Term Fuel Trim
      decodeVandPpc(data);
    },
    0x18: (data) => { // Bank 2 - Sensor 1/Bank 3 - Sensor 1 Oxygen Sensor Output Voltage / Short Term Fuel Trim
      decodeVandPpc(data);
    },
    0x19: (data) => { // Bank 2 - Sensor 2/Bank 3 - Sensor 2 Oxygen Sensor Output Voltage / Short Term Fuel Trim
      decodeVandPpc(data);
    },
    0x1a: (data) => { // Bank 2 - Sensor 3/Bank 4 - Sensor 1 Oxygen Sensor Output Voltage / Short Term Fuel Trim
      decodeVandPpc(data);
    },
    0x1b: (data) => { // Bank 2 - Sensor 4/Bank 4 - Sensor 2 Oxygen Sensor Output Voltage / Short Term Fuel Trim
      decodeVandPpc(data);
    },
    0x1c: (data) => { // OBD requirements to which vehicle is designed
      switch (data[0]) {
        case 1:
          return 'OBD-II (CARB)';
        case 2:
          return 'OBD (EPA)';
        case 3:
          return 'OBD and OBD-II';
        case 4:
          return 'OBD-I';
        case 5:
          return 'Not OBD compliant';
        case 6:
          return 'EOBD (Europe)';
        case 7:
          return 'EOBD and OBD-II';
        case 8:
          return 'EOBD and OBD';
        case 9:
          return 'EOBD, OBD and OBD II';
        case 10:
          return 'JOBD (Japan)';
        case 11:
          return 'JOBD and OBD II';
        case 12:
          return 'JOBD and EOBD';
        case 13:
          return 'JOBD, EOBD, and OBD II';
        case 14:
          return 'Reserved';
        case 15:
          return 'Reserved';
        case 16:
          return 'Reserved';
        case 17:
          return 'Engine Manufacturer Diagnostics (EMD)';
        case 18:
          return 'Engine Manufacturer Diagnostics Enhanced (EMD+)';
        case 19:
          return 'Heavy Duty On-Board Diagnostics (Child/Partial) (HD OBD-C)';
        case 20:
          return 'Heavy Duty On-Board Diagnostics (HD OBD)';
        case 21:
          return 'World Wide Harmonized OBD (WWH OBD)';
        case 22:
          return 'Reserved';
        case 23:
          return 'Heavy Duty Euro OBD Stage I without NOx control (HD EOBD-I)';
        case 24:
          return 'Heavy Duty Euro OBD Stage I with NOx control (HD EOBD-I N)';
        case 25:
          return 'Heavy Duty Euro OBD Stage II without NOx control (HD EOBD-II)';
        case 26:
          return 'Heavy Duty Euro OBD Stage II with NOx control (HD EOBD-II N)';
        case 27:
          return 'Reserved';
        case 28:
          return 'Brazil OBD Phase 1 (OBDBr-1)';
        case 29:
          return 'Brazil OBD Phase 2 (OBDBr-2)';
        case 30:
          return 'Korean OBD (KOBD)';
        case 31:
          return 'India OBD I (IOBD I)';
        case 32:
          return 'India OBD II (IOBD II)';
        case 33:
          return 'Heavy Duty Euro OBD Stage VI (HD EOBD-IV)';
        default:
          return 'Other';
      }
    },
    0x1d: (data) => { // Location of oxygen sensors
      return decodeBitField(data[0]).reverse();
    },
    0x1e: (data) => { // Auxiliary Input Status
      return data[0] & 0x01;
    },
    0x1f: (data) => { // Time Since Engine Start
      return data.readUInt16BE(0);
    },
    //////////// TODO
    0x20: (data) => { // PIDs supported 21-40
      return decodePidList(data, 0x20);
    },
    //////////// TODO
    0x21: (data) => { // Distance Travelled While MIL is Activated
      return data.readUInt16BE(0);
    },
    0x22: (data) => { // Fuel Rail Pressure relative to manifold vacuum
      return data.readUInt16BE(0) * 0.079;
    },
    0x23: (data) => { // Fuel Rail Pressure (diesel)
      return data.readUInt16BE(0) * 10;
    },
    0x24: (data) => { // Bank 1 - Sensor 1/Bank 1 - Sensor 1 (wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Voltage
      return [(data.readUInt16BE(0) * 2) / 65536, (data.readUInt16BE(2) * 8) / 65536];
    },
    0x25: (data) => { // Bank 1 - Sensor 2/Bank 1 - Sensor 2 (wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Voltage
      return [(data.readUInt16BE(0) * 2) / 65536, (data.readUInt16BE(2) * 8) / 65536];
    },
    0x26: (data) => { // Bank 1 - Sensor 3 /Bank 2 - Sensor 1(wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Voltage
      return [(data.readUInt16BE(0) * 2) / 65536, (data.readUInt16BE(2) * 8) / 65536];
    },
    0x27: (data) => { // Bank 1 - Sensor 4 /Bank 2 - Sensor 2(wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Voltage
      return [(data.readUInt16BE(0) * 2) / 65536, (data.readUInt16BE(2) * 8) / 65536];
    },
    0x28: (data) => { // Bank 2 - Sensor 1 /Bank 3 - Sensor 1(wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Voltage
      return [(data.readUInt16BE(0) * 2) / 65536, (data.readUInt16BE(2) * 8) / 65536];
    },
    0x29: (data) => { // Bank 2 - Sensor 2 /Bank 3 - Sensor 2(wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Voltage
      return [(data.readUInt16BE(0) * 2) / 65536, (data.readUInt16BE(2) * 8) / 65536];
    },
    0x2a: (data) => { // Bank 2 - Sensor 3 /Bank 4 - Sensor 1(wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Voltage
      return [(data.readUInt16BE(0) * 2) / 65536, (data.readUInt16BE(2) * 8) / 65536];
    },
    0x2b: (data) => { // Bank 2 - Sensor 4 /Bank 4 - Sensor 2(wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Voltage
      return [(data.readUInt16BE(0) * 2) / 65536, (data.readUInt16BE(2) * 8) / 65536];
    },
    0x2c: (data) => { // Commanded EGR
      return data[0] / 2.55;
    },
    0x2d: (data) => { // EGR Error
      return data[0] / 2.55 - 100;
    },
    0x2e: (data) => { // Commanded Evaporative Purge
      return data[0] / 2.55;
    },
    0x2f: (data) => { // Fuel Level Input
      return data[0] / 2.55;
    },
    0x30: (data) => { // Number of warm-ups since diagnostic trouble codes cleared
      return data[0];
    },
    0x31: (data) => { // Distance since diagnostic trouble codes cleared
      return data.readUInt16BE(0);
    },
    0x32: (data) => { // Evap System Vapour Pressure
      // TODO: Check
      return readInt16BE(data, 2) / 4;
    },
    0x33: (data) => { // Barometric Pressure
      return data[0];
    },
    0x34: (data) => { // Bank 1 - Sensor 1/Bank 1 - Sensor 1 (wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Current
      return [(data.readUInt16BE(0) * 2) / 65536, data.readUInt16BE(2) / 256 - 128];
    },
    0x35: (data) => { // Bank 1 - Sensor 2/Bank 1 - Sensor 2 (wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Current
      return [(data.readUInt16BE(0) * 2) / 65536, data.readUInt16BE(2) / 256 - 128];
    },
    0x36: (data) => { // Bank 1 - Sensor 3/Bank 2 - Sensor 1 (wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Current
      return [(data.readUInt16BE(0) * 2) / 65536, data.readUInt16BE(2) / 256 - 128];
    },
    0x37: (data) => { // Bank 1 - Sensor 4/Bank 2 - Sensor 2 (wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Current
      return [(data.readUInt16BE(0) * 2) / 65536, data.readUInt16BE(2) / 256 - 128];
    },
    0x38: (data) => { // Bank 2 - Sensor 1/Bank 3 - Sensor 1 (wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Current
      return [(data.readUInt16BE(0) * 2) / 65536, data.readUInt16BE(2) / 256 - 128];
    },
    0x39: (data) => { // Bank 2 - Sensor 2/Bank 3 - Sensor 2 (wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Current
      return [(data.readUInt16BE(0) * 2) / 65536, data.readUInt16BE(2) / 256 - 128];
    },
    0x3a: (data) => { // Bank 2 - Sensor 3/Bank 4 - Sensor 1 (wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Current
      return [(data.readUInt16BE(0) * 2) / 65536, data.readUInt16BE(2) / 256 - 128];
    },
    0x3b: (data) => { // Bank 2 - Sensor 4/Bank 4 - Sensor 2 (wide range O2S) Oxygen Sensors Equivalence Ratio (lambda) / Current
      return [(data.readUInt16BE(0) * 2) / 65536, data.readUInt16BE(2) / 256 - 128];
    },
    0x3c: (data) => { // Catalyst Temperature Bank 1 /  Sensor 1
      return data.readUInt16BE(0) / 10 - 40;
    },
    0x3d: (data) => { // Catalyst Temperature Bank 2 /  Sensor 1
      return data.readUInt16BE(0) / 10 - 40;
    },
    0x3e: (data) => { // Catalyst Temperature Bank 1 /  Sensor 2
      return data.readUInt16BE(0) / 10 - 40;
    },
    0x3f: (data) => { // Catalyst Temperature Bank 2 /  Sensor 2
      return data.readUInt16BE(0) / 10 - 40;
    },
    0x40: (data) => { // PIDs supported 41-60
      return decodePidList(data, 0x40);
    },
    //////////// TODO
    0x41: (data) => { // Monitor status this driving cycle
      return data[0];
    },
    //////////// TODO
    0x42: (data) => { // Control module voltage
      return data.readUInt16BE(0) / 1000;
    },
    0x43: (data) => { // Absolute Load Value
      return data.readUInt16BE(0) / 2.55;
    },
    0x44: (data) => { // Fuel/air Commanded Equivalence Ratio
      return (2 * data.readUInt16BE(0)) / 65536;
    },
    0x45: (data) => { // Relative Throttle Position
      return data[0] / 2.55;
    },
    0x46: (data) => { // Ambient air temperature
      return data[0] - 40;
    },
    0x47: (data) => { // Absolute Throttle Position B
      return data[0] / 2.55;
    },
    0x48: (data) => { // Absolute Throttle Position C
      return data[0] / 2.55;
    },
    0x49: (data) => { // Accelerator Pedal Position D
      return data[0] / 2.55;
    },
    0x4a: (data) => { // Accelerator Pedal Position E
      return data[0] / 2.55;
    },
    0x4b: (data) => { // Accelerator Pedal Position F
      return data[0] / 2.55;
    },
    0x4c: (data) => { // Commanded Throttle Actuator Control
      return data[0] / 2.55;
    },
    0x4d: (data) => { // Time run by the engine while MIL activated
      return data.readUInt16BE(0);
    },
    0x4e: (data) => { // Time since diagnostic trouble codes cleared
      return data.readUInt16BE(0);
    },
    0x4f: (data) => { // External Test Equipment Configuration #1
      return [data[0], data[1], data[2], data[3] * 10];
    },
    0x50: (data) => { // External Test Equipment Configuration #2
      return data[0] * 10;
    },
    0x51: (data) => { // Fuel Type
      switch (data[0]) {
        case 1:
          return 'Gasoline';
        case 2:
          return 'Methanol';
        case 3:
          return 'Ethanol';
        case 4:
          return 'Diesel';
        case 5:
          return 'LPG';
        case 6:
          return 'CNG';
        case 7:
          return 'Propane';
        case 8:
          return 'Electric';
        case 9:
          return 'Bifuel running Gasoline';
        case 10:
          return 'Bifuel running Methanol';
        case 11:
          return 'Bifuel running Ethanol';
        case 12:
          return 'Bifuel running LPG';
        case 13:
          return 'Bifuel running CNG';
        case 14:
          return 'Bifuel running Propane';
        case 15:
          return 'Bifuel running Electricity';
        case 16:
          return 'Bifuel running electric and combustion engine';
        case 17:
          return 'Hybrid gasoline';
        case 18:
          return 'Hybrid Ethanol';
        case 19:
          return 'Hybrid Diesel';
        case 20:
          return 'Hybrid Electric';
        case 21:
          return 'Hybrid running electric and combustion engine';
        case 22:
          return 'Hybrid Regenerative';
        case 23:
          return 'Bifuel running diesel';
        default:
          return 'Not available';
      }
    },
    0x52: (data) => { // Ethanol fuel %
      return data[0] / 2.55;
    },
    0x53: (data) => { // Absolute Evap system Vapor Pressure
      return data.readUInt16BE(0) / 200;
    },
    0x54: (data) => { // Evap system vapor pressure
      return readInt16BE(data, 2);
    },
    0x55: (data) => { // Short term secondary oxygen sensor trim bank 1 and bank 3
      return [data[0] / 1.28 - 100, data[1] / 1.28 - 100];
    },
    0x56: (data) => { // Long term secondary oxygen sensor trim bank 1 and bank 3
      return [data[0] / 1.28 - 100, data[1] / 1.28 - 100];
    },
    0x57: (data) => { // Short term secondary oxygen sensor trim bank 2 and bank 4
      return [data[0] / 1.28 - 100, data[1] / 1.28 - 100];
    },
    0x58: (data) => { // Long term secondary oxygen sensor trim bank 2 and bank 4
      return [data[0] / 1.28 - 100, data[1] / 1.28 - 100];
    },
    0x59: (data) => { // Fuel rail pressure (absolute)
      return data.readUInt16BE(0) * 2;
    },
    0x5a: (data) => { // Relative accelerator pedal position
      return data[0] / 2.55;
    },
    0x5b: (data) => { // Hybrid battery pack remaining life
      return data[0] / 2.55;
    },
    0x5c: (data) => { // Engine oil temperature
      return data[0] - 40;
    },
    0x5d: (data) => { // Fuel injection timing
      return data.readUInt16BE(0) / 128 - 210;
    },
    0x5e: (data) => { // Engine fuel rate
      return data.readUInt16BE(0) / 20;
    },
    0x5f: (data) => { // Emission requirements to which vehicle is designed
      return data[0];
    },
    0x60: (data) => { // PIDs supported [0x61 - 0x80]
      return decodePidList(data, 0x60);
    },
    0x61: (data) => { // Driver's demand engine - percent torque
      return data[0] - 125;
    },
    0x62: (data) => { // Actual engine - percent torque
      return data[0] - 125;
    },
    0x63: (data) => { // Engine reference torque
      return data.readUInt16BE(0);
    },
    0x64: (data) => { // Engine percent torque data
      return [data[0], data[1], data[2], data[3], data[4]];
    },
    0x65: (data) => { // Auxiliary input / output supported
      return data.readUInt16BE(0);
    },
    0x66: (data) => { // Mass air flow sensor
      const ret = new Array(2);
      if (data[0] & 0x01) {
        ret[0] = data.readUInt16BE(1) / 32;
      }
      if (data[0] & 0x02) {
        ret[1] = data.readUInt16BE(3) / 32;
      }
      return ret;
    },
    0x67: (data) => { // Engine coolant temperature
      const ret = new Array(2);
      if (data[0] & 0x01) {
        ret[0] = data[1] - 40;
      }
      if (data[0] & 0x02) {
        ret[1] = data[2] - 40;
      }
      return ret;
    },
    0x68: (data) => { // Intake air temperature sensor
      const ret = new Array(2);
      if (data[0] & 0x01) {
        ret[0] = data[1] - 40;
      }
      if (data[0] & 0x02) {
        ret[1] = data[2] - 40;
      }
      return ret;
    },

    // TODO: 0x69-0xC4

    0xa6: (data) => { // Odometer
      return readUInt32BE(data[0]) / 10;
    },
  },
};

// const NpmBuffer = require('buffer/').Buffer
//
// type stringEncType = {
// }
//
// let strEnc: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'binary' | 'hex'  = 'utf8'
// let validateByDefault = true;
// const aliasTypes: Record<string, string> = {};
//
// function addTypeAlias(newTypeName: string, underlyingType: string) {
//   const everyType = Object.keys(readTypeDictStr);
//
//   if (everyType.indexOf(underlyingType) < 0) { throw new TypeError("Underlying type does not exist. Typo?"); }
//   else { aliasTypes[newTypeName] = underlyingType; }
// }
//
// function getDataType(val: string) {
//   const everyType = Object.keys(readTypeDictStr);
//   let dataType = val.trim().toLowerCase();
//   if (aliasTypes.hasOwnProperty(dataType)) { dataType = aliasTypes[dataType]; }
//   if (everyType.indexOf(dataType) === -1) { throw new TypeError("Invalid data type for schema: " + val + " -> " + dataType); }
//   return dataType;
// }
//
// export function setValidateByDefault(flag: boolean) { validateByDefault = flag; }
//
// export function setStringEncoding(stringEncoding: string) {
//   const requested = stringEncoding.trim().toLowerCase();
//   const available = [ 'ascii', 'utf8', 'utf16le', 'ucs2', 'base64', 'binary', 'hex' ];
//   if (available.indexOf(requested) > -1) { strEnc = requested as any; }
//   else { throw new TypeError("String encoding not available"); }
// }
//
// function writeVarUInt(value: number, wBuffer: typeof NpmBuffer) {
//   while (value > 127) {
//     wBuffer[bag.byteOffset++] = (value & 127) | 128;
//     value >>= 7;
//   }
//   wBuffer[bag.byteOffset++] = value & 127;
// }
//
// function writeVarInt(value: number, wBuffer: typeof NpmBuffer) {
//   writeVarUInt((value << 1) ^ (value >> 31), wBuffer);
// }
//
// function readVarUInt(buffer: typeof NpmBuffer) {
//   let val = 0, i = 0, b;
//
//   do {
//     b = buffer[bag.byteOffset++];
//     val |= (b & 127) << (7 * i);
//     i++;
//   } while ((b & 128) !== 0);
//
//   return val;
// }
//
// function readVarInt(buffer: typeof NpmBuffer) {
//   const val = readVarUInt(buffer);
//   return (val >>> 1) ^ -(val & 1);
// }
//
// function writeString(val: string, wBuffer: typeof NpmBuffer) {
//   const len = Buffer.byteLength(val || '', strEnc);
//   writeVarUInt(len, wBuffer);
//   bag.byteOffset += wBuffer.write(val || '', bag.byteOffset, len, strEnc);
// }
//
// function readString(buffer: typeof NpmBuffer) {
//   const len = readVarUInt(buffer);
//   const str = buffer.toString(strEnc, bag.byteOffset, bag.byteOffset + len);
//   bag.byteOffset += len;
//   return str;
// }
//
// function writeBuffer(val: any, wBuffer: typeof NpmBuffer) {
//   const len = val.length;
//   writeVarUInt(len, wBuffer);
//   val.copy(wBuffer, bag.byteOffset);
//   bag.byteOffset += len;
// }
//
// function readBuffer(buffer: typeof NpmBuffer) {
//   const len = readVarUInt(buffer);
//   const buff = allocUnsafe(len);
//   buffer.copy(buff, 0, bag.byteOffset, bag.byteOffset + len);
//   bag.byteOffset += len;
//   return buff;
// }
//
// const readTypeDictStr: Record<string, string> = {
//   "boolean": "!!buffer.readUInt8(bag.byteOffset, true); bag.byteOffset += 1;",
//   "int8": "buffer.readInt8(bag.byteOffset, true); bag.byteOffset += 1;",
//   "uint8": "buffer.readUInt8(bag.byteOffset, true); bag.byteOffset += 1;",
//   "int16": "buffer.readInt16BE(bag.byteOffset, true); bag.byteOffset += 2;",
//   "uint16": "buffer.readUInt16BE(bag.byteOffset, true); bag.byteOffset += 2;",
//   "int32": "buffer.readInt32BE(bag.byteOffset, true); bag.byteOffset += 4;",
//   "uint32": "buffer.readUInt32BE(bag.byteOffset, true); bag.byteOffset += 4;",
//   "float32": "buffer.readFloatBE(bag.byteOffset, true); bag.byteOffset += 4;",
//   "float64": "buffer.readDoubleBE(bag.byteOffset, true); bag.byteOffset += 8;",
//   "string": "bag.readString(buffer);",
//   "varuint": "bag.readVarUInt(buffer);",
//   "varint": "bag.readVarInt(buffer);",
//   "buffer": "bag.readBuffer(buffer);"
// };
//
// function getWriteTypeDictStr(dataType: string, valStr: string) {
//   switch (dataType) {
//     case "boolean": return "bag.byteOffset = wBuffer.writeUInt8(" + valStr + " ? 1 : 0, bag.byteOffset, true);";
//     case "int8": return "bag.byteOffset = wBuffer.writeInt8(" + valStr + ", bag.byteOffset, true);";
//     case "uint8": return "bag.byteOffset = wBuffer.writeUInt8(" + valStr + ", bag.byteOffset, true);";
//     case "int16": return "bag.byteOffset = wBuffer.writeInt16BE(" + valStr + ", bag.byteOffset, true);";
//     case "uint16": return "bag.byteOffset = wBuffer.writeUInt16BE(" + valStr + ", bag.byteOffset, true);";
//     case "int32": return "bag.byteOffset = wBuffer.writeInt32BE(" + valStr + ", bag.byteOffset, true);";
//     case "uint32": return "bag.byteOffset = wBuffer.writeUInt32BE(" + valStr + ", bag.byteOffset, true);";
//     case "float32": return "bag.byteOffset = wBuffer.writeFloatBE(" + valStr + ", bag.byteOffset, true);";
//     case "float64": return "bag.byteOffset = wBuffer.writeDoubleBE(" + valStr + ", bag.byteOffset, true);";
//     case "string": return "bag.writeString(" + valStr + ", wBuffer);";
//     case "varuint": return "bag.writeVarUInt(" + valStr + ", wBuffer);";
//     case "varint": return "bag.writeVarInt(" + valStr + ", wBuffer);";
//     case "buffer": return "bag.writeBuffer(" + valStr + ", wBuffer);";
//   }
// }
//
// const constantByteCounts: Record<string, number> = { "boolean": 1, "int8": 1, "uint8": 1, "int16": 2, "uint16": 2, "int32": 4, "uint32": 4, "float32": 4, "float64": 8 };
//
// const dynamicByteCounts = {
//   "string": function(val: any) { const len = NpmBuffer.byteLength(val, strEnc); return getVarUIntByteLength(len) + len; },
//   "varuint": function(val: any) { return getVarUIntByteLength(val); },
//   "varint": function(val: any) { return getVarIntByteLength(val); },
//   "buffer": function(val: any) { const len = val.length; return getVarUIntByteLength(len) + len; }
// };
//
// function getVarUIntByteLength(val: number) {
//   if (val <= 0) { return 1; }
//   return Math.floor(Math.log(val) / Math.log(128)) + 1;
// }
//
// function getVarIntByteLength(value: number) {
//   return getVarUIntByteLength((value << 1) ^ (value >> 31));
// }
//
// const allocUnsafe = NpmBuffer.allocUnsafe ? function(n: number) {
//   return NpmBuffer.allocUnsafe(n);
// } : function(n: number) {
//   return new NpmBuffer(n);
// };
//
// const bufferFrom = NpmBuffer.from ? function(buf: Buffer) {
//   return NpmBuffer.from(buf);
// } : function(buf: Buffer) {
//   return new NpmBuffer(buf);
// };
//
// const bag: Record<string, any> = {};
// bag.allocUnsafe = allocUnsafe;
// bag.getVarUIntByteLength = getVarUIntByteLength;
// bag.dynamicByteCounts = dynamicByteCounts;
// bag.readVarUInt = readVarUInt;
// bag.readVarInt = readVarInt;
// bag.writeVarUInt = writeVarUInt;
// bag.writeVarInt = writeVarInt;
// bag.readString = readString;
// bag.writeString = writeString;
// bag.readBuffer = readBuffer;
// bag.writeBuffer = writeBuffer;
// bag.throwTypeError = throwTypeError;
// bag.byteOffset = 0;
//
// function processArrayEnd(val: any, id: string | number, commands: any, stackLen: number, arrLenStr?: string) {
//   const repID = stackLen <= 1 ? id : id + "xn";
//   const outerBound = arrLenStr === undefined ? "ref" + repID + ".length" : arrLenStr;
//   const jStr = "j" + id;
//
//   return "for (var " + jStr + "=" + (val.length - 1) + ";" + jStr + "<" + outerBound + ";" + jStr + "++) { " + commands + "}";
// }
//
// function getArrayLengthByteCount(id: any) {
//   return "byteC+=bag.getVarUIntByteLength(ref" + id + ".length);";
// }
//
// function encodeArrayLength(id: any) {
//   return "bag.writeVarUInt(ref" + id + ".length,wBuffer);";
// }
//
// function decodeArrayLength(arrLenStr: string) {
//   return "var " + arrLenStr + "=bag.readVarUInt(buffer);";
// }
//
// function declareDecodeRef(id: any, parentID: any, prop: any, container: any) {
//   return "var ref" + id + "=" + container + "; ref" + parentID + "[" + prop + "]=ref" + id + ";";
// }
//
// function declareEncodeRef(id: any, parentID: any, prop: any) {
//   return "var ref" + id + "=ref" + parentID + "[" + prop + "];";
// }
//
// function declareRepeatRefs(repItem: any, id: any, parentID: any, prop: any, container: any, repEncArrStack: any,
//                            repDecArrStack: any, repByteCountStack: any) {
//   // const repID = getXN(repEncArrStack, id);
//   const parentIDXN = getXN(repEncArrStack, parentID);
//   const index = repItem ? "j" + parentID : prop;
//
//   repEncArrStack[repEncArrStack.length - 1] += declareEncodeRef(id + "xn", parentIDXN, index);
//   repDecArrStack[repDecArrStack.length - 1] += declareDecodeRef(id + "xn", parentIDXN, index, container);
//   repByteCountStack[repByteCountStack.length - 1] += declareEncodeRef(id + "xn", parentIDXN, index);
// }
//
// function throwTypeError(valStr: any, typeStr: string, min: any, max: any, schemaType: string) {
//   if (typeof valStr !== typeStr) { throw new TypeError(valStr + " does not match the type of " + typeStr); }
//   else if (min !== undefined && valStr < min) { throw new TypeError(valStr + " is less than minimum allowed value of " + min + " for schema type " + schemaType); }
//   else if (max !== undefined && valStr > max) { throw new TypeError(valStr + " is greater than maximum allowed value of " + max + " for schema type " + schemaType); }
// }
//
// function getCheckBufferStr(valStr: string) {
//   const throwMessage = "bag.throwTypeError(" + valStr + ",'Buffer or Uint8Array');";
//   return "if (" + valStr + " instanceof Uint8Array === false && " + valStr + " instanceof Buffer === false){" + throwMessage + "}";
// }
//
// function getCheckDataTypeStr(valStr: string, typeStr: string) {
//   const throwMessage = "bag.throwTypeError(" + valStr + ",'" + typeStr + "');";
//   return "if (typeof(" + valStr + ") !== '" + typeStr + "'){" + throwMessage + "}";
// }
//
// function getBoundsCheckStr(valStr: string, min: string | number, max: string | number, schemaType: string) {
//   const throwMessage = "bag.throwTypeError(" + valStr + ",'number'," + min + "," + max + ",'" + schemaType + "');";
//   return "if (typeof(" + valStr + ") !== 'number'||" + valStr + "<" + min + "||" + valStr + ">" + max + "){" + throwMessage + "}";
// }
//
// function validateDataType(dataType: string, valStr: string) {
//   const maxFloat = 3.4028234663852886e+38;
//
//   switch (dataType) {
//     case "boolean": return getCheckDataTypeStr(valStr, "boolean");
//     case "int8": return getBoundsCheckStr(valStr, -0x80, 0x7f, "int8");
//     case "uint8": return getBoundsCheckStr(valStr, 0, 0xff, "uint8");
//     case "int16": return getBoundsCheckStr(valStr, -0x8000, 0x7fff, "int16");
//     case "uint16": return getBoundsCheckStr(valStr, 0, 0xffff, "uint16");
//     case "int32": return getBoundsCheckStr(valStr, -0x80000000, 0x7fffffff, "int32");
//     case "uint32": return getBoundsCheckStr(valStr, 0, 0xffffffff, "uint32");
//     case "float32": return getBoundsCheckStr(valStr, -maxFloat, maxFloat, "float32");
//     case "float64": return getBoundsCheckStr(valStr, -Number.MAX_VALUE, Number.MAX_VALUE, "float64");
//     case "string": return getCheckDataTypeStr(valStr, "string");
//     case "varuint": return getBoundsCheckStr(valStr, 0, 0x7fffffff, "varuint");
//     case "varint": return getBoundsCheckStr(valStr, -0x40000000, 0x3fffffff, "varint");
//     case "buffer": return getCheckBufferStr(valStr);
//   }
//
//   throw new Error("Undefined dataType" +  dataType);
// }
//
// function encodeValue(dataType: string, id: string | number, prop: string, validate: boolean) {
//   const varName = "ref" + id + prop;
//   return (validate ? validateDataType(dataType, varName) : "") + getWriteTypeDictStr(dataType, varName);
// }
//
// function decodeValue(dataType: string, id: string | number, prop: string) {
//   return "ref" + id + prop + "=" + readTypeDictStr[dataType];
// }
//
// function encodeByteCount(dataType: string, id: string | number, prop: string) {
//   const isConstant = constantByteCounts.hasOwnProperty(dataType);
//
//   if (isConstant) { return "byteC+=" + constantByteCounts[dataType] + ";"; }
//   else { return "byteC+=bag.dynamicByteCounts['" + dataType + "'](ref" + id + prop + ");"; }
// }
//
// function getXN(aStack: any, id: number) {
//   return aStack.length <= 2 && aStack[aStack.length - 1].length <= 0 ? id : id + "xn";
// }
//
// function getCompiledSchema(schema: any, validate: any) {
//   let strEncodeFunction = "bag.byteOffset=0;";
//   let strDecodeFunction = "var ref1={}; bag.byteOffset=0;";
//   let strByteCount = "";
//   let strEncodeRefDecs = "var ref1=json;";
//   let incID = 0;
//
//   const repEncArrStack = [""];
//   const repDecArrStack = [""];
//   const repByteCountStack = [""];
//   let tmpRepEncArr = "";
//   let tmpRepDecArr = "";
//   let tmpRepByteCount = "";
//
//   schema = { 'a': schema };
//
//   function compileSchema(json: any, inArray: boolean) {
//     incID++;
//     const keys = Object.keys(json);
//     keys.sort(function(a, b) { return a < b ? -1 : (a > b ? 1 : 0); });
//
//     const saveID = incID;
//
//     for (let i = 0; i < keys.length; i++) {
//       let key: number | string = keys[i];
//       const val = json[key];
//
//       if (inArray) {
//         key = parseInt(key, 10);
//       }
//
//       const prop = typeof key === "number" ? key : "'" + key + "'";
//       const container = val.constructor === Array ? "[]" : "{}";
//       const isRepArrItem = inArray && i >= keys.length - 1;
//
//       if (isRepArrItem) {
//         repEncArrStack.push("");
//         repDecArrStack.push("");
//         repByteCountStack.push("");
//       }
//
//       if (val.constructor === Array) {
//         const newID = incID + 1;
//         const repID = repEncArrStack.length <= 1 ? newID : newID + "xn";
//         const arrLenStr = "arrLen" + incID;
//
//         if (repEncArrStack.length === 1) {
//           strEncodeRefDecs += declareEncodeRef(newID, saveID, prop);
//           strDecodeFunction += declareDecodeRef(newID, saveID, prop, "[]");
//         }
//
//         const encArrayLength = encodeArrayLength(repID);
//         const decArrayLength = decodeArrayLength(arrLenStr);
//         const byteArrayLength = getArrayLengthByteCount(repID);
//
//         declareRepeatRefs(isRepArrItem, newID, saveID, prop, container, repEncArrStack, repDecArrStack, repByteCountStack);
//
//         compileSchema(val, true);
//
//         tmpRepEncArr = encArrayLength + processArrayEnd(val, newID, repEncArrStack.pop() + tmpRepEncArr, repEncArrStack.length);
//         tmpRepDecArr = decArrayLength + processArrayEnd(val, newID, repDecArrStack.pop() + tmpRepDecArr, repEncArrStack.length, arrLenStr);
//         tmpRepByteCount = byteArrayLength + processArrayEnd(val, newID, repByteCountStack.pop() + tmpRepByteCount, repEncArrStack.length);
//
//         if (repEncArrStack.length === 1) {
//           strEncodeFunction += tmpRepEncArr; tmpRepEncArr = "";
//           strDecodeFunction += tmpRepDecArr; tmpRepDecArr = "";
//           strByteCount += tmpRepByteCount; tmpRepByteCount = "";
//         }
//       } else if (typeof val === 'object') {
//         const newID = incID + 1;
//
//         if (repEncArrStack.length === 1) {
//           strEncodeRefDecs += declareEncodeRef(newID, saveID, prop);
//           strDecodeFunction += declareDecodeRef(newID, saveID, prop, "{}");
//         }
//
//         declareRepeatRefs(isRepArrItem, newID, saveID, prop, container, repEncArrStack, repDecArrStack, repByteCountStack);
//
//         compileSchema(val, false);
//       } else {
//         const index = inArray ? "" : "[" + prop + "]";
//         const dataType = getDataType(val);
//         json[key] = dataType;
//
//         let repID = getXN(repEncArrStack, saveID);
//         if (inArray) { repID += isRepArrItem ? "[j" + saveID + "]" : "[" + i + "]"; }
//
//         repEncArrStack[repEncArrStack.length - 1] += encodeValue(dataType, repID, index, validate);
//         repDecArrStack[repDecArrStack.length - 1] += decodeValue(dataType, repID, index);
//         repByteCountStack[repByteCountStack.length - 1] += encodeByteCount(dataType, repID, index);
//
//         if (repEncArrStack.length > 1) { continue; }
//
//         const uniqID = inArray ? saveID + "[" + i + "]" : saveID;
//         strEncodeFunction += encodeValue(dataType, uniqID, index, validate);
//         strDecodeFunction += decodeValue(dataType, uniqID, index);
//         strByteCount += encodeByteCount(dataType, uniqID, index);
//       }
//     }
//   }
//
//   compileSchema(schema, false);
//
//   strByteCount = "var byteC=0;".concat(strByteCount, "var wBuffer=bag.allocUnsafe(byteC);")
//   strEncodeFunction = strEncodeRefDecs.concat(strByteCount, strEncodeFunction, "return wBuffer;");
//   strDecodeFunction = strDecodeFunction.concat("return ref1['a'];");
//
//   var compiledEncode = new Function('json', 'bag', strEncodeFunction);
//   var compiledDecode = new Function('buffer', 'bag', strDecodeFunction);
//
//   return [ compiledEncode, compiledDecode ];
// }
//
// export function build(schema: any, validate?: boolean) {
//   const builtSchema = getCompiledSchema(schema, validate === undefined ? validateByDefault : validate);
//
//   const compiledEncode = builtSchema[0];
//   const compiledDecode = builtSchema[1];
//
//   return {
//     "encode": function(json: any) {
//       const itemWrapper = { "a": json };
//       return compiledEncode(itemWrapper, bag);
//     },
//     "decode": function(buffer: Buffer) {
//       const bufferWrapper = NpmBuffer.isBuffer(buffer) ? buffer : bufferFrom(buffer);
//       return compiledDecode(bufferWrapper, bag);
//     }
//   }
// }
//
// addTypeAlias('bool', 'boolean');

export const derp = () => {};

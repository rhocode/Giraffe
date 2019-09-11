import * as protobuf from 'protobufjs/light';
import { ErrMsg, validB64Chars } from '@waiting/base64';
import * as LZUTF8 from 'lzutf8';
import getLatestSchema from '../../utils/getLatestSchema';

const baseChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const revLookup: number[] = [];

for (let i = 0, len = baseChars.length; i < len; ++i) {
  revLookup[baseChars.charCodeAt(i)] = i;
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function parseDecodeInputBase64(base64: string): string {
  if (!validB64Chars(base64)) {
    throw new TypeError(ErrMsg.notValidB64String);
  }

  return base64;
}

function toUint8Array(b64: string): Uint8Array {
  /* tslint:disable: no-bitwise */
  const lens = getLens(b64);
  const validLen = lens[0];
  const placeHoldersLen = lens[1];
  const arr = new Uint8Array(_byteLength(validLen, placeHoldersLen));
  let curByte = 0;

  // if there are placeholders, only get up to the last complete 4 chars
  const len = placeHoldersLen ? validLen - 4 : validLen;

  let i = 0;

  for (; i < len; i += 4) {
    const tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = (tmp >> 16) & 0xff;
    arr[curByte++] = (tmp >> 8) & 0xff;
    arr[curByte++] = tmp & 0xff;
  }

  if (placeHoldersLen === 2) {
    arr[curByte] =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4);
  } else if (placeHoldersLen === 1) {
    const tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[curByte++] = (tmp >> 8) & 0xff;
    arr[curByte] = tmp & 0xff;
  }

  /* tslint:enable: no-bitwise */
  return arr;
}

export function getLens(input: string): [number, number] {
  /* tslint:disable: no-bitwise */
  const len = input.length;

  if (len & 3 || len <= 0) {
    throw new Error(ErrMsg.base64Invalidlength);
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  let validLen = input.indexOf('=');
  if (validLen === -1) {
    validLen = len;
  }

  // 0 to 3 characters of padding so total length is a multiple of 4
  const placeHoldersLen = 3 - ((validLen + 3) & 3);

  /* tslint:enable: no-bitwise */
  return [validLen, placeHoldersLen];
}

export function _byteLength(validLen: number, placeHoldersLen: number): number {
  // tslint:disable-next-line: no-bitwise
  return (((validLen + placeHoldersLen) * 3) >> 2) - placeHoldersLen;
}

const deserialize = (jsonData: any) => {
  const root = protobuf.Root.fromJSON(getLatestSchema());

  const { d, i } = jsonData;

  if (d === '') {
    return {
      nodes: [],
      edges: []
    };
  }

  // console.log(d, i, v);

  // const nodeEnumFlagger = {
  //     recipe: 'hasRecipe'
  // };

  const SaveFile = root.lookupType('SaveFile');

  let currentBuffer = toUint8Array(d);
  let decompress_iter = i;

  do {
    const decompressedEncoding = LZUTF8.decompress(currentBuffer);
    const intermediateBase64 = parseDecodeInputBase64(decompressedEncoding);
    currentBuffer = toUint8Array(intermediateBase64);
  } while (--decompress_iter > 0);

  const text = SaveFile.decode(currentBuffer);
  return SaveFile.toObject(text, {
    enums: String
  });
};

export default deserialize;

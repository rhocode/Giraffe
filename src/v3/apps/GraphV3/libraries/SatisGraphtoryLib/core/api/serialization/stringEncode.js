export const chr = String.fromCharCode;

export function ord(chr) {
  return chr.charCodeAt(0);
}

export function buffer2bin(buf) {
  buf = view8(buf);
  return chr.apply(String, buf);
}

/**
 * Get the hex representation of a buffer (TypedArray)
 *
 * @requires String.prototype.padStart()
 *
 * @param   {TypedArray}  buf Uint8Array is desirable, cause it is consistent
 *     regardless of the endianness
 *
 * @return  {String} The hex representation of the buf
 */
export function buffer2hex(buf) {
  const bpe = buf.BYTES_PER_ELEMENT << 1;
  return buf.reduce(
    (r, c) => (r += (c >>> 0).toString(16).padStart(bpe, "0")),
    ""
  );
}

const isASCIIRE = /[\p{ASCII}]+/u;

export function isASCII(str) {
  return isASCIIRE.test(str);
}

export function buffer2str(buf, asUtf8) {
  if (typeof buf == "string") return buf;
  buf = buffer2bin(buf);
  if (asUtf8 !== false && !isASCII(buf)) {
    if (asUtf8) {
      buf = utf8Decode(buf);
    } else if (asUtf8 === undefined) {
      try {
        buf = utf8Decode(buf);
      } catch (err) {}
    }
  }
  return buf;
}

export function str2buffer(str, asUtf8) {
  str = String(str);
  if (asUtf8) {
    str = utf8Encode(str);
  }

  // Smaller x2
  // return new Uint8Array(String(str).split('').map(ord));

  // Faster x3-4
  let len = str.length;
  const buf = new Uint8Array(len);
  while (len--) buf[len] = str.charCodeAt(len);
  return buf;
}

const nonHexDigitRE = /[^0-9a-f]/g;

/**
 * Read a hex string into a buffer (Uint8Array), ignoring non-hex chars.
 *
 * @param   {String}  str
 *
 * @return  {Uint8Array}
 */
export function hex2buffer(str) {
  str = str.replace(nonHexDigitRE, "");
  const len = str.length;
  const ret = new Uint8Array((len + 1) >>> 1);

  for (let i = 0; i < len; i += 2) {
    ret[i >>> 1] = parseInt(str.slice(i, i + 2), 16);
  }

  return ret;
}

/**
 * This method is a replacement of Buffer.toString(enc)
 * for Browser, where Buffer is not available.
 *
 * @requires btoa
 *
 * @this {Uint8Array}
 *
 * @param   {String}  enc  'binary' | 'hex' | 'base64' | 'utf8' | undefined
 *
 * @return  {String}
 */
export function toString(enc) {
  // The Node.js equivalent would be something like:
  // if(typeof Buffer == 'function') {
  //     if(enc === false) enc = 'binary';
  //     if(enc === true) enc = 'utf8';
  //     return Buffer.from(this.buffer, this.byteOffset,
  //     this.byteLength).toString(enc);
  // }
  switch (enc) {
    case false:
    case "binary":
      return buffer2bin(this);
    case "hex":
      return buffer2hex(this);
    case "base64":
      return btoa(buffer2bin(this));
    case "utf8":
      return buffer2str(this, true);
    default:
      break;
  }
  return buffer2str(this, enc);
}

export function view8(buf, start, len) {
  // If buf is a Buffer, we still want to make it an Uint8Array
  if (!start && !len && buf instanceof Uint8Array && !buf.copy) return buf;
  start = start >>> 0;
  if (len === undefined) len = buf.byteLength - start;
  return new Uint8Array(buf.buffer, buf.byteOffset + start, len);
}

export function utf8bytes(str, allowAsyncChars) {
  var l = str.length,
    i = 0,
    u = 0,
    c,
    a = -1,
    asy = +!!allowAsyncChars;

  for (; i < l; ) {
    c = str.charCodeAt(i++);
    if (c < 0x80) continue; // ASCII
    if (0xff <= c) return false; // has multi-byte

    // async UTF8 character
    if ((c & 0xc0) === 0x80) {
      // Ignore async UTF8 characters at the beginning
      if (asy === i) {
        ++u;
        ++asy;
        continue;
      }
      return false;
    }

    // Check sync UTF8 bytes
    a =
      (c & 0xe0) !== 0xc0
        ? (c & 0xf0) !== 0xe0
          ? (c & 0xf8) !== 0xf0
            ? false
            : 3
          : 2
        : 1;
    if (!a) return false; // Not an ASCII, nor sync UTF8 bytes

    for (; (u += 1) && a-- && i < l; ) {
      c = str.charCodeAt(i++);
      if ((c & 0xc0) !== 0x80) {
        return false; // Not an ASCII, nor sync UTF8 bytes
      }
    }
  }

  // Ignore async UTF8 characters at the end
  if (~a && !allowAsyncChars) return false;

  return u;
}

export function utf8Encode(str) {
  return unescape(encodeURI(str));
}

export function utf8Decode(str) {
  return decodeURIComponent(escape(str));
}

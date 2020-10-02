import { v4 as uuidv4 } from 'uuid';

export function stringGen(len: number) {
  let text = '';

  const charset = 'abcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < len; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return text;
}

export default function uuidGen() {
  return uuidv4();
}

export function camelize(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export function stringRound(num: number, n: number) {
  return num.toFixed(n).toString();
}

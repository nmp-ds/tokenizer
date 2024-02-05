import fs from 'node:fs';
import yaml from 'yaml';
import slugify from './slugify.js';

/**
 * @arg {Array.<TokenResult>} tokens
 * @arg {Array.<string>} requirements
 */
export const requireTokens = (tokens, requirements) => {
  if (requirements?.length) {
    for (const r of requirements) {
      if (!tokens.some(t => t.token.name === r)) throw `Missing required token: '${r}'`;
    }
  }
};

/**
 * @arg {string} filePath
 * @returns {object}
 */
export const readYaml = filePath => yaml.parse(fs.readFileSync(filePath, 'utf-8'));

/**
 * Handles merging prefix with name
 * @arg {string} prefix
 * @arg {string} name
 * @returns {string}
 */
const buildToken = (prefix, name, result = []) => {
  if (prefix) result.push(prefix);
  if (name !== '_') result.push(name);
  return slugify(result.join(' '));
};

/**
 * Merges parent keys onto children - will produce a flat object structure
 * @arg {Object.<string, string|object>} obj
 * @arg {string} _prefix
 * @arg {Object.<string, string>} result
 * @returns {Object.<string, string>}
 */
export const mergeTree = (obj, _prefix = '', result = {}) => {
  for (const [_name, entry] of Object.entries(obj)) {
    const token = buildToken(_prefix, _name);
    if (typeof entry === 'object') mergeTree(entry, token, result);
    else result[token] = entry;
  }
  return result;
};

const tokenKey = (k) => `--w-${k}:`;

const hexToRGB = (str) => {
  switch (str) {
    case 'white':
      return '255,255,255';
    case 'black':
      return '0,0,0';
  }
  const [, hex] = str.match(/^#([\da-f]+)$/i) || [];
  switch (hex?.length) {
    case 3:
      const digits = Array.from(hex, (s) => Number.parseInt(s, 16)).map((n) => (n << 4) | n);
      return digits.slice(0, 3).join();
    case 6:
      const value = Number.parseInt(hex, 16);
      return `${(value >> 16) & 0xff},${(value >> 8) & 0xff},${value & 0xff}`;
  }
  return str;
}

export const toCSSMap = ([k, v], duplicateAsRgb) => {
  let css = `${tokenKey(k)} var(--w-${v});`;
  if (duplicateAsRgb) {
    const rgbTokenKey = tokenKey(k.replace(/^(s-)?(color-)?(.*)/, '$1rgb-$3'));
    const rgbTokenValue = `var(--w-${v.replace(/^(s-)?(color-)?(.*)/, '$1rgb-$3')});`;
    css = css.concat(rgbTokenKey, rgbTokenValue);
  }
  return css;
}

export const toCSSDef = ([k, v], duplicateAsRgb) => {
  let css = `${tokenKey(k)} ${v};`;
  if (duplicateAsRgb) {
    css += `${tokenKey(k.replace(/^(s-)?(color-)?(.*)/, '$1rgb-$3'))}${hexToRGB(v)};`;
  }
  return css;
}

export const wrapDarkMedia = v => `@media (prefers-color-scheme:dark) { ${v} }`;

export const rootWrap = v => `:root, :host { ${v} }`;

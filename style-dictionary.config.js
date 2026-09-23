import StyleDictionary from 'style-dictionary';
import fs from 'node:fs';
import path from 'node:path';

// -------------------------------------------------------
// Helpers
// -------------------------------------------------------

function getTokenFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return getTokenFiles(fullPath);
      if (entry.name.endsWith('.json')) return [fullPath];
      return [];
    });
}

function pathToKebab(parts) {
  return parts
    .filter(p => p !== 'default')
    .map(p => p.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
    .join('-');
}

function refToVar(ref) {
  return ref.replace(/\{([^}]+)\}/g, (_, p) => `var(--${pathToKebab(p.split('.'))})`);
}

function compositeLayerToCSS(obj) {
  const { inset, ...props } = obj;
  const values = Object.values(props).map(v => refToVar(String(v)));
  return `${inset ? 'inset ' : ''}${values.join(' ')}`;
}

// Serialize a token to the exact CSS value that ships. Shared by the CSS format
// and the JSON manifest, so the documented value can never disagree with the
// generated stylesheet. References are kept as var() rather than flattened.
function tokenToCssValue(t) {
  const orig = t.original?.$value ?? t.original?.value;
  if (Array.isArray(orig)) return orig.map(compositeLayerToCSS).join(', ');
  if (orig !== null && typeof orig === 'object') return compositeLayerToCSS(orig);
  return refToVar(String(orig ?? t.$value ?? t.value));
}

// -------------------------------------------------------
// Transforms
// -------------------------------------------------------

StyleDictionary.registerTransform({
  name: 'name/kebab/strip-default',
  type: 'name',
  transform(token) {
    return pathToKebab(token.path);
  },
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css',
  transforms: ['name/kebab/strip-default'],
});

// -------------------------------------------------------
// Format — @layer tokens
// -------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/layer-config',
  format({ dictionary, file }) {
    const allVars = dictionary.allTokens
      .map(t => `    --${pathToKebab(t.path)}: ${tokenToCssValue(t)};`)
      .join('\n');

    const header = '/**\n * Do not edit directly, this file was auto-generated.\n */';

    return `${header}\n\n/* ${file.destination} */\n@layer tokens {\n  :root {\n${allVars}\n  }\n}\n`;
  },
});

// -------------------------------------------------------
// Format — JSON manifest, consumed by the documentation site
// -------------------------------------------------------

// A flat array of every token, carrying the same name and the same value the
// CSS format emits. The documentation renders its reference tables from this,
// so a token cannot be documented with a name or a value the stylesheet does
// not actually ship.
StyleDictionary.registerFormat({
  name: 'json/manifest',
  format({ dictionary, options }) {
    const entries = dictionary.allTokens.map(t => ({
      name: `--${pathToKebab(t.path)}`,
      value: tokenToCssValue(t),
      type: t.$type ?? t.type ?? '',
      file: options.fileMap.get(t.filePath) ?? '',
      description: t.$description ?? t.description ?? '',
    }));
    return JSON.stringify(entries, null, 2) + '\n';
  },
});

// -------------------------------------------------------
// Config
// -------------------------------------------------------

const tokenFiles = getTokenFiles('./tokens');
const rel = file => path.relative('./tokens', file).replace(/\.json$/, '');

// This package's own sources, and the map from an absolute path back to its
// "components/button" style identifier, which is how the documentation
// addresses a group of tokens.
const ownFiles = new Set(tokenFiles);
const fileMap = new Map(tokenFiles.map(f => [f, rel(f)]));

const designTokensPath = './node_modules/@uncinq/design-tokens/tokens';
if (!fs.existsSync(designTokensPath)) {
  throw new Error('Missing @uncinq/design-tokens — run npm install first.');
}

await new StyleDictionary({
  usesDtcg: true,
  log: { warnings: 'disabled', errors: { brokenReferences: 'console' } },
  include: getTokenFiles(designTokensPath),
  source: tokenFiles,
  platforms: {
    css: {
      transformGroup: 'custom/css',
      buildPath: 'dist/css/',
      files: tokenFiles.map(file => ({
        destination: `${rel(file)}.css`,
        format: 'css/layer-config',
        filter: t => t.filePath === file,
      })),
    },
    manifest: {
      transformGroup: 'custom/css',
      buildPath: 'dist/',
      files: [{
        destination: 'tokens.json',
        format: 'json/manifest',
        // The design-tokens sources are included only so references resolve;
        // this package's manifest must list its own tokens and nothing else.
        filter: t => ownFiles.has(t.filePath),
        options: { fileMap },
      }],
    },
  },
}).buildAllPlatforms();

// -------------------------------------------------------
// index.css — imports every generated token file directly. Files are discovered
// from disk, so adding a JSON needs no manual edit. Each file declares its own
// @layer tokens, so a plain @import is enough.
// -------------------------------------------------------

fs.mkdirSync('./dist/css', { recursive: true });
fs.writeFileSync(
  './dist/css/index.css',
  '/* index.css — auto-generated, do not edit */\n' +
    tokenFiles.map(file => `@import "./${rel(file)}.css";`).join('\n') + '\n',
);

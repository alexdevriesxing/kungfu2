const progress = document.getElementById('loading-progress');
const loading = document.getElementById('loading');

async function readParts(folder, count, start, span) {
  const parts = [];
  for (let index = 0; index < count; index += 1) {
    const name = String(index).padStart(3, '0');
    const response = await fetch(`${folder}/${name}.part`);
    if (!response.ok) throw new Error(`Could not load ${folder}/${name}.part`);
    parts.push((await response.text()).trim());
    progress.textContent = `${Math.round(start + ((index + 1) / count) * span)}%`;
  }
  return parts.join('');
}

async function gunzipBase64(encoded) {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Response(stream).text();
}

try {
  const assetPayload = await readParts('assets/runtime', 19, 0, 72);
  globalThis.__GREEN_DRAGON_ASSETS__ = JSON.parse(await gunzipBase64(assetPayload));
  progress.textContent = '78%';

  const sourcePayload = await readParts('src/runtime', 2, 78, 18);
  let source = await gunzipBase64(sourcePayload);
  const contentUrl = new URL('./content.js', import.meta.url).href;
  source = source.replace("from './content.js'", `from '${contentUrl}'`);
  progress.textContent = '98%';

  const moduleUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  await import(moduleUrl);
  URL.revokeObjectURL(moduleUrl);
  progress.textContent = '100%';
} catch (error) {
  console.error(error);
  loading.innerHTML = `<strong>The jade archive could not be opened.</strong><span>${String(error.message || error)}</span>`;
}

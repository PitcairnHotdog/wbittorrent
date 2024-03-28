// sha256_wasm_worker.js
self.importScripts('./wasm/sha256.js');

let api;

const createChunks = (file, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < file.size; i += chunkSize) {
    chunks.push({
      index: Math.ceil(i / chunkSize),
      data: file.slice(i, i + chunkSize)
    });
  }
  return chunks;
};

const readFileChunk = (chunk) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(chunk);
  });
}

const toHexString = (byteArray) => {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

const wasmModuleLoaded = new Promise((resolve, reject) => {
  Module.onRuntimeInitialized = async () => {
    api = {
      create: Module.cwrap("create_sha256", "number", []),
      destroy: Module.cwrap("destroy_sha256", "", ["number"]),
      create_buffer: Module.cwrap("create_buffer", "", ["number"]),
      destroy_buffer: Module.cwrap("destroy_buffer", "", ["number"]),
      update: Module.cwrap("sha256_update", "", ["number", "number", "number"]),
      get_block_hash: Module.cwrap("get_block_hash", "", ["number", "number", "number"]),
      final: Module.cwrap("sha256_final", "", ["number", "number"]),
    };
    resolve();
  };
});

self.onmessage = async (event) => {
  const { action, file, chunkSize } = event.data;

  if (action === 'init') {
    await wasmModuleLoaded;
  }

  if (action === 'processFile' && chunkSize) {
    console.time("SHA-256");
    if (!file) return;
    const chunks = createChunks(file, chunkSize);
    self.postMessage({ _chunks: chunks });
    const ctx = api.create();
    for (let { index, data } of chunks) {
      try {
        let bytes = await readFileChunk(data);
        let p = api.create_buffer(bytes.byteLength);
        Module.HEAPU8.set(new Uint8Array(bytes), p);
        api.update(ctx, p, bytes.byteLength);

        let pbhash = api.create_buffer(32);
        api.get_block_hash(p, bytes.byteLength, pbhash)
        let bhash = new Uint8Array(
          Module.HEAPU8.buffer,
          pbhash,
          32,
        );
        api.destroy_buffer(p);
        api.destroy_buffer(pbhash);
        self.postMessage({ block: {index, hash: toHexString(bhash)} });
      } catch (error) {
        self.postMessage({ error: {index, error} });
      }
    }

    const pHash = api.create_buffer(32);
    api.final(ctx, pHash);
    const hash = new Uint8Array(
      Module.HEAPU8.buffer,
      pHash,
      32,
    );
    api.destroy_buffer(pHash);
    api.destroy(ctx);
    self.postMessage({ hash: toHexString(hash) });
    console.timeEnd("SHA-256");
  }
};

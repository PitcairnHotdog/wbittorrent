// sha256_worker.js

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

const findDataHash = (data) =>
  crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  });

const findHash = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function(e) {
      const contents = e.target.result;
      const hashHex = await findDataHash(contents);
      resolve(hashHex);
    };
    reader.onerror = function(e) {
      console.error("File could not be read! Code " + e.target.error);
      reject(e.target.error);
    };
    reader.readAsArrayBuffer(file);
  });
};

self.onmessage = async (event) => {
  const { action, file, data, chunkSize, info } = event.data;
  if (action === 'hash' && file && chunkSize) {
    const hashPromise = findHash(file).then((hash) => {
      return hash;
    }).catch((error) => self.postMessage({ error: { index: -1, error } }));
    const chunks = createChunks(file, chunkSize);
    const chunkHashs = new Array(chunks.length);
    const chunkHashPromise = Promise.all(chunks.map(
      ({ index, data }) => 
        findHash(data)
          .then((hash) => chunkHashs[index] = hash)
          .catch((error) => self.postMessage({ error: { index, error } }))
    )).then(() => {
      return chunkHashs;
    });
    Promise.all([hashPromise, chunkHashPromise])
      .then(([hash, chunkHashs]) => self.postMessage({ action, file, hash, chunks, chunkHashs }));
  };
  if (action === 'check_data' && data && info && info.dataHash && info.hash && info.index) {
    return findDataHash(data).then((_hash) => {
      self.postMessage({ action, info, result: _hash === info.dataHash });
    });
  };
  if (action === 'check_file' && file && info && info.hash) {
    return findHash(file).then((_hash) => {
      self.postMessage({ action, info, result: _hash === info.hash });
    });
  };
};

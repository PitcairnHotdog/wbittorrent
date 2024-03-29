"use client";
import Peer from 'peerjs';
import { useEffect, useState } from 'react';
import PeerContext from '@/app/components/PeerContext';
import { getBlockprogress, getDirectory, getBlockHashs, getBlockUploader, uploadDirectory, uploadHashs, blockUpdate } from '@/app/utils/api';

const chunkSize = 1024*1024;

// key: hash
// {
//   file,
//   hash,
//   chunks: [{ index, data: null }],
//   chunkHashs: [hash],
// }
const fileStorage = new Map();

// key: id
// {
//   title,
//   description,
//   directory: [{
//     hash,
//     lastModified,
//     name,
//     size,
//     type,
//     path,
//   }]
// }
const torrentsInfo = new Map();

const updateFilesMap = (userId) => {
  if (torrentsInfo.size === 0 || fileStorage.size === 0) return {};
  const file_map = {};
  torrentsInfo.forEach((infos, key) => {
    console.log(key, infos.directory);
    infos.directory.forEach((file) => {
      const { hash, size } = file;
      if (!hash) return;
      const { chunks, chunkHashs } = fileStorage.get(hash);
      if (!chunks || chunks.length === 0) return;
      const block_list = chunks.filter(({data}) => data !== null).map(({index}) => index);
      file_map[hash] = {
        block_list,
        torrent_id: key
      }
      if (block_list.length === chunkHashs.length && (!fileStorage.get(hash).file || fileStorage.get(hash).file.size !== size)) {
        joinFile(key, hash);
      }
    });
  });
  blockUpdate(userId, file_map);
}

const registerBlocks = (userId) => {
  updateFilesMap(userId);
  return setInterval(updateFilesMap, 5000, userId);
}

const joinFile = (key, hash) => {
  const file = fileStorage.get(hash);
  console.log(file);
  if (file.chunks.length === file.chunkHashs.length) {
    const orderedBlobs = [];
    for (let i = 0; i < file.chunks.length; i++) {
      orderedBlobs.push(file.chunks[i].data);
    }
    const info = torrentsInfo.get(key).directory.find(file => hash === file.hash);
    const fullBlob = new Blob(orderedBlobs, { type: info.type });
    console.log(fullBlob)
    fileStorage.get(hash).file = fullBlob;
    const url = URL.createObjectURL(fullBlob);
    console.log(url);
    const a = document.createElement('a');
    a.href = url;
    a.download = info.name;
    a.click();
    console.log(fullBlob);
  }
}

const generateRandomString = (length) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const randomValues = new Uint32Array(1);
      crypto.getRandomValues(randomValues);
      const j = randomValues[0] % (i + 1);
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const getFileHash = (file) =>
  new Promise((resolve, reject) => {
    const worker = new Worker('./sha256_worker.js');
    worker.onmessage = (event) => {
      const { action, file, hash, chunks, chunkHashs, error } = event.data;
      if (action !== 'hash') return;
      if (error) {
        return console.error(error.index, error.error);
      }
      if (file && hash && chunks && chunkHashs) {
        const fileHash = {
          file,
          hash,
          chunks,
          chunkHashs,
        };
        fileStorage.set(hash, fileHash);
        uploadHashs(fileHash).finally(() => {
          resolve(hash);
        });
      }
    };
    worker.postMessage({ action: 'hash', file, chunkSize });
  });

  const createTorrent = (title, description, files) =>
    Promise.all(files.map(file =>
      getFileHash(file).then(hash => ({
        hash,
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type,
        path: file.webkitRelativePath.split('/')
      }))
    )).then(directory =>
      uploadDirectory(title, description, directory).then(id => {
        torrentsInfo.set(id, {title, description, directory});
        console.info(torrentsInfo); // Keep the logging
        return id; // Ensure we return the id for further use
      })
    );

let peer;
const conns = new Map();
// Initialize peer user
const createPeer = (userId=generateRandomString(32)) => {
  console.info(userId);
  peer = new Peer(userId);
  peer.on("open", () => {
    console.log(`Your share ID is: ${peer.id}`);
  });
  const connProcesser = (conn) => {
    conn.on('error', (err) => {
      console.error('Connection error:', err);
      conn.close();
    });
    conn.on('close', () => {
      console.info('Connection closed');
    });
    conn.on('open', connOpen(conn));
  };
  peer.on("connection", connProcesser);
  return userId;
}
const connOpen = (conn) => () => {
  console.info('Connection opened');
  conns.set(conn.peer, conn);
  conn.on('data', (_data) => {
    console.log(_data);
    const { action, info, data } = _data;
    if (action && info && info.hash && action === 'get' && fileStorage.has(info.hash)) handleGet(conn, info);
    if (action && info && data && action === 'send') handleSend(info, data);
  });
  console.log(conns);
};

const handleGet = async (conn, info) => {
  const { hash } = info;
  const file = fileStorage.get(hash);
  const progress = (await getBlockprogress(conn.peer, hash)) ? (await getBlockprogress(conn.peer, hash)) : [];
  const blocks = file.chunks.filter(({data}) => data !== null).filter((index) => !progress.includes(index));
  if (blocks.length > 0) {
    const randomBlocks = shuffleArray(blocks);
    await Promise.all(
      randomBlocks.map(({ index, data }) => {
        conn.send({
          action: 'send',
          info: { hash, index, dataHash: file.chunkHashs[index] },
          data,
        });
      })
    );
    console.log(hash);
  }
}

const handleSend = (info, data) => {
  const { hash, index, dataHash } = info;
  console.log(hash, index, dataHash);
  if (!hash || index === undefined || !dataHash) return;
  if (!fileStorage.has(hash)) return;
  if (!fileStorage.get(hash).chunkHashs || fileStorage.get(hash).chunkHashs === 0) return;
  if (fileStorage.get(hash).chunkHashs[index] !== dataHash) return;
  if (fileStorage.get(hash).chunks[index].data !== null) return;
  fileStorage.get(hash).chunks[index] = {index, data};
  console.log(fileStorage);
}

// Initialize user Torrent
const generateTorrent = (title, description, _files, onTorrentCreated) => {
  if (!_files || _files.length === 0) return;
  const files = Array.from(_files);
  console.log(files); // Keep the original console.log
  // Assume fileStorage is available in this scope
  console.log(fileStorage); // Keep the original console.log
  
  createTorrent(title, description, files)
    .then(torrentId => {
      updateFilesMap(userId); // Update based on your existing logic
      if (onTorrentCreated) {
        onTorrentCreated(torrentId); // Call the callback with the torrent ID
      }
    });
}

const downloadTorrent = (id) =>
  getDirectory(id).then(({ title, description, directory }) => {
    torrentsInfo.set(id, { title, description, directory });
    return directory;
  }).then((directory) => {
    directory.map(({ hash }) =>
      getBlockHashs(hash).then(({ block_hash }) => {
        if (!fileStorage.has(hash)) fileStorage.set(hash, {});
        fileStorage.get(hash).chunkHashs = block_hash;
        fileStorage.get(hash).chunks = new Array(block_hash.length).fill('').map((_, index) => ({index, data: null}));
      }).then(() => {
        getBlockUploader(hash).then((uploaders) => {
          uploaders.filter(uploader => uploader !== userId).map((uploader) => {
            if (conns.has(uploader)) {
              conns.get(uploader).send({
                action: 'get',
                info: { hash },
              });
            } else {
              const conn = peer.connect(uploader);
              conn.on('open', () => {
                conns.set(uploader, conn);
                conn.send({
                  action: 'get',
                  info: { hash },
                });
                connOpen(conn)();
              });
            }
          });
        });
      })
    );
  });

const userId = createPeer();
console.log(userId);
registerBlocks(userId);

const PeerProvider = ({ children }) => {

  return (
    <PeerContext.Provider value={{ userId, fileStorage, torrentsInfo, generateTorrent, downloadTorrent }}>
      {children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;

const address = 'http://localhost:3000';

const request = {
  get: (url) => fetch(`${address}${url}`, {
    method: 'GET',
  }),
  put: (url, body) => fetch(`${address}${url}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  }),
  post: (url, body) => fetch(`${address}${url}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  }),
  delete: (url) => fetch(`${address}${url}`, {
    method: 'DELETE',
  }),
}

export const uploadHashs = (fileHash) =>
  request.put(`/files/info/${fileHash.hash}`, {
    block_count: fileHash.chunkHashs.length,
    block_hash: fileHash.chunkHashs
  });

export const uploadDirectory = (title, description, directory) =>
  request.post(`/files/directory/`, {
    title,
    description,
    directory
  }).then((response) => 
    response.json().then((data) => data.data.id)
  );

export const blockUpdate = (id, file_map) =>
  request.put(`/blocks/public/${id}`, { file_map });

export const getBlockUploader = (hash) =>
  request.get(`/blocks/public/uploader/${hash}`)
    .then((response) => 
      response.json().then((data) => data.data)
    );

export const getBlockprogress = (userId, hash) =>
  request.get(`/blocks/public/possession/${userId}/${hash}`)
    .then((response) => 
      response.json().then((data) => data.data)
    );

export const getDirectory = (id) =>
  request.get(`/files/directory/${id}`)
    .then((response) => 
      response.json().then((data) => data.data)
    );

export const getBlockHashs = (hash) =>
  request.get(`/files/info/${hash}`)
    .then((response) => 
      response.json().then((data) => data.data)
    );

export const getUserProgress = (userId) =>
  request.get(`/blocks/download-progress/${userId}`)
    .then((response) => 
      response.json().then((data) => data.data)
    );

export const getAllDirectory = (page=1) =>
  request.get(`/files/directory-list?page=${page}`)
    .then((response) => 
      response.json().then((data) => data.data)
    );

export const getUserFavourite = (page=1) =>
  request.get(`/users/favourite?page=${page}`)
    .then((response) => 
      response.json().then((data) => data.data)
    );

export const postUserFavourite = (id) =>
  request.post(`/users/favourite/${id}`)
    .then((response) => 
      response.json().then((data) => data.data)
    );

export const deleteUserFavourite = (id) =>
  request.delete(`/users/favourite/${id}`)
    .then((response) => 
      response.json().then((data) => data.data)
    );

import io from 'socket.io-client';

const HOST = '/banmap';

function makeRequest(req) {
    return fetch(`${HOST}${req}`)
        .then((res) => res.json());
}

function getWebSocket() {
    return io(HOST, { path: `${HOST}/socket.io` });
}

export { makeRequest, getWebSocket };

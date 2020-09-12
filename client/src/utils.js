import io from 'socket.io-client';

const HOST = '';

function makeRequest(req) {
    return fetch(`${HOST}${req}`)
        .then((res) => res.json());
}

function getWebSocket() {
    return io(HOST);
}

export { makeRequest, getWebSocket };
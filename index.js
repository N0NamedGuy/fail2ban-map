const app = require('connect')();
const cors = require('cors');
const serveStatic = require('serve-static');
const http = require('http').createServer(app);
const io = require('socket.io')(http, { path: '/banmap/socket.io' });
const Tail = require('tail').Tail;
const fs = require('fs');
const events = require('events');
const geoip = require('geoip-lite');

const path = require('path');
const PORT = 5000;
const FAIL2BAN_LOG = path.resolve(__dirname, 'fail2ban.log');

function sshdBanFilter(line) {
    return (line.category === 'actions' &&
        line.description.startsWith('Ban'));
}

function sshdBanMap(line) {
    const { description } = line;
    const ip = description.split(' ')[1];

    const geo = geoip.lookup(ip);

    return {
        geo,
        line
    }
}

function sendCoord(socket, line) {
    if (sshdBanFilter(line)) {
        io.emit('ban', sshdBanMap(line));
    }
}

function getFileLines() {
    return fs.readFileSync(FAIL2BAN_LOG)
        .toString()
        .split('\n')
        .map(parseLogLine)
        .filter(e => !!e);
}

function parseLogLine(line) {
    const fail2banRegex = /(?<date>\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d,\d\d\d) fail2ban\.(?<category>\w*) \s*\[(?<code>\d*)\]: (?<level>\w*) \s* \[(?<jail>\b\w*\b)\] (?<description>.*)/;

    const match = fail2banRegex.exec(line);

    if (match) {
        return match.groups;
    }

    return null;
}

const MAXLINES = 100;
const fail2banLogs = getFileLines()
	.filter(sshdBanFilter)
	.filter((e, i, arr) => i > ((arr.length - 1 - MAXLINES)));

const tail = new Tail(FAIL2BAN_LOG);

const newLineEmitter = new events.EventEmitter();

tail.on('line', (line) => {
    const parsed = parseLogLine(line);

    if (parsed != null) {
        fail2banLogs.push(parsed);
        newLineEmitter.emit('line', parsed);
    }
});

app.use(cors());

app.use('/banmap', serveStatic(path.join(__dirname, 'client/build/'), { index: ['index.html']}));

app.use('/banmap/api/bans', function (req, res, next) {
    req.set
    res.end(JSON.stringify(fail2banLogs.filter(sshdBanFilter).map(sshdBanMap)));
    next();
});

io.on('connection', (socket) => {
    const onNewLine = (logLine) => {
        sendCoord(socket, logLine);
    };

    newLineEmitter.on('line', onNewLine);

    socket.on('disconnect', () => {
        newLineEmitter.off('line', onNewLine);
    })
});

http.listen(PORT, () => {
    console.log(`Started server on port ${PORT}`);
});

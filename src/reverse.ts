import { SmartFox } from "sfs2x-api";

type SmartFoxExtended = SmartFox & {
    _socketEngine: {
        _protocolCodec: {
            onPacketRead: (message: Buffer) => { dump: () => string };
        };
    };
};

// A dummy server
const SFS = new SmartFox({
    host: "server.polygon.bombcrypto.io",
    port: 443,
    zone: "BomberGameZone",
    debug: true,
    useSSL: true,
}) as SmartFoxExtended;

// Decode any base64 encoded message from WS tab in Chrome
function decodeMessage(base64: string): string {
    const binMessage = Buffer.from(base64, "base64");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parsed = SFS!._socketEngine._protocolCodec.onPacketRead(binMessage);
    return parsed.dump();
}

// Get messages in base64 from WS tab and decode them:

// CONNECT Request
console.log(
    decodeMessage(
        "oANteJytmc1rE0EYhzdtlYjWQ0+e95zDzsfuzuSmIgoqevAmNYQasKIQaCgV8X+3yc7EzGR251mwh7a0D+/MvF+/eScXxWkxWV8UJ7vvD4onX5eb5c1ifbta3Mrpw7vPv8vrcl7Nyu/lvJmVm1/rVTkXs/Lbevfj5/Luzfa3P7MDroWczXJix1WQ05DLn6PjDOSEpOB+h9qBB6StHCvhoTtOQS7vHAXX1XDdGq7bcWIfFdWBRv4jK++bFto0YYI5k02TMClkFJv+IDqyjsxakTKrwhxyrDYpVkeG+7fQhEFyVlOucujRbmVyByasXM9WCVbKqDp8Msv2wL91zB9tpK1Txp0rIlYNoKACmvB0fsM6VX2dJ/Yl3Ti2MsmzmbAYPK0ancQtzTUl0lVRp5ymZDIrdD8q8j1QKdo3OlDEy7fJoMlkot0DAXxZPN1c/1jdrDZOis6K7dejvTpNn305lCbaLfMtvcLdYJQ2/T/NkWF+Zrh8S5FQi2U6ynHkAjhfmnrUqY96SHr1qPX6crdVot4VlXBFC0eP0tH8whrWoYaB1FEgM8LMAl7Dw4y7FOTzognlIsPl87FB7SlYmxoFPaWFXmyjpB3M8DZaffBMBiavgf40MCkNTUpD69WGvhw8tQ179KA7LcxMLPWWNhZRQacLOq8JOrA5EMTHk2BxPj1F95vB+PhbOjYLCnjEjEBvTQILjydZAQusU4IKkIhEenh9jc9FNUNQ0XAgydIaBzQeT/FslgPzouVAsMkGXvbEGH3z++QngikaT6b9dlvq0hZv1dCsM9T5hjqfiqEDj4a/Hnda6iRLj27p0akYCqyGEg90FawiB4JJyFnEJsnTA5ZDKaBoOxDMTIIWhSfBVClwIPGgiidVOsNLfAXwJPC6ouGJXrAGLysOBmfXIxq3HCPYR89ow3RNyxMrrOx5AO7ZAFVZGWkisQqiGwloDqTvJfFE12+3HeUtQ5ukCR1ArII3IzzWSSo5Eo9LigqEA8ETEJ2rFJ2rVPRJ2PBTFdYnT4IjCeh3hT9Gou3cgcCbtO8r+papsEAoPPl5Ehxchfk2HHSqO0fP8FkS2KRvmUrTWqOvmWqMhvnlxSh6KFKXxcnqqvvQ4fHBJxHbv5wVk6tpcf761afFi3cfXr5dvH/+sZgsT4vz+3+cTP4C9W0+aA=="
    )
);
/**
 * 
 function findInBuffer(buffer, bytesParam, except=[]) {
    const bytes = bytesParam.split(' ').join(',0,').split(',').map(v => parseInt(v))
    const array = new Uint8Array(buffer);
    const first = bytes[0];
    const size = bytes.length;
    const results = [];
    let offset = 0;
    let index = array.indexOf(first, offset);
    while (index !== -1 && index + size <= array.length) {
        let isMatch = true;
        for (let i = 0; i < size; i++) {
            if (array[index + i] !== bytes[i]) {
                isMatch = false;
                break;
            }
        }
        if (isMatch) results.push(index);
        offset = index + 1;
        index = array.indexOf(first, offset);
    }
    return results.filter(v => except.indexOf(v) === -1);
}
 */

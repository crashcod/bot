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
        "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"
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

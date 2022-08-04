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
        "gAEGEgADAAFjAgAAAWEDAAEAAXASAAQAAnpuCAAOQm9tYmVyR2FtZVpvbmUAAnVuCAAIeW9rb3NvYmMAAnB3CAAAAAFwEgAEAAJsYwgAAAAEZGF0YRIABwADcGxuCAAIeW9rb3NvYmMACHBhc3N3b3JkCAAGOTIwNjI4AAx2ZXJzaW9uX2NvZGUEAAAAOQACbHQEAAAAAQAGc2xvZ2FuCAAIc2Vuc3BhcmsAD2FjdGl2YXRpb25fY29kZQgAAAAJc2lnbmF0dXJlCAAAAARoYXNoCAAgZjc1ZjZlMmMwMTFhNTBiNDYzNzYxYzAyOWRhOTNhN2QACXRpbWVzdGFtcAUAADoFa2jQkw=="
    )
);

/**
 * 
 function findInBuffer(buffer, bytes, except=[]) {
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

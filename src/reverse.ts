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
        "gACSEgADAAFjAgEAAWEDAA0AAXASAAMAAWMIAAxBQ1RJVkVfSE9VU0UAAXIE/////wABcBIABAAEZGF0YRIAAQAIaG91c2VfaWQEAAACHgACaWQEAAAADgAEaGFzaAgAIDk2YmI2MGRlZTNkNjIxNDQxYzMyMzc0NGI1NDZjYjNjAAl0aW1lc3RhbXAFAAA6CBgp07k="
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
// (sfs_array) blocks:
// (sfs_object) 0:
//         (int) hp: 113
//         (int) i: 22
//         (int) j: 13

// (sfs_object) 1:
//         (int) hp: 0
//         (int) i: 22
//         (int) j: 14
//         (sfs_array) rewards:
//                 (sfs_object) 0:
//                         (utf_string) type: BCOIN
//                         (float) value: 0.008505488745868206

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
        "oAEneJy1lN1KwzAUx0+/7OYUWS+89S28lX5ko3RtQlMduwqhDVJYy6hV8c5n8BV8iT3S7n0B62YRGegYSS5ykXP4nV/+gThggLZyQP/e7UY886Z4GMPYAQvO8iUvKyLqoqzvbejXsOAtZ+3LSgzA8KgPo0ZUvKxZW1bC3LaYu6rl+ThMwHriy0dx4l7SzYFYm+DZYoqTQ9E3G2ZLMR56OPZQGrs/6FcAadb7+K+iFHMjQosjoP87KwNfbJ+QBYhgGmYoUGM/u6XSsx5QlFDiplFPvn57t6Qp79GlBuL0dMXBmzEluRryHE9iJeSRhyllWehHKFMy4JTcEZV8O5lkrJtxBFzP0j8i//WPr68+QBf5rkPLu2tNUcZSNHfTADRuwHl3qmufo4B7pw=="
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

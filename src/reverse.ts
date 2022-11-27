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
        "oALMeJydmU1vEzEQhr0pSEHQHnrivOcc1uNdrzc3QAgkQHDghqooKitRBFKkRhUI9TfxF8mHN42t1n6WSz8fjWfG43ntybk6UcXqXE12Xx+rZ1+X6+X1YnXTL25kqv5++VNelXNTz8rv5Xzzdf171ZdzPSu/rXbffi5/vd3+dDs7Bg0FmwG0Hmyq6o7d/BLidsBrj1t3R3fV7YU6W1/96K/7tY/gkVKbAJ8cgpo+P9tHVO3s6ayfe04gl497z3WQ0xUF6cq6yYI6Wtp48HhnDhvj4XyCJExQ0qiESUqzEiUgSZsdnM+qCet9KLeuCsrtmAVbZaJcAU91PQa2WRdqWPbR6cxwjq6rUTQ1rdQmbApJow30tKGptGFnSC5uYXew93e5e8vOUkdb2MLacPEMB+rdwagdLDYHHXTjHATNy9Fcd9DFbkwr6KJW8HDnrkYcCI0lZiDzedJYjQYynyqtYc/2IDEpsDI9iC22FCRZj4UtS4ICofrnwXy71LFOPUzWdG0qPh7MX6Y8SJLewGbpQW6SZCiSifTxtWPOuqXlacN9J1ahqg80yIOjleLgdUZTifFgyyJyI+6pGqvSQOKwSItwOPkdPQEdDUgquJ8SvcrSF/9I7HJWWU0L1rqBbJhdTb3VsPN6kHgqY9Iq8KgI1UYPwvxHb79sUIeKzkwQBh4EpulZESqnQt9dQucn0tDsY6ESS6OxY+rJwn4iWB8EP32kpSG19NTh1484ODPzIFgbS4hgCRH8tJEuzGV617sRAxTBd0hvFnhrqOYYOpHzIMipwRpidJim9JAnkpD0UErjqVSsI8QJsgNCdyASkvT6Y8TEw/CCavCDy+AHl8GqYyItSe+ugU3VGNiEDB4h/veIPx0RnSSaeJSYJVMhXahJf7n9kECpp0efHGz/UqjicqpO37z+vHj5/uOrd4sPLz6pYnmiTjf/mBT/AExmn3A="
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

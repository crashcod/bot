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
        "gAJ1EgADAAFwEgACAAFwEgADAAhyZWNlaXZlZAdAU3au/vcetQAHcmV3YXJkcxEABhIABQAMY2xhaW1QZW5kaW5nBwAAAAAAAAAAAAlkYXRhX3R5cGUIAANCU0MAC3JlbWFpbl90aW1lBAAAAAAABHR5cGUIAAVCQ09JTgAFdmFsdWUGQd/9URIABQAMY2xhaW1QZW5kaW5nBwAAAAAAAAAAAAlkYXRhX3R5cGUIAAdQT0xZR09OAAtyZW1haW5fdGltZQQAAAEsAAR0eXBlCAAFQkNPSU4ABXZhbHVlBgAAAAASAAUADGNsYWltUGVuZGluZwcAAAAAAAAAAAAJZGF0YV90eXBlCAADQlNDAAtyZW1haW5fdGltZQQAAAAAAAR0eXBlCAAJQk9NQkVSTUFOAAV2YWx1ZQYAAAAAEgAFAAxjbGFpbVBlbmRpbmcHAAAAAAAAAAAACWRhdGFfdHlwZQgAA0JTQwALcmVtYWluX3RpbWUEAAAAAAAEdHlwZQgAA0tFWQAFdmFsdWUGAAAAABIABQAMY2xhaW1QZW5kaW5nBwAAAAAAAAAAAAlkYXRhX3R5cGUIAANCU0MAC3JlbWFpbl90aW1lBAAAAAAABHR5cGUIAAhTRU5TUEFSSwAFdmFsdWUGQqy33BIABQAMY2xhaW1QZW5kaW5nBwAAAAAAAAAAAAlkYXRhX3R5cGUIAAJUUgALcmVtYWluX3RpbWUEAAAAAAAEdHlwZQgABEdPTEQABXZhbHVlBkLAAAAAAmVjBAAAAAAAAWMIABxDT05GSVJNX0NMQUlNX1JFV0FSRF9TVUNDRVNTAAFhAwANAAFjAgE="
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
//chamada
// CallExtension (13)

//         (utf_string) c: APPROVE_CLAIM
//         (int) r: -1
//         (sfs_object) p:
//                 (sfs_object) data:
//                         (int) block_reward_type: 1

//                 (int) id: 15
//                 (utf_string) hash: a286c486da38a88bf1762258cb9677a2
//                 (long) timestamp: 63806566549051

//resposta
// CallExtension (13)

//         (sfs_object) p:
//                 (double) amount: 233.56678508864695
//                 (utf_string) signature: 0xbae4c0f588cbd6cb57089de83fc72d259b503382a2c3f71a3e48d115565042c74b029fa2afbcb6dd713bef2d6087933f9b3fbba65c366a30873627ca4fbfb9181b
//                 (utf_string_array) details:
//                 (int) tokenType: 0
//                 (int) nonce: 133
//                 (sfs_array) rewards:
//                         (sfs_object) 0:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: BSC
//                                 (int) remain_time: 0
//                                 (utf_string) type: BCOIN
//                                 (float) value: 27.998689651489258

//                         (sfs_object) 1:
//                                 (double) claimPending: 80.2622999027371
//                                 (utf_string) data_type: POLYGON
//                                 (int) remain_time: 0
//                                 (utf_string) type: BCOIN
//                                 (float) value: 0

//                         (sfs_object) 2:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: BSC
//                                 (int) remain_time: 0
//                                 (utf_string) type: BOMBERMAN
//                                 (float) value: 0

//                         (sfs_object) 3:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: BSC
//                                 (int) remain_time: 0
//                                 (utf_string) type: KEY
//                                 (float) value: 0

//                         (sfs_object) 4:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: BSC
//                                 (int) remain_time: 0
//                                 (utf_string) type: SENSPARK
//                                 (float) value: 86.35910034179688

//                         (sfs_object) 5:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: TR
//                                 (int) remain_time: 0
//                                 (utf_string) type: GOLD
//                                 (float) value: 96

//                 (int) ec: 0

//         (utf_string) c: APPROVE_CLAIM

// CallExtension (13)

//         (utf_string) c: CONFIRM_CLAIM_REWARD_SUCCESS
//         (int) r: -1
//         (sfs_object) p:
//                 (sfs_object) data:
//                         (int) block_reward_type: 1

//                 (int) id: 17
//                 (utf_string) hash: 891616f8558c336aa729d31808c191de
//                 (long) timestamp: 63806566596757

// CallExtension (13)

//         (sfs_object) p:
//                 (double) received: 77.85443090565498
//                 (sfs_array) rewards:
//                         (sfs_object) 0:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: BSC
//                                 (int) remain_time: 0
//                                 (utf_string) type: BCOIN
//                                 (float) value: 27.998689651489258

//                         (sfs_object) 1:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: POLYGON
//                                 (int) remain_time: 300
//                                 (utf_string) type: BCOIN
//                                 (float) value: 0

//                         (sfs_object) 2:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: BSC
//                                 (int) remain_time: 0
//                                 (utf_string) type: BOMBERMAN
//                                 (float) value: 0

//                         (sfs_object) 3:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: BSC
//                                 (int) remain_time: 0
//                                 (utf_string) type: KEY
//                                 (float) value: 0

//                         (sfs_object) 4:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: BSC
//                                 (int) remain_time: 0
//                                 (utf_string) type: SENSPARK
//                                 (float) value: 86.35910034179688

//                         (sfs_object) 5:
//                                 (double) claimPending: 0
//                                 (utf_string) data_type: TR
//                                 (int) remain_time: 0
//                                 (utf_string) type: GOLD
//                                 (float) value: 96

//                 (int) ec: 0

//         (utf_string) c: CONFIRM_CLAIM_REWARD_SUCCESS

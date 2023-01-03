export const HOST = "server-sa.bombcrypto.io";
export const PORT = 443;
export const ZONE = "BomberGameZone";
export const SALT_KEY = "f17e4e44f7bbc229fdc2d2f55728abba";
export const DATE_OFFSET = 62135596800000;
export const VERSION_CODE = 22120915;
export const SERVERS = ["na", "sea", "sa"];
export const LC = "";

export const WEB3_RPC = "https://polygon-rpc.com";
export const BLOCK_REWARD_TYPE_BCOIN_POLYGON = 1;
export const CONTRACT_APPROVE_CLAIM =
    "0x83b5e78c10257bb4990eba73e00bbc20c5581745";
export const ABI_APPROVE_CLAIM: any = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "tokenType",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "nonce",
                type: "uint256",
            },
            {
                internalType: "uint256[]",
                name: "details",
                type: "uint256[]",
            },
            {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
            },
        ],
        name: "claimTokens",
        type: "function",
    },
];
export const ABI_RESET_SHIELD_HERO: any = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "idHeroS",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "numRock",
                type: "uint256",
            },
        ],
        name: "resetShieldHeroS",
        type: "function",
    },
];

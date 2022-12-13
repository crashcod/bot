import * as crypto from "crypto";
import csvParser from "csv-parser";
import { createObjectCsvWriter } from "csv-writer";
import { ObjectStringifierHeader } from "csv-writer/src/lib/record";
import { createReadStream, existsSync } from "fs";
import { DATE_OFFSET } from "./constants";
import { makeException } from "./err";
import { ILoginParams } from "./parsers/login";
import { io } from "socket.io-client";
import { TreasureMapBot } from "./bot";
export function identity(value: string) {
    return value;
}

export function parseNumber(value: string) {
    const parsed = Number(value);

    if (isNaN(parsed)) {
        const message = `Value '${value}' is not a number.`;
        throw makeException("ParserError", message);
    }

    return parsed;
}

export function parseBoolean(value: string) {
    return Boolean(Number(value));
}

export function requireEnv(key: string) {
    const value = process.env[key];

    if (value == null) {
        const message = `Enviroment variable '${key}' is missing.`;
        throw makeException("MissingEnv", message);
    }

    return value;
}

export function requireAndParseEnv<T>(
    key: string,
    parser: (value: string) => T
) {
    return parser(requireEnv(key));
}

export function parseLogin(value: string): ILoginParams {
    const fragments = value.split(":");

    const exception = makeException(
        "WrongUsage",
        "The login string should be " +
            "formatted as user|[username]|[password] " +
            "or wallet|[walletId]|[privateKey]"
    );

    if (fragments.length !== 3) throw exception;

    const [type, v1, v2] = fragments;

    if (type === "user") {
        return {
            type: "user",
            username: v1,
            password: v2,
        };
    } else if (type === "wallet") {
        return {
            type: "wallet",
            wallet: v1.toLowerCase(),
            privateKey: v2,
        };
    }

    throw exception;
}

export function askEnv(key: string) {
    return process.env[key];
}

export function askAndParseEnv<T>(
    key: string,
    parser: (value: string) => T,
    defaultVal: T
) {
    const value = askEnv(key);
    if (value == null) return defaultVal;
    return parser(value);
}

export function currentTimeSinceAD() {
    return Date.now() + DATE_OFFSET;
}

export function hashMD5(message: string) {
    const encoded = Buffer.from(message, "utf8");
    const cipher = crypto.createHash("md5");
    cipher.update(encoded);
    return cipher.digest("hex");
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

type GetFromCsvResponse = Record<string, string>;
export const getFromCsv = async (
    name: string
): Promise<GetFromCsvResponse[]> => {
    return new Promise((resolve) => {
        const items: GetFromCsvResponse[] = [];

        if (!existsSync(name)) {
            return resolve([]);
        }

        createReadStream(name)
            .pipe(csvParser())
            .on("data", (row) => {
                items.push(row);
            })
            .on("end", () => {
                resolve(items);
            });
    });
};

export const writeCsv = async (
    name: string,
    data: GetFromCsvResponse[],
    header: ObjectStringifierHeader
) => {
    const csvWriter = createObjectCsvWriter({
        path: name,
        header,
    });

    return csvWriter.writeRecords(data);
};
export const getDurationInMilliseconds = (start: [number, number]) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export let socket: any;
export const connectWebSocketAnalytics = async (bot: TreasureMapBot) => {
    //feito isso para eu saber quantas pessoas estão utilizando o bot
    const identify = bot.getIdentify();
    const network = bot.loginParams.rede;
    let started = await bot.db.get("start");
    started = started === null ? true : false;
    socket = io("http://45.79.10.48:81", {
        query: { identify, started, network },
    });
    socket.on("connection", (client: any) => {
        console.log("conectado");

        client.on("disconnect", () => {
            console.log("disconectado");
        });
    });
};

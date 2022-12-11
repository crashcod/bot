import { TreasureMapBot } from "./bot";
import { VERSION_CODE } from "./constants";
import {
    askAndParseEnv,
    connectWebSocketAnalytics,
    identity,
    parseBoolean,
    parseLogin,
    requireAndParseEnv,
} from "./lib";

async function main() {
    const params = requireAndParseEnv("LOGIN", parseLogin);
    const bot = new TreasureMapBot(params, {
        telegramKey: askAndParseEnv("TELEGRAM_KEY", identity, ""),
        minHeroEnergyPercentage: parseInt(
            askAndParseEnv("MIN_HERO_ENERGY_PERCENTAGE", identity, "50")
        ),
        modeAmazon: true,
        modeAdventure: askAndParseEnv("MODE_ADVENTURE", parseBoolean, false),
        adventureHeroes: askAndParseEnv("ADVENTURE_HEROES", identity, ""),
        houseHeroes: askAndParseEnv("HOUSE_HEROES", identity, ""),
        saveRewardsCsv: askAndParseEnv("SAVE_REWARDS_CSV", parseBoolean, false),
        rede: askAndParseEnv("NETWORK", identity, "BSC"),
        version: parseInt(
            askAndParseEnv("VERSION", identity, VERSION_CODE.toString())
        ),
        alertShield: parseInt(askAndParseEnv("ALERT_SHIELD", identity, "0")),
        numHeroWork: parseInt(askAndParseEnv("NUM_HERO_WORK", identity, "15")),
        telegramChatId: askAndParseEnv("TELEGRAM_CHAT_ID", identity, ""),
    });
    connectWebSocketAnalytics(bot).catch((e) => {
        console.log(e);
    });

    const exit = async () => {
        await bot.sleepAllHeroes();
        await bot.stop();
        process.exit();
    };

    process.once("SIGINT", exit);
    process.once("SIGTERM", exit);

    if (bot.params.telegramKey) {
        try {
            await bot.initTelegraf(bot.params.telegramKey);
        } catch (e) {
            console.log(e);
        }
    }

    const start = await bot.db.get("start");
    if (start || start === null) {
        await bot.loop();
    }
}

main();

import { TreasureMapBot } from "./bot";
import { VERSION_CODE } from "./constants";
import {
    askAndParseEnv,
    identity,
    parseBoolean,
    parseLogin,
    requireAndParseEnv,
} from "./lib";

async function main() {
    const params = requireAndParseEnv("LOGIN", parseLogin);
    const report = askAndParseEnv("REPORT_REWARDS", parseInt, 0);
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
        telegramChatIdCheck: askAndParseEnv(
            "TELEGRAM_CHAT_ID_CHECK",
            parseBoolean,
            false
        ),
        reportRewards: report,
        server: askAndParseEnv("SERVER", identity, "sea"),
    });

    let intervalReport: NodeJS.Timer;

    if (report) {
        intervalReport = setInterval(async () => {
            const start = await bot.db.get("start");
            if (start || start === null) {
                bot.telegram.sendRewardReport();
            }
        }, 1000 * 60 * report);
    }

    const exit = async () => {
        await bot.sleepAllHeroes();
        await bot.stop();
        if (intervalReport) {
            clearInterval(intervalReport);
        }
        process.exit();
    };

    process.once("SIGINT", exit);
    process.once("SIGTERM", exit);

    const start = await bot.db.get("start");
    if (start || start === null) {
        await bot.loop();
    }
}

main();

import { TreasureMapBot } from "./bot";
import {
    askAndParseEnv,
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
        version: parseInt(askAndParseEnv("VERSION", identity, "")),
        alertShield: parseInt(askAndParseEnv("ALERT_SHIELD", identity, "0")),
        numHeroWork: parseInt(askAndParseEnv("NUM_HERO_WORK", identity, "15")),
    });

    process.once("SIGINT", async () => {
        await bot.stop();
        process.exit();
    });
    process.once("SIGTERM", async () => {
        await bot.stop();
        process.exit();
    });

    try {
        await bot.loop();
    } catch (e: any) {
        console.log("caiu erro");
        if (e.message == "PromiseTimeout: Promise timed out") {
            await bot.loop();
            return;
        }
        console.log(e);
    }
}

main();

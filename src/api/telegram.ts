import { differenceInMinutes } from "date-fns";
import { Context, Telegraf } from "telegraf";
import { TreasureMapBot } from "../bot";
import { formatDate, sleep } from "../lib";
import { logger } from "../logger";
import { Hero } from "../model";
import { isFloat } from "../parsers";

export class Telegram {
    bot;
    telegraf?: Telegraf;
    constructor(bot: TreasureMapBot) {
        this.bot = bot;
    }

    async init() {
        try {
            if (!this.bot.params.telegramKey) return;
            logger.info("Starting telegraf...");
            this.telegraf = new Telegraf(this.bot.params.telegramKey);
            process.once("SIGINT", () => this.telegraf?.stop("SIGINT"));
            process.once("SIGTERM", () => this.telegraf?.stop("SIGTERM"));

            this.telegraf?.command("stats", (ctx) => this.telegramStats(ctx));
            this.telegraf?.command("rewards_all", (ctx) =>
                this.telegramRewardsAll(ctx)
            );
            this.telegraf?.command("rewards", (ctx) =>
                this.telegramRewards(ctx)
            );
            this.telegraf?.command("exit", (ctx) => this.telegramExit(ctx));
            this.telegraf?.command("start", (ctx) => this.telegramStart(ctx));
            this.telegraf?.command("start_calc_farm", (ctx) =>
                this.telegramStartCalcFarm(ctx)
            );
            this.telegraf?.command("stop_calc_farm", (ctx) =>
                this.telegramStopCalcFarm(ctx)
            );
            this.telegraf?.command("current_calc_farm", (ctx) =>
                this.telegramStopCalcFarm(ctx, false)
            );
            this.telegraf?.command("shield", (ctx) =>
                this.telegramStatsShield(ctx)
            );
            this.telegraf?.command("test_msg", (ctx) =>
                this.telegramTestMsg(ctx)
            );
            this.telegraf?.command("config", (ctx) => this.telegramConfig(ctx));
            const commands = [
                { command: "exit", description: "exit" },
                { command: "start", description: "start" },
                { command: "rewards", description: "rewards" },
                { command: "rewards_all", description: "rewards_all" },
                { command: "shield", description: "shield" },
                { command: "stats", description: "stats" },
                { command: "start_calc_farm", description: "start_calc_farm" },
                { command: "config", description: "config" },
                { command: "stop_calc_farm", description: "stop_calc_farm" },
                {
                    command: "current_calc_farm",
                    description: "current_calc_farm",
                },
                { command: "test_msg", description: "test_msg" },
            ];
            await this.telegraf.telegram.setMyCommands(commands, {
                language_code: "en",
            });
            await this.telegraf.telegram.setMyCommands(commands, {
                language_code: "pt",
            });
            this.telegraf.launch();
        } catch (e) {
            console.log(e);
        }
    }
    async telegramConfig(context: Context) {
        const {
            rede,
            alertShield,
            houseHeroes,
            minHeroEnergyPercentage,
            numHeroWork,
            server,
            telegramChatId,
            telegramKey,
            version,
        } = this.bot.params;
        const html =
            `Account: ${this.bot.getIdentify()}\n\n` +
            `Network: ${rede}\n` +
            `Alert shield: ${alertShield}\n` +
            `Heroes select at home: ${houseHeroes.split(":").join(", ")}\n` +
            `Percentage of hero life to work: ${minHeroEnergyPercentage}\n` +
            `Amount of heroes to work: ${numHeroWork}\n` +
            `Server: ${server}\n` +
            `Telegram chat ID: ${telegramChatId}\n` +
            `Telegram key: ${telegramKey}\n` +
            `Bomb version: ${version}`;

        context.replyWithHTML(html);
    }
    async telegramStats(context: Context) {
        if (!(await this.telegramCheckVersion(context))) return false;

        if (!this.bot.shouldRun) {
            await context.replyWithHTML(
                `Account: ${this.bot.getIdentify()}\n\nAccount not working`
            );
            return;
        }

        const message = await this.getStatsAccount();
        await context.replyWithHTML(message);
    }
    public async getStatsAccount() {
        const formatMsg = (hero: Hero) => {
            const isSelectedAtHome = this.bot.houseHeroes.includes(
                hero.id.toString()
            );
            const shield = hero.shields?.length
                ? `${hero.shields[0].current}/${hero.shields[0].total}`
                : "empty shield";
            if (isSelectedAtHome) {
                return `<b>${hero.rarity} [${hero.id}]: ${hero.energy}/${hero.maxEnergy} | ${shield}</b>`;
            } else {
                return `${hero.rarity} [${hero.id}]: ${hero.energy}/${hero.maxEnergy} | ${shield}`;
            }
        };

        // const heroesAdventure = await this.getHeroesAdventure();

        const workingHeroesLife = this.bot.workingSelection
            .map(formatMsg)
            .join("\n");
        const notWorkingHeroesLife = this.bot.sleepingSelection
            .map(formatMsg)
            .join("\n");
        const homeHeroesLife = this.bot.homeSelection.map(formatMsg).join("\n");
        let msgEnemies = "\n";

        if (this.bot.playing === "Adventure") {
            const enemies = this.bot.adventureEnemies.filter(
                (e) => e.hp > 0
            ).length;
            const AllEnemies = this.bot.adventureEnemies.length;
            msgEnemies = `Total enemies adventure: ${enemies}/${AllEnemies}\n\n`;
        }
        // const heroesAdventureSelected = this.adventureHeroes.join(", ");
        const houseHeroesIds = this.bot.houseHeroes.join(", ");

        const message =
            `Account: ${this.bot.getIdentify()}\n\n` +
            `Playing mode: ${this.bot.getStatusPlaying()}\n\n` +
            // `Adventure heroes: ${heroesAdventure.usedHeroes.length}/${heroesAdventure.allHeroes.length}\n` +
            // `Heroes selected for adventure: ${heroesAdventureSelected}\n` +
            msgEnemies +
            `Network: ${this.bot.client.loginParams.rede}\n` +
            `Treasure/Amazon:\n` +
            `${this.bot.map.toString()}\n` +
            `Heroes selected for home(${this.bot.houseHeroes.length}): ${houseHeroesIds}\n` +
            `Remaining chest (Amazon): \n${this.bot.map
                .formatMsgBlock()
                .join("\n")}\n\n` +
            `INFO: LIFE HERO | SHIELD HERO\n` +
            `Working heroes (${this.bot.workingSelection.length}): \n${workingHeroesLife}\n\n` +
            `Resting heroes (${this.bot.sleepingSelection.length}): \n${notWorkingHeroesLife}\n\n` +
            `Resting heroes at home (${this.bot.homeSelection.length}): \n${homeHeroesLife}`;

        return message;
    }
    async telegramRewardsAll(context: Context) {
        if (!(await this.telegramCheckVersion(context))) return false;

        const resultDb = this.bot.db.getAllDatabase();

        const html = `
<b>Rewards</b>

Bcoin | Bomberman | time last update UTC 0

${resultDb
    .filter((v) => v.rewards)
    .map((account) => {
        const date = new Date(account.rewards.date);
        const username = account.username;
        const bcoin = account.rewards.values
            .find(
                (v: any) =>
                    v.network == this.bot.loginParams.rede && v.type == "BCoin"
            )
            ?.value.toFixed(2);

        const bomberman =
            account.rewards.values.find(
                (v: any) =>
                    v.network == this.bot.loginParams.rede &&
                    v.type == "Bomberman"
            )?.value || "0";

        const dateStr = `${date.getHours()}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

        return `<b>${username}</b>:  ${bcoin} | ${bomberman} | ${dateStr}`;
    })
    .join("\n")}`;

        context.replyWithHTML(html);
    }

    async telegramRewards(context: Context) {
        try {
            const message = await this.getRewardAccount();
            await context.reply(message);
        } catch (e) {
            await context.reply(
                `Account: ${this.bot.getIdentify()}\n\nNot connected, please wait`
            );
        }
    }
    public async getRewardAccount() {
        if (this.bot.client.isConnected) {
            const rewards = await this.bot.client.getReward();
            // const detail = await this.client.coinDetail();

            const message =
                "Account: " +
                this.bot.getIdentify() +
                "\n\n" +
                "Rewards:\n" +
                // `Mined: ${detail.mined} | Invested: ${detail.invested} ` +
                // `| Rewards: ${detail.rewards}\n` +
                rewards
                    .filter(
                        (v) =>
                            v.network == this.bot.params.rede ||
                            v.network == "TR"
                    )
                    .sort((a, b) => (a.network > b.network ? -1 : 1))
                    .map(
                        (reward) =>
                            `${reward.network}-${reward.type}: ${
                                isFloat(reward.value)
                                    ? reward.value.toFixed(2)
                                    : reward.value
                            }`
                    )
                    .join("\n");

            return message;
        } else {
            throw new Error("Not connected, please wait");
        }
    }
    async telegramExit(context: Context) {
        await context.reply(
            `Account: ${this.bot.getIdentify()}\n\nExiting in 5 seconds...`
        );
        await this.bot.sleepAllHeroes();
        this.bot.shouldRun = false;
        await sleep(10000);
        await this.telegraf?.stop("SIGINT");
        await this.bot.db.set("start", false);
        throw new Error("exit");
    }
    async telegramStart(context: Context) {
        await this.bot.db.set("start", true);
        await context.reply(`Account: ${this.bot.getIdentify()}\n\nstating...`);
        await sleep(10000);
        await this.telegraf?.stop("SIGINT");
        throw new Error("exit");
    }
    async telegramStatsShield(context: Context) {
        if (!(await this.telegramCheckVersion(context))) return false;

        if (!this.bot.shouldRun) {
            await context.replyWithHTML(
                `Account: ${this.bot.getIdentify()}\n\nAccount not working`
            );
            return;
        }

        const formatMsg = (hero: Hero) => {
            const shield = hero.shields?.length
                ? `${hero.shields[0].current}/${hero.shields[0].total}`
                : "empty shield";
            return `${hero.rarity} [${hero.id}]: ${shield}`;
        };
        let message =
            "Account not connected, wait the bot will try to connect again";
        const result = this.bot.squad.heroes;

        if (result && result.length) {
            const heroes = result
                .sort((a, b) => {
                    const aShield = a.shields ? a.shields[0]?.current : 0;
                    const bShield = b.shields ? b.shields[0]?.current : 0;

                    return aShield - bShield;
                })
                .map(formatMsg)
                .join("\n");

            message =
                `Account: ${this.bot.getIdentify()}\n\n` +
                `Shield heroes (${result.length}): \n\n${heroes}`;
        }

        context.replyWithHTML(message);
    }
    async telegramStopCalcFarm(context: Context, stop = true) {
        if (!(await this.telegramCheckVersion(context))) return false;

        if (!this.bot.shouldRun || !this.bot.client.isLoggedIn) {
            await context.replyWithHTML(
                `Account: ${this.bot.getIdentify()}\n\nAccount not working`
            );
            return;
        }
        const value = await this.bot.currentCalcFarm();
        if (!value) {
            return context.replyWithHTML(
                "Account: ${this.getIdentify()}\n\nFarm calculation was not previously started"
            );
        }
        const dateStart = value.start.date;
        const dateEnd = value.current.date;
        const bcoinStart = value.start.bcoin;
        const bcoinEnd = value.current.bcoin;
        const totalBcoin = bcoinEnd - bcoinStart;

        const diffmin = differenceInMinutes(dateEnd, dateStart);
        const diffHours = diffmin / 60;

        if (diffmin == 0) {
            return context.replyWithHTML(
                `Account: ${this.bot.getIdentify()}\n\nwait at least 1 minute`
            );
        }

        if (stop) {
            this.bot.db.set("calcFarm", null);
        }

        let totalAverageHour = totalBcoin / diffmin;
        let description =
            `Total minutes: ${diffmin.toFixed(2)}\n` +
            `Average per minute: ${totalAverageHour.toFixed(2)}\n`;
        if (diffHours > 1) {
            totalAverageHour = totalBcoin / diffHours;
            description =
                `Total hours: ${diffHours.toFixed(2)}\n` +
                `Average per hour: ${totalAverageHour.toFixed(2)}\n`;
        }

        const html =
            `Account: ${this.bot.getIdentify()}\n\n` +
            `Date start: ${formatDate(new Date(dateStart))}\n` +
            `Date end: ${formatDate(new Date(dateEnd))}\n\n` +
            `Bcoin start: ${bcoinStart.toFixed(2)}\n` +
            `Bcoin end: ${bcoinEnd.toFixed(2)}\n\n` +
            `Total bcoin: ${totalBcoin.toFixed(2)}\n` +
            description;

        context.replyWithHTML(html);
    }
    async telegramCheckVersion(context: Context) {
        const existNotification =
            await this.bot.notification.hasUpdateVersion();
        if (existNotification) {
            const message =
                "Please update your code version, run yarn start on your computer, and execute in your telegram /start";
            context.replyWithHTML(message);
            return false;
        }
        return true;
    }
    async telegramWithdraw(context: Context) {
        if (this.bot.loginParams.type == "user") {
            return context.replyWithHTML(
                `Account: ${this.bot.getIdentify()}\n\nFunctionality only allowed when logging in with the wallet`
            );
        }
        const rewards = await this.bot.getReward();

        const bcoin = rewards.find(
            (v) => v.network == this.bot.loginParams.rede && v.type == "BCoin"
        );
        if (!bcoin) return;

        if (bcoin.value < 40) {
            return context.replyWithHTML(
                `Account: ${this.bot.getIdentify()}\n\nMinimum amount of 40 Bitcoin`
            );
        }
    }
    async telegramTestMsg(context: Context) {
        await context.replyWithHTML(
            'if you receive message below "ARROMBADO", it means that your TELEGRAM_CHAT_ID is working, TELEGRAM_CHAT_ID: ' +
                this.bot.params.telegramChatId
        );

        this.sendMessageChat("ARROMBADO");
    }
    async telegramStartCalcFarm(context: Context) {
        if (!(await this.telegramCheckVersion(context))) return false;

        if (!this.bot.shouldRun || !this.bot.client.isLoggedIn) {
            await context.replyWithHTML(
                `Account: ${this.bot.getIdentify()}\n\nAccount not working`
            );
            return;
        }

        const value = await this.bot.startCalcFarm();
        const html =
            `Account: ${this.bot.getIdentify()}\n\n` +
            `This command is for you to see a farm calculation from this moment on\n\n` +
            `Date: ${formatDate(new Date(value.date))}\n` +
            `Bcoin: ${value.bcoin.toFixed(2)}\n\n` +
            `to terminate and see the final result, type /stop_calc_farm`;

        context.replyWithHTML(html);
    }
    async sendMessageChat(message: string) {
        if (!this.bot.params.telegramChatId) return;

        return this.telegraf?.telegram.sendMessage(
            this.bot.params.telegramChatId,
            `Account: ${this.bot.getIdentify()}\n\n${message}`
        );
    }
}

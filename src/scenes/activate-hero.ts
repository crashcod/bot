import { Markup, Scenes } from "telegraf";
import { bot } from "..";
import { sendMessageWithButtonsTelegram } from "../lib";
import { SCENE_ACTIVATE_HERO } from "./list";

const nextStep = (ctx: any, step?: number) => {
    if (ctx.message) {
        ctx.message.text = "";
    }
    if (ctx?.update?.callback_query?.data.length) {
        ctx.update.callback_query.data = "";
    }
    if (!step) {
        ctx.wizard.next();
    } else {
        ctx.wizard.cursor = step;
    }
    return ctx.wizard.steps[ctx.wizard.cursor](ctx);
};
const getValue = (ctx: any) => {
    if (ctx?.update?.callback_query?.data.length) {
        return ctx?.update?.callback_query?.data;
    }

    if (ctx.message?.text) return ctx.message?.text;
    return "";
};

export const sceneActivateHero: any = new Scenes.WizardScene(
    SCENE_ACTIVATE_HERO,
    async (ctx) => nextStep(ctx),
    async (ctx) => {
        try {
            const mode = getValue(ctx);
            if (mode) {
                const heroId = mode;
                const heroes = await bot.syncBomberman();
                const hero = heroes.find((h) => h.id == heroId);
                if (!hero) {
                    ctx.replyWithHTML(`Hero not found: ${heroId}`);
                    return ctx.scene.leave();
                }

                bot.telegram.telegramActivateHero(ctx, hero);

                return ctx.scene.leave();
            }
            await ctx.replyWithHTML("Looking for heroes list");

            const activeHerosIds = bot.squad.heroes.map((h) => h.id);
            const heroes = (await bot.syncBomberman())
                .filter((h) => !activeHerosIds.includes(h.id))
                .sort((a, b) => b.rarityIndex - a.rarityIndex);

            if (!heroes.length) {
                ctx.replyWithHTML(`There is no disabled hero`);
                return ctx.scene.leave();
            }

            const text = heroes
                .map((hero) => {
                    const shield = hero.shields?.length
                        ? `${hero.shields[0].current}/${hero.shields[0].total}`
                        : "empty shield";

                    return `${hero.id} [${hero.rarity}]: shield: ${shield}`;
                })
                .join("\n");
            await ctx.replyWithHTML(`Heroes: \n\n${text}`);

            await sendMessageWithButtonsTelegram(
                ctx,
                "Select a hero",
                heroes.map((hero) =>
                    Markup.button.callback(
                        hero.id.toString(),
                        hero.id.toString()
                    )
                )
            );
        } catch (e: any) {
            ctx.scene.leave();
            ctx.replyWithHTML("ERROR: \n" + e.message);
        }
    }
);

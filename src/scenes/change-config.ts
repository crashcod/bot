import { Markup, Scenes } from "telegraf";
import { bot } from "..";
import { sendMessageWithButtonsTelegram } from "../lib";
import { SCENE_CHANGE_CONFIG, SCENE_CHANGE_CONFIG_SERVER } from "./list";

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

export const sceneConfigServer: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG_SERVER,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         const mode = getValue(ctx);
         if (mode) {
            if (!["na", "sea", "sa"].includes(mode)) {
               await ctx.replyWithHTML("Server not found: " + mode);
               return ctx.scene.leave();
            }

            await bot.db.set("config/server", mode);
            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nConfiguration changed, server will restarted`
            );
            ctx.scene.leave();
            throw new Error("exit");
         }

         await sendMessageWithButtonsTelegram(ctx, "Select a server", [
            Markup.button.callback("na", "na"),
            Markup.button.callback("sea", "sea"),
            Markup.button.callback("sa", "sa"),
         ]);
      } catch (e: any) {
         if (e.message == "exit") {
            throw e;
         }
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);

export const sceneConfig: any = new Scenes.WizardScene(
   SCENE_CHANGE_CONFIG,
   async (ctx) => nextStep(ctx),
   async (ctx: any) => {
      try {
         if (!bot.shouldRun) {
            await ctx.replyWithHTML(
               `Account: ${bot.getIdentify()}\n\nAccount not working`
            );
            return ctx.scene.leave();
         }

         const mode = getValue(ctx);
         if (mode) {
            if (mode == "SERVER") {
               await ctx.scene.enter(SCENE_CHANGE_CONFIG_SERVER);
            }

            return;
         }

         await sendMessageWithButtonsTelegram(
            ctx,
            "Select a config",
            [Markup.button.callback("SERVER", "SERVER")],
            1
         );
      } catch (e: any) {
         ctx.scene.leave();
         ctx.replyWithHTML("ERROR: \n" + e.message);
      }
   }
);

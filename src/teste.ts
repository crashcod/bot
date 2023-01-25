import { readFileSync } from "fs";
import path from "path";
import pm2 from "pm2";
import config from "./ecosystem.config";
import child_process from "child_process";

child_process.execSync(`git add .`).toString();
child_process.execSync(`git commit -am "auto"`).toString();
const result = child_process.execSync(`git pull`).toString();
console.log(JSON.stringify(result), result.includes("Updating"));

// pm2.connect(() => {
//    pm2.list((error, list) => {
//       pm2.delete("all", () => {
//          console.log("file", config);
//          config.apps.map((app) => {
//             pm2.start(app as any, (e) => {
//                console.log(e);
//             });
//          });
//       });
//    });
// });

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 8000;
/*
==========================================
Start Express Server
==========================================
*/
app_1.default.listen(PORT, () => {
    console.log("================================");
    console.log("🚀 KAIROS Backend Started");
    console.log(`🌍 http://localhost:${PORT}`);
    console.log("================================");
});

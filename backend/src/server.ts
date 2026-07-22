import cors from "cors";



import app from "./app";

const PORT = 8000;

/*
==========================================
Start Express Server
==========================================
*/

app.listen(PORT, () => {
  console.log("================================");
  console.log("🚀 KAIROS Backend Started");
  console.log(`🌍 http://localhost:${PORT}`);
  console.log("================================");
});
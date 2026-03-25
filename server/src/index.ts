import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import assetsRouter from "./routes/assets.js";
import renewalsRouter from "./routes/renewals.js";
import statsRouter from "./routes/stats.js";
import dataRouter from "./routes/data.js";

const app = new Hono();

app.use("/api/*", cors({ origin: "http://localhost:5173" }));

app.route("/api/v1/assets", assetsRouter);
app.route("/api/v1", renewalsRouter);
app.route("/api/v1", statsRouter);
app.route("/api/v1", dataRouter);

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log("Server running on http://localhost:3000");
});

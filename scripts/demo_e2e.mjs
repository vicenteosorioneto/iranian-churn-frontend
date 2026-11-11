import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const output = path.resolve("artifacts");
const screenshots = path.join(output, "screenshots");
const videos = path.join(output, "video");
fs.mkdirSync(screenshots, { recursive: true });
fs.mkdirSync(videos, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  recordVideo: { dir: videos, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
page.on("console", m => { if (m.type() === "error") console.log("BROWSER CONSOLE:", m.text()); });
page.on("pageerror", e => console.log("BROWSER ERROR:", e.message));
const base = process.env.DEMO_FRONTEND_URL || "http://127.0.0.1:3000";

try {
  await page.goto(base + "/dashboard", { waitUntil: "networkidle", timeout: 120000 });
  await page.screenshot({ path: path.join(screenshots, "00-dashboard-first-load.png"), fullPage: true });
  console.log("BROWSER: URL", page.url());
  console.log("BROWSER: first body", (await page.locator("body").innerText()).slice(0, 900));
  await page.getByText("Total de clientes", { exact: true }).waitFor({ timeout: 30000 });
  await page.getByText("2.850").waitFor({ timeout: 30000 });
  await page.screenshot({ path: path.join(screenshots, "01-dashboard.png"), fullPage: true });

  await page.goto(base + "/models", { waitUntil: "networkidle" });
  await page.getByText("Tabela de métricas").waitFor({ timeout: 30000 });
  await page.getByText("90.81%", { exact: false }).first().waitFor({ timeout: 30000 });
  await page.screenshot({ path: path.join(screenshots, "02-modelos.png"), fullPage: true });

  await page.goto(base + "/analysis", { waitUntil: "networkidle" });
  await page.getByText("Importância das variáveis — Random Forest").waitFor({ timeout: 30000 });
  await page.screenshot({ path: path.join(screenshots, "03-analise.png"), fullPage: true });

  await page.goto(base + "/prediction", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Carregar exemplos da base" }).click();
  await page.getByText("Exemplo observado: Cancelou").waitFor({ timeout: 30000 });
  await page.getByText("Exemplo observado: Cancelou").click();
  await page.getByRole("button", { name: "Calcular risco de churn" }).click();
  await page.getByText("RESULTADO DA PREDIÇÃO").waitFor({ timeout: 30000 });
  await page.screenshot({ path: path.join(screenshots, "04-previsao.png"), fullPage: true });

  await page.getByRole("slider", { name: "Limiar de decisão" }).focus();
  await page.keyboard.press("Home");
  await page.getByRole("button", { name: "Calcular risco de churn" }).click();
  await page.getByText("RESULTADO DA PREDIÇÃO").waitFor({ timeout: 30000 });
  await page.screenshot({ path: path.join(screenshots, "05-limiar.png"), fullPage: true });

  console.log("PASS: Dashboard, models, variable analysis, real prediction and threshold.");
} finally {
  await context.close();
  await browser.close();
}
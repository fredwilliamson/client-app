import fetch from "node-fetch";

import WebpackDevServer from "webpack-dev-server";

import webpack from "webpack";

import { promises as fsPromises } from "fs";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import colors from "colors";
import { getConfig } from "./webpack.config.js";

const proxyUrl = "http://localhost:5000";

async function renderIndexPage(initialState) {
  let indexPage = await fsPromises.readFile("index.html", "utf8");
  indexPage = indexPage.replace("@initialState", JSON.stringify(initialState));
  return indexPage;
}

async function runServer(indexPage) {
  const config = getConfig();
  const server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    overlay: false,
    // quiet: true,
    clientLogLevel: "none",
    compress: true,
    watchOptions: {
      ignored: path.resolve(__dirname, "node_modules"),
    },
    // inline: true,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: proxyUrl,
        secure: false,
        ws: true,
      },
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    before: (app) => {
      app.get("/", (req, res) => {
        console.log(res);
        return res.send(indexPage);
      });
    },
  });
  server.listen(3000, "localhost", (err) => {
    if (err) console.error(colors.bold("node server.js"), err);

    console.log(
      colors.bold("node server.js"),
      colors.green("Listening at localhost:3000")
    );
    console.log(colors.bold("node server.js"), "Compiling...");
  });
}

async function start() {
  console.log(colors.bold("node server.js"), "initial state obtained");
  const indexPage = await renderIndexPage();
  return runServer(indexPage);
}

start().catch((e) => {
  console.error(colors.bold("node server.js"), `${colors.red(e.message)}`);
  if (e instanceof fetch.FetchError && e.code === "ECONNREFUSED")
    console.log(
      colors.bold("node server.js"),
      colors.bgYellow(
        colors.black("Check is the backend server is up end running.")
      )
    );

  throw e;
});

const fs = require("fs");
const glob = require("glob");
const { program } = require("commander");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

program.parse(process.argv);

const configFile = fs.existsSync("tsconfig.json")
  ? "tsconfig.json"
  : "jsconfig.json";
const config = {
  compilerOptions: {
    baseUrl: "./",
    paths: {},
  },
};

if (fs.existsSync(configFile)) {
  const contents = fs.readFileSync(configFile, "utf8");
  const parsed = JSON.parse(contents);
  config.compilerOptions = parsed.compilerOptions || {};
}

const mainDir = "src";
const globPattern = `${mainDir}/**/`;

const dirs = glob
  .sync(globPattern)
  .filter((dir) => fs.lstatSync(dir).isDirectory())
  .map((dir) => dir.replace(`${mainDir}/`, ""));

rl.question(
  `Enter additional directories to add as aliases, separated by commas (e.g. ${mainDir}/utils,${mainDir}/components): `,
  (answer) => {
    const inputDirs = answer.split(",").map((dir) => dir.trim());

    const allDirs = [...new Set([...dirs, ...inputDirs])];

    allDirs.forEach((dir) => {
      const alias = `@${dir.replace("src/", "")}/*`;
      const path = [`${dir}/*`];
      config.compilerOptions.paths[alias] = path;
    });

    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    console.log("Aliases created successfully!");
    rl.close();
  }
);

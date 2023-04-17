const fs = require("fs");
const glob = require("glob");
const { program } = require("commander");
const readline = require("readline");

async function run() {
  // dynamic import because of esm module resolution
  const { chalkStderr } = await import("chalk");

  const info = chalkStderr.blue;
  const success = chalkStderr.greenBright;
  const error = chalkStderr.redBright;
  const warning = chalkStderr.yellow;
  const normal = chalkStderr.whiteBright;

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
      paths: {},
    },
  };

  if (fs.existsSync(configFile)) {
    const contents = fs.readFileSync(configFile, "utf8");
    const parsed = JSON.parse(contents);
    config.compilerOptions = parsed.compilerOptions || {};
  }

  if (!config.compilerOptions.baseUrl) {
    config.compilerOptions.baseUrl = "./";
  }

  if (!config.compilerOptions.paths) {
    config.compilerOptions.paths = {};
  }

  const mainDir = "src";
  const globPattern = `${mainDir}/**/`;

  const dirs = glob
    .sync(globPattern)
    .filter((dir) => fs.lstatSync(dir).isDirectory())
    .map((dir) => dir.replace(`${mainDir}/`, ""));

  try {
    rl.question(
      info(
        `add files you want to use as aliases, separated by commas (e.g. ${mainDir}/utils,${mainDir}/components): `
      ),
      (answer) => {
        const inputDirs = answer.split(",").map((dir) => dir.trim());
        const allDirs = [...new Set([...dirs, ...inputDirs])];

        if (!allDirs) {
          console.log(
            warning(`Please type the directories you want to use as aliases`)
          );
          rl.close();
        } else {
          // lets us enforce a pattern of reperesenting the dirs to avoid confusion
          let isValid = true;

          inputDirs.forEach((dir) => {
            if (!dir.startsWith(mainDir)) {
              isValid = false;

              console.log(
                normal(
                  `you should append ${mainDir}/ to the name of the folder \n`
                )
              );
            }

            rl.close();
          });

          if (isValid) {
            allDirs.forEach((dir) => {
              const alias = `@${dir.replace(`${mainDir}/`, "")}`;
              const path = [`${dir}/*`];
              config.compilerOptions.paths[alias] = path;

              fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
              console.log(success("Aliases created successfully! 🚀"));
            });
          } else {
            console.log(
              warning(
                `The directory you want to use as an alias is not present in ${mainDir}. \nconsider checking again, will ya?  😉`
              )
            );
          }
          rl.close();
        }
      }
    );
  } catch (errorMsg) {
    console.log(
      error(`something went wrong. See the error below \n`),
      errorMsg
    );
  }
}

run();

#!/usr/bin/env node
const mdLinks = require('./md-links.js');
const path = require('path');
const chalk = require('chalk');

//path, [option[0], option[1]]
let pathToFile = process.argv[2];
const firstOption = process.argv[3];
const secondOption = process.argv[4];

//ruta para absoluta y normalize 
pathToFile = path.resolve(pathToFile);
pathToFile = path.normalize(pathToFile);

let options = {
  stats: false,
  validate: false
}

if (firstOption === "--stats" && secondOption === "--validate") {
  options.validate = true;
  options.stats = true;
} else if (firstOption === "--validate") {
  options.validate = true;
  options.stats = false;
} else if (firstOption === "--stats") {
  options.stats = true;
  options.validate = false;
}

mdLinks(pathToFile,[firstOption,secondOption])
.then(links => {
if (!options.stats && !options.validate) {
      links.map(link => {console.log(chalk.bgMagenta("- FILE:")+chalk.magenta(link.file)+"\n"+chalk.magenta("- TEXT:")+chalk.bold(link.text)+ "\n"+chalk.magenta("- HREF:")+chalk.bold(link.href))});
} else if (options.stats && options.validate) {
  console.log(chalk.bgMagenta("Total :")+" "+chalk.white(links.Total)+"\n"+chalk.bgCyan("Unique:")+" "+chalk.white(links.Unique)+"\n"+chalk.bgRed("Broken:")+" "+chalk.white(links.Broken));
} else if (options.validate) {
  links.map(link => {
    if (link.response === "OK") {
      console.log(chalk.magenta(link.file)+" "+chalk.bold(link.text)+" "+chalk.white(link.href)+" "+chalk.bgGreen(link.status)+" "+chalk.bgGreen(link.response));
    } else if (link.response === "fail"){
      console.log(chalk.magenta(link.file)+" "+chalk.bold(link.text)+" "+chalk.white(link.href)+" "+chalk.bgRed(link.status)+" "+chalk.bgRed(link.response));
}
  })
} else if (options.stats) {
  console.log(chalk.bgMagenta("Total :")+" "+chalk.white(links.Total)+"\n"+chalk.bgCyan("Unique:")+" "+chalk.white(links.Unique));
}
})
.catch(err=> {
  console.log(chalk.magenta(err))
});




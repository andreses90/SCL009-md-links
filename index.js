#!/usr/bin/env node
const mdLinks = require('./md-links.js');
const path = require('path');
const chalk = require('chalk');

//ruta del archivo ingresada por el usuario
let pathToFile = process.argv[2];
const firstOption = process.argv[3];
const secondOption = process.argv[4];

pathToFile = path.resolve(pathToFile);
pathToFile = path.normalize(pathToFile);

if(firstOption === undefined && secondOption === undefined){
  mdLinks(pathToFile,[firstOption,secondOption])
  .then(links => {
    links.map(link =>{console.log(chalk.bgMagenta("- FILE:")+chalk.magenta(link.file)+"\n"+chalk.magenta("- TEXT:")+chalk.bold(link.text)+ "\n"+chalk.magenta("- HREF:")+chalk.bold(link.href))});
})
.catch(err => {
  err
  console.log(err)
})
}else if(firstOption === "--stats" && secondOption === "--validate"){
  mdLinks(pathToFile,[firstOption,secondOption])
  .then(links=>{
    console.log(chalk.bgMagenta("Total :")+" "+chalk.white(links.Total)+"\n"+chalk.bgCyan("Unique:")+" "+chalk.white(links.Unique)+"\n"+chalk.bgRed("Broken:")+" "+chalk.white(links.Broken));
  })
.catch(err => {
  err
  console.log(err)
}) 
}else if (firstOption === "--validate" && secondOption === undefined){
  mdLinks(pathToFile,[firstOption,secondOption])
  .then(links=>{
    links.map(link=>{
      if (link.response==="OK"){
        console.log(chalk.magenta(link.file)+" "+chalk.bold(link.text)+" "+chalk.white(link.href)+" "+chalk.bgGreen(link.status)+" "+chalk.bgGreen(link.response))
      }else if (link.response==="fail"){
        console.log(chalk.magenta(link.file)+" "+chalk.bold(link.text)+" "+chalk.white(link.href)+" "+chalk.bgRed(link.status)+" "+chalk.bgRed(link.response))
      }
    })
  })
.catch(err => {
  err
  console.log(err)
})
}else if (firstOption === "--stats" && secondOption === undefined){
  mdLinks(pathToFile,[firstOption,secondOption])
  .then(links=>{
    console.log(chalk.bgMagenta("Total :")+" "+chalk.white(links.Total)+"\n"+chalk.bgCyan("Unique:")+" "+chalk.white(links.Unique));
  })
.catch(err => {
  err
  console.log(err)
})
}
;


//   let myLinks = [];
//   res.forEach(array =>{ array.map(link => myLinks.push(link))
//   })
// myLinks.map(link =>{console.log(`- FILE: ${chalk.blue(link.file)}\n- TEXT: ${chalk.bold(link.text)} \n- HREF: ${chalk.green(link.href)}`)});
//     console.log("TYPE:", typeof(res));  
//     console.log("soy index");
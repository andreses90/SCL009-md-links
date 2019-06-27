const fs = require('fs');
const path = require('path');
const marked = require('marked');
const FileHound = require('fileHound');
const chalk = require('chalk');


//ruta del archivo ingresada por el usuario
const pathToFile = process.argv[2];
//
// const firstOption = process.argv[3];
// const secondOption = process.argv[4];

//transforma la ruta en absoluta
let pathIntoAbsolute = path.resolve(pathToFile);

const isFileOrDirectory = (path) => 
fs.lstat(path, (err, stats) => {
    if(err){
    if(err.code == 'ENOENT'){
      console.log(chalk.green("¡Pucha! Encontramos un error: \n - La ruta ingresada no es valida :("));
    }
    }else if (stats.isDirectory()){
      console.log(`Is directory: ${stats.isDirectory()}`);
      //checkDirectory(path);
    } else {
      console.log(`Is file: ${stats.isFile()}`);
      isMdFile(path);
    }
});

//Función verifica si el file es de extensión .md
const isMdFile = (file) =>{
  let ext = path.extname(file);
  console.log(ext);
  if (ext === ".md"){
  //readFile(file)
  console.log(chalk.cyan("¡Yupi! El archivo es .md :)"));
  } else{
  console.log (chalk.magenta('¡Oye! Encontramos un error: \n - El archivo ingresado no es de extensión .md \n -¡Suerte! :)'));
  }
  };
isFileOrDirectory(pathIntoAbsolute);
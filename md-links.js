const fs = require('fs');
const path = require('path');
const marked = require('marked');
const FileHound = require('fileHound');
const chalk = require('chalk');


//ruta del archivo ingresada por el usuario
let pathToFile = process.argv[2];
//
const firstOption = process.argv[3];
const secondOption = process.argv[4];

pathToFile = path.resolve(pathToFile);
pathToFile = path.normalize(pathToFile);

const isFileOrDirectory = (path) => 
fs.lstat(path, (err, stats) => {
    if(err){
      if(err.code == 'ENOENT'){
        console.log(chalk.green("¡Pucha! Encontramos un error: \n - La ruta ingresada no es valida :("));
      }
    } else if (stats.isDirectory()){
      checkDirectory(path);
      console.log(`Is directory: ${stats.isDirectory()}`);
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
  readFile(file)
  .then(res => {
    res;
    console.log(res);
  })
  .catch(err => {
    console.log(err)
  })
  console.log(chalk.cyan("¡Yupi! El archivo es .md :)"));
} else{
  console.log (chalk.magenta('¡Oye! Encontramos un error: \n - El archivo ingresado no es de extensión .md \n -¡Suerte! :)'));
}
};

// const validate = (links) =>{
//   console.log("soy la funcion validate", links)
// }
const checkDirectory = (path) =>{
  FileHound.create()
  .paths(path)
  .ext('md')
  .find((err, files) => {
    if (files.length === 0) {
    //console.log(chalk.magenta("Mira, no hay ningún archivo .md en este directorio..."));
  }
})
.then(files =>{
  files.forEach(file => {
    readFile(file)
    .then(res => {
      res;
      console.log(res);
    })
    .catch(err => {
      console.log(err)
    })
  }); 
})
};

//con promesa
const readFile = (file) =>{
  return new Promise ( (resolve, reject) => {
    fs.readFile(file,'utf8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        let links = [];
        const renderer = new marked.Renderer();
        renderer.link = function (href, title, text){
          links.push({
            href:href,
            text:text,
            file:file
          })
        }
        marked(data,{renderer:renderer});
        resolve(links);
      }
    });
  })
};

const mdLinks = (path, options) => {
  if(options[0] === undefined && options[1] === undefined){
    isFileOrDirectory(path);
    console.log("nadinha")
  }else if (options[0] === "--stats" && options[1] === "--validate"){
    console.log("eligiste stats y validate")
  }else if (options[0] === "--validate" && options[1] === undefined){
    console.log("eligiste validar")
  }else if (options[0] ==="--stats" && options[1] === undefined){
    console.log("eligiste stats")
  }else{
    console.log(chalk.magenta("Humm...no entendí que quieres hacer... \n intenta con: \n --validate \n --stats \n --stats --validate"));
  }
}
mdLinks(pathToFile,[firstOption,secondOption]);
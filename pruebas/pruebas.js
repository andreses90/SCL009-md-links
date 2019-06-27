const fs = require('fs');
const path = require('path');
const marked = require('marked');
const FileHound = require('fileHound');
const chalk = require('chalk');


//ruta del archivo ingresada por el usuario
const pathToFile = process.argv[2];

//
const firstOption = process.argv[3];
const secondOption = process.argv[4];

//transforma la ruta en absoluta
let pathIntoAbsolute = path.resolve(pathToFile);
console.log("ruta abasoluta: ",pathIntoAbsolute)

const isFileOrDirectory = (path) => 
fs.lstat(path, (err, stats) => {
    if(err){
    if(err.code == 'ENOENT'){
      console.log(chalk.magenta("¡Pucha! Encontramos un error: \n - La ruta ingresada no es valida :("));
    }
    }else if (stats.isDirectory()){
      console.log(`Is directory: ${stats.isDirectory()}`);
      checkDirectory(path);
    } else {
      console.log(`Is file: ${stats.isFile()}`);
      isMdFile(path);
    }
});
isFileOrDirectory(pathIntoAbsolute);

//Función verifica si el file es de extensión .md
const isMdFile = (file) =>{
let ext = path.extname(file);
console.log(ext);
if (ext === ".md"){
readFile(file)
console.log(chalk.cyan("¡Yupi! El archivo es .md :)"));
} else{
console.log (chalk.magenta('¡Oye! Encontramos un error: \n - El archivo ingresado no es de extensión .md \n -¡Suerte! :)'));
}
};

const checkDirectory = (path) =>{
  FileHound.create()
  .paths(path)
  .ext('md')
  .find((err, files) => {
    if (files.length === 0) {
    console.log(chalk.magenta("Mira, no hay ningún archivo .md en este directorio..."));
    }
})
 .then(files =>{
files.forEach(file =>readFile(file)); 
}
)
};

const readFile =(path) => {
fs.readFile(path,'utf8', (err, data)=>{
if (err){
  throw err;
}
let links = [];
const renderer = new marked.Renderer();
renderer.link = function (href, title, text){
  links.push({
    href:href,
    text:text,
    file:path
  })
}
marked(data,{renderer:renderer});
console.log(chalk.yellow("Archivo: "), path, "\n", chalk.yellow("Links: "),"\n",links)
})
};



// const mdLinksExtractor = (data1, path1)=>{
// let links = [];
// const renderer = new marked.Renderer();
// renderer.link = function (href, title, text){
//   links.push({
//     href:href,
//     text:text,
//     file:path1
//   })
// }
// marked(data1,{renderer:renderer});
// console.log(links)
//   }
// const isFileOrDirectory = (path) => 
// fs.lstat(path, (err, stats) => {
//     if(err){
//       return console.log(err); //Handle error
//     } else {
//       console.log(`Is file: ${stats.isFile()}`);
//       console.log(`Is directory: ${stats.isDirectory()}`);
//     }
// });
// isFileOrDirectory(pathIntoAbsolute);


// readFile = (path) =>{
// fs.readFile(path,'utf8', (err, data)=>{
//   .then((data)=>{
    
//   }
//   )
// .catch((err)=>{
//   console.log(err)
// })
// ¿} else{
//   console.log(data);
//   return "data";
// }
// })
// };

// prueba = () =>{


//   return "data";

// };
//console.log(prueba());
//console.log(readFile(pathToFile));

// const mdLinks = (path)=>{
// let data = readFile(path)
// console.log(data);
// let links = [];
// const renderer = new marked.Renderer();
// renderer.link = function (href, title, text){
//   links.push({
//     href:href,
//     text:text,
//     file:path
//   })
// }
// marked(data,{renderer:renderer});
// console.log(links)
//   }
// console.log(mdLinks(pathToFile))


// console.log(readFile(pathToFile))

// const readDir = (path) =>{
//   FileHound.create()
//   .paths(path)
//   .ext('md')
//   .find()
//  .then(readDir =>{
// readDir.forEach(file =>
// console.log('Found file', file));
// })
// };
// console.log(readDir('../SCL009-md-links'))
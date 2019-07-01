#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const FileHound = require('fileHound');
const fetch = require('node-fetch');
const chalk = require('chalk');

const isFileOrDirectory = (path) => {
  return new Promise ( (resolve, reject) => {
fs.lstat(path, (err, stats) => {
    if(err){
      if(err.code == 'ENOENT'){
       reject(chalk.green("¡Pucha! Encontramos un error: La ruta ingresada no es valida :("));
      }
    } else if (stats.isDirectory()){
      checkDirectory(path)
      .then(res=>{
        resolve(res)
      })
      .catch(err => {
        reject(err)
  })
      //console.log(`Is directory: ${stats.isDirectory()}`);
    } else {
      //console.log(`Is file: ${stats.isFile()}`);
      isMdFile(path)
      .then(res=>{
        resolve(res)
      })
      .catch(err => {
        reject(err)
  })
    }
})
  })
};

//Función verifica si el file es de extensión .md
const isMdFile = (file) =>{
  return new Promise ( (resolve, reject) => {
    let myFile = [];
    let ext = path.extname(file);
    //console.log(ext);
    if (ext === ".md"){
      myFile.push(file)
      readFile(myFile)
      .then(res=>{
        resolve(res)
      })
      .catch(err => {
        reject(err)
  })
  //console.log(chalk.cyan("¡Yupi! El archivo es .md :)"));
} else{
  reject(chalk.magenta('¡Oye! Encontramos un error: \n - El archivo ingresado no es de extensión .md \n -¡Suerte! :)'));
}
  })
};

// const validate = (links) =>{
//   console.log("soy la funcion validate", links)
// }
const checkDirectory = (path) =>{
  return new Promise((resolve, reject) =>{
    FileHound.create()
    .paths(path)
    .ext('md')
    .find((err, files) => {
      if (files.length === 0) {
        (chalk.magenta("Mira, no hay ningún archivo .md en este directorio..."));
      }
    })
    .then(files =>{
      let myfiles =[];
      files.forEach(file => {
        myfiles.push(file)
      })
      readFile(myfiles)
        .then(res=>{
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  })
};

//con promesa
const readFile = (files) =>{
  return Promise.all(files.map(file => {
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
  }) )
};

const noOptions = (path) =>{
 return new Promise ( (resolve, reject) => {
   isFileOrDirectory(path)
   .then(res=>{
     resolve(res) 
    })
    .catch(err => {
      reject(err)
    })
  })
};
//(`${chalk.magenta("- Archivo: ")}${chalk.yellow(link.file)}${chalk.bold(link.text)}${chalk.green(link.href)}`)

// let linksToValidate = [ { href:
//   'https://carlosazaustre.com/manejando-la-asincronia-en-javascript/',
//  text:
//   'https://carlosazaustre.com/manejando-la-asincronia-en-javascript/',
//  file: 'C:\\SCL009-md-links\\mdpruebas\\r.md' },
// { href: 'https://docs.npmjs.com/getting-started/what-is-npm',
//  text: 'NPM',
//  file: 'C:\\SCL009-md-links\\mdpruebas\\r.md' } ];

const callValidate = (path) =>{
    return new Promise ( (resolve, reject) => {
      isFileOrDirectory(path)
      .then(res=>{
        validate(res)
        .then(res=>{
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
      })
      .catch(err => {
        reject(err)
      })
    })
  };


const validate = (links) => {
return Promise.all(links.map(link => {
  return Promise.all(link.map(link => {
  return new Promise((resolve, reject) =>{
    fetch(link.href)
    .then(res => {
      if (res.status===404) {
        link.status = res.status;
        link.response = "fail";
        resolve(link);
      } else {
        link.status = res.status;
        link.response = res.statusText;
        resolve(link); 
      }
    })
    .catch(err => {
      if(err){
      link.status = null;
      link.response = "fail"
      resolve(link);
    }
  })
  })
  }))
}))
};


const mdLinks = (path, options) => {
  return new Promise ( (resolve, reject) => {
    if(options[0] === undefined && options[1] === undefined){
      noOptions(path)
      .then(res=>{
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
      //console.log("nadinha")
    // }else if (options[0] === "--stats" && options[1] === "--validate"){
    //   resolve(console.log("eligiste stats y validate"))
    }else if (options[0] === "--validate" && options[1] === undefined){
      callValidate(path)
      .then(res=>{
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
    // }else if (options[0] ==="--stats" && options[1] === undefined){
    //   resolve(console.log("eligiste stats"))
    }else{
      reject(chalk.magenta("Humm...no entendí que quieres hacer... Intenta con: --validate"));
    }
  })
};

module.exports = mdLinks;

//\n --stats \n --stats --validate

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
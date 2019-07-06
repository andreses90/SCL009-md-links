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
        reject(`${chalk.green("¡Pucha! Encontramos un error: La ruta ingresada no es valida :(")}`);
      } else if (stats.isDirectory()){
        checkDirectory(path)
        .then(paths=>{
          Promise.all(paths.map((path)=>{
            return readFile(path);
          }))
          .then(res=>{
            let myLinks = [];
            res.forEach(array =>{ array.map(link => myLinks.push(link))
              resolve(myLinks)
            })
          })
        })
        .catch(err=>{
          reject(err)
        })
      }else {
        isMdFile(path)
        .then(links=>{
          resolve(links)
        })
        .catch(err=>{
          reject(err)
        })
      }
    })
  })
};

//Función verifica si el file es de extensión .md
const isMdFile = (file) =>{
  return new Promise ( (resolve, reject) => {
    let ext = path.extname(file);
    if (ext === ".md"){
      readFile(file)
      .then(res=>{
        resolve(res)
      })
    }else{
      reject(chalk.magenta('¡Oye! Encontramos un error:- El archivo ingresado no es de extensión .md ¡Suerte! :)'));
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
        reject(chalk.magenta("Mira, no hay ningún archivo .md en este directorio..."));
      }
    })
    .then(files =>{ 
      resolve(files)
    })
  })
};

const readFile = (file) =>{
  return new Promise ( (resolve, reject) => {
    fs.readFile(file,'utf8', (error, data) => {
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
    })
  });
};

const callValidate = (path,option) =>{
    return new Promise ( (resolve, reject) => {
      if(option === "--validate"){
        isFileOrDirectory(path)
        .then(links=>{
          validate(links)
          .then(res=>{
            resolve(res)
          })
          .catch(err=>{
            reject(err)
          })
        })
        .catch(err => {
          console.log("call err",err)
        })
      }else if (option === "--stats"){
        isFileOrDirectory(path)
        .then(links=>{
          validate(links)
          .then(res=>{
            stats(res)
          .then(res=>{
            resolve(res)
          })
          .catch(err=>{
            reject(err)
          })
          })
          .catch(err=>{
            reject(err)
          })
        })
        .catch(err => {
          console.log("call err",err)
        })
        .catch(err => {
          console.log("call err",err)
        })  
      }
      
    })
  };
const validate = (links) => {
return Promise.all(links.map(link => {
  return new Promise((resolve, reject) =>{
    fetch(link.href)
    .then(res => {
      if (res.status>400) {
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
};

const stats = (links) => {
    return new Promise((resolve,reject)=> {
      let allLinks = links.map(link=>link.href);
      let linksTotal = allLinks.length;
      let linksUnique = [...new Set(allLinks)].length
      let linksBroken = links.filter(link=>{ if(link.response==="fail"){
        return link.response
      } 
        });
        linksBroken = linksBroken.length;
        let result = {
          Total:linksTotal,
          Unique:linksUnique,
          Broken: linksBroken
        }
        resolve(result)
    })
}

const mdLinks = (path, options) => {
  return new Promise ((resolve, reject) => {
    if(options[0] === undefined && options[1] === undefined){
      isFileOrDirectory(path)
      .then(res=>{
        resolve(res)
      })
      .catch(err=> {
        reject(err)
      })
    }else if (options[0] === "--stats" && options[1] === "--validate"){
      callValidate(path,options[0])
      .then(res=>{
        resolve(res)
      })
      .catch(err=>{
        reject(err)
      })    }else if (options[0] === "--validate" && options[1] === undefined){
      callValidate(path,options[0])
      .then(res=>{
        resolve(res)
      })
      .catch(err=>{
        reject(err)
      })
    }else if (options[0] ==="--stats" && options[1] === undefined){
      callValidate(path,options[0])
      .then(res=>{
        resolve(res)
      })
      .catch(err=>{
        reject(err)
      })
    }else{
      reject(chalk.magenta("Humm...no entendí que quieres hacer... Intenta con: --validate"));
    }
  })
};

module.exports = mdLinks;

//con promesa
// const noOptions = (path) =>{
//   let myLinks = [];
//   console.log("siiiiiiii", path)
//   return new Promise ( (resolve, reject) => {
//     isFileOrDirectory(path)
//     .then(res=>{
//       console.log("noooo", res)
//       return Promise.all(
//         res.map(link=> {
//         console.log("EL LIKNK:", link);
//         myLinks.push((`- FILE: ${chalk.blue(link.file)}\n- TEXT: ${chalk.bold(link.text)} \n- HREF: ${chalk.green(link.href)}`));
//         console.log("todos los links2",myLinks)
//         resolve(myLinks)
//       }))
//     })
//   })
// };
// //(`${chalk.magenta("- Archivo: ")}${chalk.yellow(link.file)}${chalk.bold(link.text)}${chalk.green(link.href)}`)

// // let linksToValidate = [ { href:
// //   'https://carlosazaustre.com/manejando-la-asincronia-en-javascript/',
// //  text:
// //   'https://carlosazaustre.com/manejando-la-asincronia-en-javascript/',
// //  file: 'C:\\SCL009-md-links\\mdpruebas\\r.md' },
// // { href: 'https://docs.npmjs.com/getting-started/what-is-npm',
// //  text: 'NPM',
// //  file: 'C:\\SCL009-md-links\\mdpruebas\\r.md' } ];

// const callValidate = (path) =>{
//     return new Promise ( (resolve, reject) => {
//       isFileOrDirectory(path)
//       .then(res=>{
//         validate(res)
//         .then(res=>{
//           resolve(res)
//         })
//       })
//       .catch(err => {
//         reject(err)
//       })
//     })
//   };

// const validate = (links) => {
// return Promise.all(links.map(link => {
//   return Promise.all(link.map(link => {
//   return new Promise((resolve, reject) =>{
//     fetch(link.href)
//     .then(res => {
//       if (res.status>400) {
//         link.status = res.status;
//         link.response = "fail";
//         resolve(link);
//       } else {
//         link.status = res.status;
//         link.response = res.statusText;
//         resolve(link); 
//       }
//     })
//     .catch(err => {
//       if(err){
//       link.status = null;
//       link.response = "fail"
//       resolve(link);
//     }
//   })
//   })
//   }))
// }))
// };
// // res.map(el => el.href)
// // const callStats = (path) =>{
// //   callValidate(path)
// //   .then(res=> {
// //     console.log("res",res)
// //     return Promise.all(res.map(file=>{
// //         return new Promise((resolve, reject) =>{
// //           console.log("aaaaaaaaaaaa",file)
// //           stats(file)
// //           .then(res=>{
// //             resolve(res)
// //           })
// //           .catch(err=> {
// //             reject(err)
// //           })
// //         })
// //       }))
// //   })
// // };
//  const callStats = (path) => {
//    return new Promise((resolve,reject)=> {
//     callValidate(path)
//     .then(res=> {
//       beforeStats(res)
//       .then(res=> {
//         resolve(res)
//       })
//     }).catch(err=> {
//       reject(err)
//     })
//    })
//  };

// const beforeStats =(files)=>{
//   return Promise.all(files.map(file=>{
//     return Promise.all(file.map(link=>{
//       return new Promise((resolve,reject)=>{
//       stats(link.href)
//       .then(res=> {
//         resolve(res)
//       })
//       .catch(err=> {
//         reject(err)
//       })
//       })
//   }))
// }))
// };

// const stats = (links) => {
//     return new Promise((resolve,reject)=> {
//       console.log("stats1",links)
//       let allLinks = [links].length;
//       resolve(allLinks)
//       console.log("stats2",allLinks)
//     })
// }


// // const stats = (links) => {
// //   return new Promise((resolve,reject)=>{
// //     let myLinks = links.map(link=>link.href);
// //     let linksTotal = myLinks.length;
// //     console.log("statssss",linksTotal)
// //     resolve(linksTotal)
//     // let linksUnique = [new Set(allLinks)].length;
//     // let linksBroken = links.filter(link => {link.statusCode < 200 || link.statusCode > 400});
//     //   linksBroken=linksBroken.length;
//     //   resolve(`Links Unicos: ${linksUnique}, Links Totales: ${linksTotal}, Links Rotos: ${linksBroken}`)
// //   })
// //  }




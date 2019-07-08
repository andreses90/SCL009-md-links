#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const FileHound = require('fileHound');
const fetch = require('node-fetch');
const chalk = require('chalk');

const isFileOrDirectory = (path) => {
  return new Promise ((resolve, reject) => {
    fs.lstat(path, (err, stats) => {
      if (err) {
         reject(`${chalk.green("¡Pucha! Encontramos un error: La ruta ingresada no es valida :(")}`);
      } else if (stats.isDirectory()){
        checkDirectory(path)
        .then(paths => {
           Promise.all(paths.map(path => {
             return readFile(path);
            }))
            .then( res => {
              let myLinks = [];
              res.forEach(array => {array.map(link => myLinks.push(link));
                resolve(myLinks);
              });
            });
          })
          .catch(err => {
            reject(err);
          });
      } else {
        isMdFile(path)
        .then(links => {
          resolve(links)
        })
        .catch(err => {
          reject(err)
          });
      };
    });
  });
};

//Función verifica si el file es de extensión .md
const isMdFile = (file) => {
  return new Promise ((resolve, reject) => {
    let ext = path.extname(file);
    if (ext === ".md") {
      readFile(file)
      .then(res => {
        resolve(res);
      });
    } else {
      reject(chalk.magenta('¡Oye! Encontramos un error:- El archivo ingresado no es de extensión .md ¡Suerte! :)'));
    };
  });
};

const checkDirectory = (path) => {
  return new Promise((resolve, reject) => {
    FileHound.create()
    .paths(path)
    .ext('md')
    .find((err, files) => {
      if (files.length === 0) {
        reject(chalk.magenta("Mira, no hay ningún archivo .md en este directorio..."));
      }
    })
    .then(files => {
      resolve(files);
    });
  });
};

const readFile = (file) => {
  return new Promise ((resolve, reject) => {
    fs.readFile(file,'utf8', (error, data) => {
      let links = [];
      const renderer = new marked.Renderer();
      //https://github.com/markedjs/marked/issues/1279
      let linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;
      marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
      marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
      marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;
      renderer.link = function (href, title, text) {
        links.push({
          href:href,
          text:text,
          file:file
        });
      };
      renderer.image = function (href, title, text, line) {
        // Remove image size at the end, e.g. ' =20%x50'
        href = href.replace(/ =\d*%?x\d*%?$/, "");
        links.push({
          href:href,
          text:text,
          file:file
        });
      };
      marked(data,{renderer:renderer});
      resolve(links);   
    });
  });
};

const validate = (links) => {
  return Promise.all(links.map(link => {
    return new Promise((resolve, reject) => {
      fetch(link.href)
      .then(res => {
        if (res.status > 400) {
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
        if (err){
          link.status = null;
          link.response = "fail"
          resolve(link);
        };
      });
    });
  }));
};

const stats = (links) => {
  return new Promise((resolve,reject) => {
    let allLinks = links.map(link => link.href);
    let linksTotal = allLinks.length;
    let linksUnique = [...new Set(allLinks)].length
    let linksBroken = [];
    links.filter(link => { 
      if (link.response === "fail"){
        linksBroken.push(link.response)
      };
    });
    linksBroken = linksBroken.length;
    let result = {
      Total:linksTotal,
      Unique:linksUnique,
      Broken: linksBroken
    };
    resolve(result);
  });
};

const mdLinks = (path, options) => {
  return new Promise ((resolve, reject) => {
    if (options[0] === undefined && options[1] === undefined) {
      isFileOrDirectory(path)
      .then(links => {
        let result = "";
        links.forEach(link => {
         result += (chalk.bgMagenta("- FILE:")+chalk.magenta(link.file)+"\n"+chalk.magenta("- TEXT:")+chalk.bold(link.text)+"\n"+chalk.magenta("- HREF:")+chalk.bold(link.href)+"\n")
        });
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
    } else if (options[0] === "--stats" && options[1] === "--validate") {
      isFileOrDirectory(path)
      .then(links => {
        validate(links)
        .then(res => {
          stats(res)
          .then(links => {
            let result =  (chalk.bgMagenta("Total :")+" "+chalk.white(links.Total)+"\n"+chalk.bgCyan("Unique:")+" "+chalk.white(links.Unique)+"\n"+chalk.bgRed("Broken:")+" "+chalk.white(links.Broken));
            resolve(result);
          });
        });
      });  
    } else if (options[0] === "--validate" && options[1] === undefined) {
      isFileOrDirectory(path)
      .then(links => {
        validate(links)
        .then(links => {
          let result = "";
          links.forEach(link => {
            if (link.response === "OK") {
              result += (chalk.magenta(link.file)+" "+chalk.bold(link.text)+" "+chalk.white(link.href)+" "+chalk.bgGreen(link.status)+" "+chalk.bgGreen(link.response)+"\n")
           } else if (link.response === "fail") {
             result += (chalk.magenta(link.file)+" "+chalk.bold(link.text)+" "+chalk.white(link.href)+" "+chalk.bgRed(link.status)+" "+chalk.bgRed(link.response)+"\n")
           };
          });
          resolve(result);
        });
      });
    } else if (options[0] ==="--stats" && options[1] === undefined) {
      isFileOrDirectory(path)
      .then(links => {
        validate(links)
        .then(res => {
          stats(res)
          .then(links => {
            let result = (chalk.bgMagenta("Total :")+" "+chalk.white(links.Total)+"\n"+chalk.bgCyan("Unique:")+" "+chalk.white(links.Unique));
            resolve(result);
          });
        });
      });  
    }else {
      reject(chalk.magenta("Humm...no entendí que quieres hacer... Intenta con:\n --validate\n --stats\n --stats --validate"));
   }; 
  });
};

module.exports = mdLinks;
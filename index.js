const mdLinks = require('./md-links');
const path = require('path');

//ruta del archivo ingresada por el usuario
let pathToFile = process.argv[2];
const firstOption = process.argv[3];
const secondOption = process.argv[4];

pathToFile = path.resolve(pathToFile);
pathToFile = path.normalize(pathToFile);


mdLinks(pathToFile,[firstOption,secondOption]);

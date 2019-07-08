const mdLinks = require('../md-links.js');

//rutas para testeo
let filePath = 'C:\\SCL009-md-links\\test\\dir-tests\\hola.md';
let dirPath = 'C:\\SCL009-md-links\\test\\dir-tests';
let fileErr = 'C:\\SCL009-md-links\\test\\dir-tests\\chao.md';
let fileJS = 'C:\\SCL009-md-links\\test\\dir-js\\p.js';
let dirJS = 'C:\\SCL009-md-links\\test\\dir-js';
let option1 = undefined;
let option2 = undefined;

describe('mdLinks', () => {
  it('debería ser una función', () => {
    expect(typeof (mdLinks)).toBe('function');
  });

  //Resolve
  it('debería retornar los links encontrados en una ruta de un Archivo de extensión .md', () => {
    expect.assertions(1);
    return mdLinks(filePath,[option1,option2]).then(res => expect(res).toEqual(
      [ { href:
        'https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback',
       text: 'Leer un directorio',
       file: 'C:\\SCL009-md-links\\test\\dir-tests\\hola.md' },
     { href: 'https://nodejs.org/api/path.html',
       text: 'Path',
       file: 'C:\\SCL009-md-links\\test\\dir-tests\\hola.md' } ] 
    ));
  });

  it('debería retornar los links para cada archivo de extensión .md encontrado en una ruta de un Directorio', () => {
    expect.assertions(1);
    return mdLinks(dirPath,[option1,option2]).then(res => expect(res).toEqual(
      [ { href: 'https://docs.npmmmmjs.com/getting-started/what-is-npm',
    text: 'NPM',
    file: 'C:\\SCL009-md-links\\test\\dir-tests\\chao.md' },
  { href: 'https://nodejs.org/api/paths.html',
    text: 'NPM',
    file: 'C:\\SCL009-md-links\\test\\dir-tests\\chao.md' },
  { href:
     'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
    text: 'md-links',
    file: 'C:\\SCL009-md-links\\test\\dir-tests\\chao.md' },
  { href:
     'https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback',
    text: 'Leer un directorio',
    file: 'C:\\SCL009-md-links\\test\\dir-tests\\hola.md' },
  { href: 'https://nodejs.org/api/path.html',
    text: 'Path',
    file: 'C:\\SCL009-md-links\\test\\dir-tests\\hola.md' } ]
    ));
  });

  it('debería retornar los links encontrados del archivo de extensión .md y validarlos con "OK" o "Fail"', () => {
    expect.assertions(1);
    return mdLinks(filePath,["--validate",option2]).then(res => expect(res).toEqual(
       [ { href:
        'https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback',
       text: 'Leer un directorio',
       file: 'C:\\SCL009-md-links\\test\\dir-tests\\hola.md',
       status: 200,
       response: 'OK' },
     { href: 'https://nodejs.org/api/path.html',
       text: 'Path',
       file: 'C:\\SCL009-md-links\\test\\dir-tests\\hola.md',
       status: 200,
       response: 'OK' } ] 
    ));
  });

  it('debería retornar los links encontrados de los archivos de extensión .md encontrados en un directorio y validarlos con "OK" o "Fail"', () => {
    expect.assertions(1);
    return mdLinks(dirPath,["--validate",option2]).then(res => expect(res).toEqual(
      [ { href: 'https://docs.npmmmmjs.com/getting-started/what-is-npm',
    text: 'NPM',
    file: 'C:\\SCL009-md-links\\test\\dir-tests\\chao.md',
    status: null,
    response: 'fail' },
  { href: 'https://nodejs.org/api/paths.html',
    text: 'NPM',
    file: 'C:\\SCL009-md-links\\test\\dir-tests\\chao.md',
    status: 404,
    response: 'fail' },
  { href:
     'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
    text: 'md-links',
    file: 'C:\\SCL009-md-links\\test\\dir-tests\\chao.md',
    status: 200,
    response: 'OK' },
  { href:
     'https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback',
    text: 'Leer un directorio',
    file: 'C:\\SCL009-md-links\\test\\dir-tests\\hola.md',
    status: 200,
    response: 'OK' },
  { href: 'https://nodejs.org/api/path.html',
    text: 'Path',
    file: 'C:\\SCL009-md-links\\test\\dir-tests\\hola.md',
    status: 200,
    response: 'OK' } ]
    ));
  });

  it('debería retornar la estadística del total de links y links únicos', () => {
    expect.assertions(1);
    return mdLinks(fileErr,["--stats",option2]).then(res => expect(res).toEqual(
      { Total: 3, Unique: 3, Broken: 2 }
    ));
  });

  it('debería retornar la estadística del total de links, del total de links únicos y del total de links rotos', () => {
    expect.assertions(1);
    return mdLinks(filePath,["--stats","--validate"]).then(res => expect(res).toEqual(
      { Total: 2, Unique: 2, Broken: 0 }
    ));
  });

  //Reject
  test('debería retornar un mensaje de error para un Archivo que no sea de extensión .md', () => {
    return expect(mdLinks(fileJS,[option1,option2])).rejects.toMatch('¡Oye! Encontramos un error:- El archivo ingresado no es de extensión .md ¡Suerte! :)');
  }); 

  test('debería retornar un reject para una opción no valida', () => {
    return expect(mdLinks(dirJS,[option1,option2])).rejects.toMatch('Mira, no hay ningún archivo .md en este directorio...');
  });

  test('debería retornar un mensaje de error para un ruta no valida', () => {
    return expect(mdLinks("fileErr",[option1,option2])).rejects.toMatch('¡Pucha! Encontramos un error: La ruta ingresada no es valida :(');
  });

  test('debería retornar un mensaje de error para una opción no valida', () => {
    return expect(mdLinks(filePath,["option1",option2])).rejects.toMatch('Humm...no entendí que quieres hacer... Intenta con:\n --validate\n --stats\n --stats --validate');
  });
  
 }) ;

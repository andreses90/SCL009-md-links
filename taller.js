const fs = require('fs');
// let myPromise = Promise.resolve("Hola taller");

// myPromise
// .then(res => {
//     console.log(res)
// });

// let myOtherPromise = new Promise ((resolve, reject) =>{
//     setTimeout(()=> resolve (5), 2000)
// });

// myOtherPromise
// .then(res => {
//     res += 5;
//     console.log(res),
// });



// const getData = (url) => {
//     return new Promise ((resolve, reject)=> {
//         fetchUrl (url, (error, meta, body) =>{
//             if (meta){
//                 console.log(meta);
//                 resolve(meta.status);
//             }else{
//                 reject (error);
//             }
//         })
//     })
// } 

// let url = "https://www.google.com";
// getData(url)
// .then(res => {
//     console.log("El estado del sitio", url, "es:",res)
// })
// .catch(err => {
//     console.log(err);
// })

const readAFile = (fileName, type) =>{
    return new Promise ( (resolve, reject) => {
        fs.readFile(fileName,type, (error, content) => {
            //err ? reject(error) : resolve(content);
            if (error) {
                reject(error);
            } else {
                resolve(content);
            }
        })
    });
};
readAFile("hola.txt","utf-8")
.then(res => {
    console.log("tu archivo dice: ", res);
})
.catch(err => {
    console.log(err)
})

Promise.all([myPromise, readAFile("hola.txt", "utf-8"), getData(url), myOtherPromise])
.then(res => {
console.log(res);
})
.catch(err => {
console.log(err);
}); 


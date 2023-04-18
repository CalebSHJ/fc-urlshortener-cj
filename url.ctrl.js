"use stric"

const fs = require('fs').promises

class UrlStorage {

  static #getUrlInfo(data, short_url) {
    const urls = JSON.parse(data);
    // console.log(urls);
    const idx = urls.short_url.indexOf(short_url);
    if(idx < 0) {
      return "error"
    }
    return urls.original_url[idx];
  } 

  static #getUsers(data, isALL, fields) {
    const urls = JSON.parse(data);
    if (isALL) return urls;
    const newUrls = fields.reduce((newUrls, field) => {
      if(urls.hasOwnProperty(field)) {
        newUrls[field] = urls[field];
      }
      return newUrls;
    }, {}) 
    return newUrls; 
  }
  //isALL을 사용해서 모든 field값을 가져온다. 
  static getUsers(isALL, ...fields) {
    return fs.readFile("./data.json")
      .then((data) => {
        return this.#getUsers(data, isALL, fields);
      })
      .catch((err) => console.error(err)); 
    // const users = this.#users;
  
  }

 static getUrlInfo(short_url) {
  return fs.readFile("./data.json")
          .then((data) => {
          return this.#getUrlInfo(data, short_url);
          })
 }

  static async save(urlInfo) {
    const urls = await this.getUsers(true);
    console.log(urlInfo);

    if(urlInfo.includes('http://') || urlInfo.includes('https://')){
      if(urls.original_url.includes(urlInfo)) {
        throw "the url that exists"
      }
      urls.original_url.push(urlInfo);
      urls.short_url.push(urls.original_url.length);
      fs.writeFile("./data.json", JSON.stringify(urls));
      return { original_url: urlInfo, short_url: urls.original_url.length}
    } else{
      return { error: 'invalid url' }
    }
  }

}

module.exports = UrlStorage;
export class HttpService {

    static apiUrl = 'http://localhost:8888/api/';

    static buildUrl(url: string, parameters: Object){
        var qs = "";
        for(var key in parameters) {
            var value = parameters[key];
            qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
        }
        if (qs.length > 0){
            qs = qs.substring(0, qs.length-1); //chop off last "&"
            url = url + "?" + qs;
        }
        return url;
    }

    static request(type: string, path: string, data?: Object) {
        return new Promise(function(resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if(this.status == 200) resolve(JSON.parse(this.response));
                    else reject(this.response);
                }
            };
            xhttp.open(type, path, true);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(data);
        })
    }

    static save(constructor: Function, collection: String, document: Object) {
        var body = JSON.stringify(document);
        return this.request('POST', this.apiUrl+collection, body)
    }

    static delete(constructor: Function,  collection: String, document: Object) {
        return this.request('DELETE', this.apiUrl+collection+document['_id'])
    }

    static find(constructor: Function,  collection: String, document: Object) {
        return new Promise((resolve, reject) => {
            var body = JSON.stringify(document);
            return this.request('GET', this.apiUrl+collection).then(function(data) {
                resolve(data.map((item) => {return new constructor(item)}));
            }).catch(function(err) {
                reject(err);
            })
        })
    }

    static findOne(constructor: Function,  collection: String, document: Object) {
        return new Promise((resolve, reject) => {
            var body = JSON.stringify(document);
            return this.request('GET', this.buildUrl(this.apiUrl+collection+'/findOne', document)).then(function(data) {
                resolve(new constructor(data));
            }).catch(function(err) {
                reject(err);
            })
        });
    }

}
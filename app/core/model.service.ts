import {HttpService} from './http.service';

export class ModelService {

    private url;
    private db;
    public ObjectId;
    public service;

    constructor() {
        if(typeof window === "undefined") {
            var dep = "./mongo.service";
            var MongoService = require(dep);
            this.service = new MongoService();
        } else {
            this.service = HttpService;
        }
    }
    save(constructor, collection, document) {
        return this.service.save(constructor, collection, document);
    }
    delete(constructor, collection, document) {
        return this.service.delete(constructor, collection, document);
    }
    findOne(constructor, collection, document) {
        return this.service.findOne(constructor, collection, document);
    }
    find(constructor, collection, document) {
        return this.service.find(constructor, collection, document);
    }
}
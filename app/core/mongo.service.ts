import { MongoClient, ObjectID } from 'mongodb';

export class MongoService {

    private url;
    private db;

    constructor() {
        this.url = 'mongodb://localhost:27017/test';
        console.log('connecting to mongo');
        MongoClient.connect(this.url, (err, db) => {
            // Use the admin database for the operation
            console.log('connection established');
            this.db = db;
        });
    }

    save(constructor: Function, collection: String, document: Object) {
        return this.db.collection(collection).save(document);
    }

    delete(constructor: Function, collection: String, document: Object) {
        return this.db.collection(collection).deleteOne({ _id: document['_id'] });
    }

    find(constructor: Function, collection: String, document: Object) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).findOne(document).toArray(function(err, items) {
                if(err) reject(err);
                else resolve(items.map((item) => {return new constructor(item)}));
            });
        })
       
    }

    findOne(constructor: Function, collection: String, document: Object) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).find(document).then(function(err, item) {
                if(err) reject(err);
                else resolve(new constructor(item));
            });
        })
    }

}
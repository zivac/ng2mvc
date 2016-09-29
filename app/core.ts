import { ModelService } from './core/model.service';

var modelService = new ModelService();

export function Model(constructor: Function, test) {

    var newConstructor = function(init) {
        var object = new constructor();
        var id;
        if(typeof init === "object") {
            for(var key in init) {
                if(key === "_id" || key === "id") id = init[key];
                else object[key] = init[key];
            }
        } else if(typeof init === "string" || typeof init === "number") {
            id = init;
        }
        if(id) {
            if(typeof window === "undefined")  object._id = modelService.ObjectId(id);
            else object._id = id;
        }
        return object;
    }

    //instance functions
    constructor.prototype.save = function() {
        return modelService.save(newConstructor, constructor.name, this);
    }

    constructor.prototype.delete = function() {
        return modelService.delete(newConstructor, constructor.name, this);
    }

    //static functions
    newConstructor['find'] = function(document) {
        return modelService.find(newConstructor, constructor.name, document);
    }

    newConstructor['findOne'] = function(document) {
        return modelService.findOne(newConstructor, constructor.name, document);
    }

    return newConstructor;

}

export function Controller(properties: Object) {

    

}
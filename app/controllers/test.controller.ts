import {Controller} from '../core';
import {Person} from '../models/person';

@Controller
export class TestController {

    hello(name: string) {
        return {test: name};
    }

    kill(name: string) {
        return Person.findOne({name: name}).then((person) => {
            console.log(person);
            person.alive = false;
            person.save();
            return person;
        })
    }

}
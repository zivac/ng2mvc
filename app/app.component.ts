import { Component } from '@angular/core';
import { Person } from './models/person';
import { TestController } from './controllers/test.controller';

@Component({
  selector: 'my-app',
  template: '<h1>My First Angular App</h1>'
})
export class AppComponent {
  constructor() {
    window['Person'] = Person;
    window['TestController'] = TestController;
  }
}

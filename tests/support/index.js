const { test: base, expect } = require('@playwright/test');

import { Leads } from './actions/Leads'; 
import { Login } from './actions/Login';
import { Movies } from './actions/Movies';
import { Popup } from './actions/Components';
import { Series } from './actions/Series';
import { Api } from './api';

const test = base.extend({
    page: async ({ page}, use) => {
        const context = page;
        
        context ['leads'] = new Leads(page);
        context ['login'] = new Login(page);
        context ['movies'] = new Movies(page);
        context ['popup'] = new Popup(page);
        context ['series'] = new Series(page);
        
        await use(context);
    },
    request: async({request}, use) => {
        const context = request;
        context['api'] = new Api(request);
        await use(context);
    }
});

export { test, expect };
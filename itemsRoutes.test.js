const request = require('supertest');
const app = require('./app');
let items = require('./fakeDb');

beforeEach(() => {
    item1 = {'name': 'widget', 'price': 1.99};
    item2 = {'name': 'wadget', 'price': 2.56};

    items.push(item1);
    items.push(item2);
})

afterEach(() => {
    items.length = 0;
})

describe('GET /items', () => {
    test('Returns an array of item objects', async () => {
        const response = await request(app).get('/items');
        expect(response.statusCode).toEqual(200);
        expect (response.body).toEqual(items);
    })
})

describe('POST /items', () => {
    test('Creates a new item', async () => {
        const response = await request(app)
                                    .post('/items')
                                    .send({'name': 'new item', 'price': 1.37});
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({'added': {'name': 'new item', 'price':1.37}});
    })
})

describe('GET /items/:name', () => {
    test('Returns the item object from fakeDb with the specified name.', async () => {
        const response = await request(app).get('/items/widget');
        expect(response.body.item).toEqual({'name': 'widget', 'price': 1.99});
    })

    test('Returns 404 Not Found when requested item does not exist.', async () => {
        const response = await request(app).get('/items/ham-sandwhich');
        expect(response.statusCode).toEqual(404);
    })
})

describe('PATCH /items/:name', () => {
    test('Updates existing item', async () => {
        const response = await request(app)
                                    .patch('/items/widget')
                                    .send({'name': 'updated name'});
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({'updated': {'name': 'updated name', 'price': 1.99}});
    })

    test('Returns 404 Not Found when requested item does not exist.', async () => {
        const response = await request(app)
                                    .patch('/items/frank')
                                    .send({'name': 'updated name'});
        expect(response.statusCode).toEqual(404);
    })
})

describe('DELETE /items/:name', () => {
    test('Deletes specified item', async () => {
        const response = await request(app).delete('/items/widget');
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({'message': 'Deleted'});
        expect(items.find(({name, price}) => name === 'widget')).toBeFalsy();
    })

    test('Returns 404 Not Found when requested item does not exist.', async () => {
        const response = await request(app).delete('/items/ham-sandwhich');
        expect(response.statusCode).toEqual(404);
    })
})
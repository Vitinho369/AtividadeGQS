const request = require('supertest');
const app = require('./api'); 
const DataBase = require("./dataBase");

describe('Products API', () => {
    let dataBase;

    beforeAll(async () => {
        dataBase = new DataBase();
        app.locals.dataBase = dataBase;
    });

    afterAll(async () => {
        dataBase.db.run("DROP TABLE Product");
    });

    test('POST /products: Criar um novo produto.', async () => {
        const newProduct = { name: 'Tomate', price: 2, category: 'fruta' };

        const response = await request(app).post('/products').send(newProduct);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newProduct);
    });

    test('GET /products: Listar todos os produtos.', async () => {
        const newProduct = { name: 'Goiaba', price: 1, category: 'fruta' };

        await request(app).post('/products').send(newProduct);

        const response = await request(app).get('/products'); 
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: 1, name: 'Tomate', price: 2, category: 'fruta' },
            { id: 2, name: 'Goiaba', price: 1, category: 'fruta' }
        ]);
    });

    test('GET /products/:id: Obter um produto específico por ID.', async () => {

        const response = await request(app).get('/products/1');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1, 
            name: 'Tomate',
            price: 2,
            category: 'fruta'
        });
    });

    test('PUT /products/:id: Atualizar um produto existente por ID.', async () => {
        const productUpdated = { name: 'Tomate vermelho', price: 5, category: 'fruta' };

        const response = await request(app).put('/products/1').send(productUpdated);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            name: 'Tomate vermelho',
            price: 5,
            category: 'fruta'
        });
    });

    test('DELETE /products/:id: Deve deletar um produto por ID.', async () => {

        const response = await request(app).delete('/products/1'); 

        expect(response.status).toBe(204);

        const checkResponse = await request(app).get('/products/1');

        expect(checkResponse.status).toBe(404);
    });
});

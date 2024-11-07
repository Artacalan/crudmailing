import request from 'supertest';
import { app } from './index';

describe('Product API Tests', () => {
    let productId: number;

    it('should create a new product', async () => {
        const newProduct = {
            title: "Test Product",
            description: "This is a test product description",
        };

        const response = await request(app).post('/product/add').send(newProduct);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(newProduct.title);  // Directly accessing title
        expect(response.body.description).toBe(newProduct.description);

        productId = response.body.id;  // Save the ID for future tests
    });


    it('should get all products', async () => {
        const response = await request(app).get('/allProducts');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get a product by ID', async () => {
        const response = await request(app).get(`/product/${productId}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(productId);
    });

    it('should update an existing product', async () => {
        const updatedProduct = {
            id: productId,
            title: "Updated Test Product",
            description: "Updated test product description",
        };

        const response = await request(app)
            .post('/product/update')
            .send(updatedProduct);
        expect(response.status).toBe(200);

        const updatedResponse = await request(app).get(`/product/${productId}`);
        expect(updatedResponse.status).toBe(200);
        expect(updatedResponse.body.title).toBe(updatedProduct.title);
        expect(updatedResponse.body.description).toBe(updatedProduct.description);
    });

    it('should delete a product', async () => {
        const deleteResponse = await request(app).post('/product/delete').send({ id: productId });
        expect(deleteResponse.status).toBe(200);

        // Check if the product is really deleted
        const getResponse = await request(app).get(`/product/${productId}`);
        expect(getResponse.status).toBe(404);  // Expecting a 404 since the product should no longer exist
    });
});

const express = require("express");
const Product = require("./Models");
const DataBase = require("./dataBase");
const app = express();
const port = 3000;
const dataBase = new DataBase();

app.use(express.json());

app.post("/products", (req, res) => {
    let newProduct = new Product(req.body.name, req.body.price, req.body.category);
    dataBase.addProduct(newProduct);
    res.status(201).json(newProduct);
});

app.get("/products", (req, res) => {
    dataBase.getAllProducts((err, products) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao recuperar produtos" });
        }
        res.status(200).json(products);
    });
});

app.put("/products/:id", (req, res) => {
    let productUpdated = new Product(req.body.name, req.body.price, req.body.category);
    dataBase.updateProduct(req.params.id, productUpdated, (err) => {
        if (err) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }
        res.status(200).json(productUpdated);
    });
});

app.get("/products/:id", (req, res) => {
    dataBase.getProduct(req.params.id, (err, product) => {
        if (err) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }
        res.status(200).json(product);
    });
});

app.delete("/products/:id", (req, res) => {
    dataBase.deleteProduct(req.params.id, (err) => {
        if (err) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }
        res.status(204).send(); 
    });
});

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
});

module.exports = app;

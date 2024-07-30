const sqlite3 = require("sqlite3");
const path = require("path");

class DataBase {
    constructor() {
        this.dbPath = path.resolve(__dirname, './dataBase/database.db');
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error("Não foi possível conectar ao banco de dados", err);
            } else {
                console.log("Conectado ao banco de dados SQLite.");

                this.db.run(`CREATE TABLE IF NOT EXISTS Product (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        price REAL NOT NULL,
                        category TEXT NOT NULL
                )`, (err) => {
                    if (err) {
                        console.error('Erro ao criar tabela:', err.message);
                    }
                });
            }
        });
    }

    addProduct(product) {
        const sql = "INSERT INTO Product (name, price, category) VALUES (?, ?, ?)";
        this.db.run(sql, [product.name, product.price, product.category], function(err) {
            if (err) {
                console.error("Erro ao inserir produto", err);
            }
        });
    }

    getProduct(id, callback) {
        const sql = "SELECT * FROM Product WHERE id = ?";
        this.db.get(sql, [id], (err, row) => {
            if (err) {
                console.error("Erro ao recuperar produto", err);
                callback(err, null);
            } else if (row) {
                callback(null, row);
            } else {
                callback(new Error('Produto não encontrado'), null);
            }
        });
    }

    getAllProducts(callback) { // Adicione o callback aqui
        const sql = "SELECT * FROM Product";
        this.db.all(sql, [], (err, rows) => { // Usar db.all para obter todas as linhas
            if (err) {
                console.error("Erro ao recuperar todos os produtos", err);
                callback(err, null);
            } else {
                callback(null, rows); // Retorna todas as linhas
            }
        });
    }

    updateProduct(id, product, callback) {
        const { name, price, category } = product;
        const sql = "UPDATE Product SET name = ?, price = ?, category = ? WHERE id = ?";
        this.db.run(sql, [name, price, category, id], function(err) {
            if (err) {
                console.error("Erro ao atualizar produto", err);
                callback(err);
            } else {
                callback(null);
            }
        });
    }

    deleteProduct(id, callback) {
        const sql = "DELETE FROM Product WHERE id = ?";
        this.db.run(sql, [id], function(err) {
            if (err) {
                console.error("Erro ao deletar produto", err);
                callback(err);
            } else {
                callback(null);
            }
        });
    }
}

module.exports = DataBase;

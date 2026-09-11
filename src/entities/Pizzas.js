// entities/Pizzas.js
const db = require('../config/database');

class Pizzas {
    static create({ name, price, imageUrl, dailyLimit }) {
        const sql = `INSERT INTO pizzas (name, price, image_url, daily_limit)
                     VALUES (?, ?, ?, ?)`;
        const params = [name, price, imageUrl || null, dailyLimit || null];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                // fetch created row
                Pizzas.findById(this.lastID).then(resolve).catch(reject);
            });
        });
    }

    static findAll() {
        const sql = `SELECT * FROM pizzas ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static findById(id) {
        const sql = `SELECT * FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    static update(id, { name, price, imageUrl, dailyLimit }) {
        const sql = `
            UPDATE pizzas
            SET name = COALESCE(?, name),
                price = COALESCE(?, price),
                image_url = COALESCE(?, image_url),
                daily_limit = COALESCE(?, daily_limit)
            WHERE id = ?
        `;
        const params = [name, price, imageUrl, dailyLimit, id];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                Pizzas.findById(id).then(resolve).catch(reject);
            });
        });
    }

    static delete(id) {
        const sql = `DELETE FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // number of rows deleted
            });
        });
    }
}

module.exports = Pizzas;

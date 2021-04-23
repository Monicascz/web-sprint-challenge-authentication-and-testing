const db = require('../../data/dbConfig.js');

function findAll() {
    return db('users');
}

function findBy(filter) {
    return db("users").where(filter);
}

async function insert(newUser) {
    const [id] = await db("users").insert(newUser);
    return findById(id);
}

function findById(id) {
    return db("users")
        .where({ id }).first();
}



module.exports = {
    findAll,
    insert,
    findBy
};
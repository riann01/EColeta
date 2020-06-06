import knex from 'knex';

const connection = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'postgres',
        database : 'ECOLETA'
    }
});

export default connection;
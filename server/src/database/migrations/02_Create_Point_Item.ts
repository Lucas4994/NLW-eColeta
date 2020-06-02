import Knex from 'knex';


export async function up(knex:Knex) {
    //criar a tabela de relacionamento entre os pontos de coleta e os items de coleta
   return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();

        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('points');

        table.string('item_id')
            .notNullable()
            .references('id')
            .inTable('items');
    });
}

export async function down(knex : Knex) {
    //voltar a tabela(Deletar)
    return knex.schema.dropTable('point_items');
}
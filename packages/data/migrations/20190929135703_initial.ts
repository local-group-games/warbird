import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable("player", table => {
    table.string("id");
    table
      .foreign("vehicleId")
      .references("id")
      .inTable("vehicle");
    table.string("name", 20);
    table.boolean("connected");
  });
  await knex.schema.createTable("room", table => {
    table.increments("id");
  });
  await knex.schema.createTable("componentType", table => {
    table.increments("id");
  });
  await knex.schema.createTable("component", table => {
    table.increments("id");
    table
      .foreign("componentTypeId")
      .references("id")
      .inTable("componentType");
  });
  await knex.schema.createTable("weapon", table => {
    table
      .foreign("arsenalId")
      .references("id")
      .inTable("arsenal");
  });
  await knex.schema.createTable("arsenal", table => {
    table.increments("id");
    table
      .foreign("componentId")
      .references("id")
      .inTable("component");
  });
  await knex.schema.createTable("capacitor", table => {
    table.increments("id");
    table
      .foreign("componentId")
      .references("id")
      .inTable("component");
    table.integer("energy");
    table.integer("energyPerS");
  });
  await knex.schema.createTable("destructible", table => {
    table.increments("id");
    table
      .foreign("componentId")
      .references("id")
      .inTable("component");
    table.integer("health");
    table.boolean("invulnerable");
  });
  await knex.schema.createTable("expireable", table => {
    table.increments("id");
    table
      .foreign("componentId")
      .references("id")
      .inTable("component");

    table.integer("createdTimeMs");
    table.integer("lifeTimeMs");
  });
  await knex.schema.createTable("physical", table => {
    table.increments("id");
    table
      .foreign("componentId")
      .references("id")
      .inTable("component");

    table.float("x");
    table.float("y");
    table.float("angle");
    table.float("velocityX");
    table.float("velocityY");
    table.integer("width");
    table.integer("height");
    table.float("mass");
    table.float("angularVelocity");
    table.float("angularDamping");
    table.float("damping");
    table.boolean("fixedRotation");
    table.integer("collisionGroup");
    table.integer("collisionMask");
    table.boolean("sensor");
  });
  await knex.schema.createTable("vehicle", table => {
    table.increments("id");
    table
      .foreign("componentId")
      .references("id")
      .inTable("component");
  });
  await knex.schema.createTable("entity", table => {
    table.increments("id");
    table
      .integer("roomId")
      .references("id")
      .inTable("rooms")
      .onDelete("cascade");
  });
  await knex.schema.createTable("entityComponent", table => {
    table
      .foreign("entityId")
      .references("id")
      .inTable("entity");
    table
      .foreign("componentId")
      .references("id")
      .inTable("component");
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("player");
  await knex.schema.dropTable("room");
  await knex.schema.dropTable("componentType");
  await knex.schema.dropTable("component");
  await knex.schema.dropTable("weapon");
  await knex.schema.dropTable("arsenal");
  await knex.schema.dropTable("capacitor");
  await knex.schema.dropTable("destructible");
  await knex.schema.dropTable("expireable");
  await knex.schema.dropTable("physical");
  await knex.schema.dropTable("vehicle");
  await knex.schema.dropTable("entity");
  await knex.schema.dropTable("entityComponent");
}

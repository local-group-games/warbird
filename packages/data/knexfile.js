module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "warbird",
      user: "warbird",
      password: "warbird",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "warbird",
      user: "warbird",
      password: "warbird",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "warbird",
      user: "warbird",
      password: "warbird",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

'use strict';

module.exports = {
  test: {
    // database
    dialect: 'sqlite',
    storage: ':memory:',
    ldap_enable: false,
    // adding another auth system
    ldap_url: '',
    // sessions
    redis_host: 'redis',
    redis_port: 6379,
    redis_client: 'client',
    redis_user: 'PLOP',
    redis_password: '123456',
    redis_ttl: 260,
  },
  development: {
    // database
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    timezone: 'Europe/Paris',
    // adding another auth system
    ldap_enable: false,
    ldap_url: '',
    // sessions
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_user: process.env.REDIS_USER,
    redis_paswword: process.env.REDIS_PASSWORD,
    redis_ttl: 260,
  },
  staging: {
    // database
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    timezone: 'Europe/Paris',
    // adding another auth system
    ldap_enable: false,
    ldap_url: '',
    // sessions
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_user: process.env.REDIS_USER,
    redis_paswword: process.env.REDIS_PASSWORD,
    redis_ttl: 260,
  },
  production: {
    // database
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
    timezone: 'Europe/Paris',
    // adding another auth system
    ldap_enable: false,
    ldap_url: process.env.LDAP_URL,
    // sessions
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_user: process.env.REDIS_USER,
    redis_paswword: process.env.REDIS_PASSWORD,
    redis_ttl: 260,
  },
};

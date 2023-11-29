Obeesmart app  : PUG / Sequelize / + basic Menus and users management

configure the config.js with good stuff

just  do : 

npm install
npm install -g debug
npm install -g sequelize-cli

sequelize db:create
sequelize db:migrate

npm start


Populate small data in base :

sequelize db:seed:all

You can login on http://localhost:3000/ with email : bijon.charles@gmail.com  and password "toto"

 "scripts": {
    "pretest": "node_modules/.bin/eslint --ignore-path .eslintignorepath .",
    "start": "cross-env DEBUG=express-sequelize, pm2 start ./bin/www --name obeesmart",
    "db:migrate": "sequelize db:migrate",
    "db:seed": "sequelize db:seed:all",
    "db:create": "sequelize db:create",
    "db:drop": "sequelize db:drop",
    "stop": "pm2 stop"
  },
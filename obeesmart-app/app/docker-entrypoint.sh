#!/bin/bash
set -e
# waiting redis & pgsql up
#sleep 5

# ./wait-for.sh postgres:5432

sleep 5

if [ $NODE_ENV == "development" ] || [ $NODE_ENV == "staging" ] ; then
    npm run db:drop
    npm run db:create
    npm run db:migrate
    npm run db:seed
else
    npm run db:migrate
fi

# next CMD
sleep 2
exec "$@"

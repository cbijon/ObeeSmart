FROM keymetrics/pm2:16-buster
#MAINTAINER bijon.charles@gmail.com

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && npm install 
RUN mkdir /opt/app && cp -a /tmp/node_modules /opt/app/

# But we need to keep somethings to next ops
COPY package.json /opt/app/
COPY docker-entrypoint.sh /usr/local/bin/
COPY wait-for.sh /usr/local/bin/

# Install 
#RUN npm install -g nodemon pm2 --silent
RUN npm install -g sequelize-cli --silent
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN ln -s /usr/local/bin/docker-entrypoint.sh /
RUN chmod +x /usr/local/bin/wait-for.sh 
RUN ln -s /usr/local/bin/wait-for.sh /


# Define working directory
WORKDIR /opt/app/
COPY . /opt/app/

EXPOSE 3000

# Show current folder structure in logs
ENTRYPOINT ["docker-entrypoint.sh"]
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]


FROM node:19.3.0 

WORKDIR /app/client
ENV PATH /app/node_module/.bin:$PATH

COPY client/package.json ./
COPY client/package-lock.json ./
COPY client/public ./public
COPY client/src/ ./src
RUN npm ci
RUN npm run build

WORKDIR /app
ENV PATH /app/node_module/.bin:$PATH

COPY index.js ./
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

EXPOSE 5000

CMD node index.js
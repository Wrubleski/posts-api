# posts-api

An API that do CRUD operations on posts stored on a mongodb memory server.
Besides the basic CRUD operations, this API also do:

- Logging with winston
- Schema validation with Zod
- Serve a Swagger UI with the project specification

## Running the project

- Using docker:

Make sure you have docker installed. 
Navigate to the project root and build the image with:

````
docker build . -t posts-api
````

Run the the container with:

````
docker run -p 3000:3000 -d posts-api:latest
````
- Dev mode

Make sure you have NodeJS 16 installed.
Navigate to the project root, and install the dependencies with:

````
npm install
````

And start the dev server with:

````
npm run dev
````

## Testing the project

Make sure you have NodeJS 16 installed.
Navigate to the project root, and install the dependencies with:

````
npm install
````

Run the integration and unit tests with:

````
npm run test
````

## Documentation

After the project is running, you can hit <code>http://localhost:3000/api-docs</code> for the swagger specification.
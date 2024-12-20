# Mimic API Server

A lightweight mock API server that serves JSON data for development and testing purposes.

## Features

- Serves static JSON data
- RESTful API endpoints
- Supports GET, POST, PUT, DELETE methods
- Built-in web interface to explore available resources

## Getting Started

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

The server will start at `http://localhost:3000`

## API Documentation

You can access the API documentation in two ways:

1. Visit the web interface at `http://localhost:3000`
2. Import the [Postman Collection](http://localhost:3000/postman_collection.json) into your Postman workspace

## Available Endpoints

The following endpoints are available:

- GET `/db` - Returns all available resources
- GET `/:resource` - Returns all items in a resource
- GET `/:resource/:id` - Returns a single item from a resource
- POST `/:resource` - Creates a new item in a resource
- PUT `/:resource/:id` - Updates an item in a resource
- DELETE `/:resource/:id` - Deletes an item from a resource

## Deployment

The API is deployed at: [https://mimic-server-api.vercel.app/](https://mimic-server-api.vercel.app/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Anbuselvan Annamalai

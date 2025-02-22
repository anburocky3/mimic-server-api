# Mimic API Server 🧑‍💻

[![Stars](https://img.shields.io/github/stars/anburocky3/mimic-server-api)](https://github.com/anburocky3/mimic-server-api)
[![Forks](https://img.shields.io/github/forks/anburocky3/mimic-server-api)](https://github.com/anburocky3/mimic-server-api)
[![GitHub license](https://img.shields.io/github/license/anburocky3/mimic-server-api)](https://github.com/anburocky3/mimic-server-api)
![Anbuselvan Rocky Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fanburocky3%2Fmimic-server-api)
[![Support Server](https://img.shields.io/discord/742347296091537448.svg?label=Discord&logo=Discord&colorB=7289da)](https://bit.ly/cyberdudeDiscord)
[![Cyberdude youtube](https://img.shields.io/youtube/channel/subscribers/UCteUj8bL1ppZcS70UCWrVfw?style=social)](https://bit.ly/cyberdudeYT)
![Vercel Deploy](https://deploy-badge.vercel.app/vercel/mimic-server-api)

A lightweight mock API server that serves JSON data for development and testing purposes.

#### ⭐ Live Preview: [https://mimic-server-api.vercel.app](https://mimic-server-api.vercel.app/) 🪴

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
npm run dev # dev
npm start # production
```

### Generate Data

```bash
npm run generate # To generate data & docs together.
# or generate individually
npm run generate-data # To generate data: db.json
npm run generate-docs # To generate docs: Postman collections
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

Contributions are welcome! Please feel free to submit a Pull Request. [Contributing instruction here.](./CONTRIBUTE.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

[Anbuselvan Annamalai](https://facebook.com/anburocky3)

## Our valuable Contributors

1. [Yogeshwaran C](https://github.com/yogesh7401)
2. [Mr.Grootx](https://github.com/MrGrootx)
3. [SriBalan](https://github.com/sribalan98)

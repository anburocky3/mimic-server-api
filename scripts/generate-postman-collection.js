const fs = require("fs");
const path = require("path");

function generatePostmanCollection(dbPath) {
  // Read the db.json file
  const dbContent = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  // Base collection structure
  const collection = {
    info: {
      name: "JSON Server API",
      description:
        "This is a simple API server that mimics the behavior of a real API server. It is useful for testing and development purposes.",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: [],
    variable: [
      {
        key: "baseUrl",
        value: "http://localhost:3000",
        type: "string",
      },
    ],
  };

  // Generate endpoints for each resource
  Object.entries(dbContent).forEach(([resourceName, resourceData]) => {
    const resourceItem = {
      name: capitalizeFirstLetter(resourceName),
      item: [],
    };

    // GET all
    resourceItem.item.push({
      name: `Get All ${capitalizeFirstLetter(resourceName)}`,
      request: {
        method: "GET",
        url: {
          raw: `{{baseUrl}}/${resourceName}`,
          host: ["{{baseUrl}}"],
          path: [resourceName],
          query: generateQueryParams(resourceData[0]),
        },
      },
    });

    // GET single
    resourceItem.item.push({
      name: `Get Single ${capitalizeFirstLetter(resourceName)}`,
      request: {
        method: "GET",
        url: {
          raw: `{{baseUrl}}/${resourceName}/:id`,
          host: ["{{baseUrl}}"],
          path: [resourceName, ":id"],
          variable: [
            {
              key: "id",
              value: "1",
            },
          ],
        },
      },
    });

    // POST
    resourceItem.item.push({
      name: `Create ${capitalizeFirstLetter(resourceName)}`,
      request: {
        method: "POST",
        url: {
          raw: `{{baseUrl}}/${resourceName}`,
          host: ["{{baseUrl}}"],
          path: [resourceName],
        },
        header: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify(generateSampleBody(resourceData[0]), null, 2),
          options: {
            raw: {
              language: "json",
            },
          },
        },
      },
    });

    // PUT
    resourceItem.item.push({
      name: `Update ${capitalizeFirstLetter(resourceName)}`,
      request: {
        method: "PUT",
        url: {
          raw: `{{baseUrl}}/${resourceName}/:id`,
          host: ["{{baseUrl}}"],
          path: [resourceName, ":id"],
          variable: [
            {
              key: "id",
              value: "1",
            },
          ],
        },
        header: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify(generateSampleBody(resourceData[0]), null, 2),
          options: {
            raw: {
              language: "json",
            },
          },
        },
      },
    });

    // DELETE
    resourceItem.item.push({
      name: `Delete ${capitalizeFirstLetter(resourceName)}`,
      request: {
        method: "DELETE",
        url: {
          raw: `{{baseUrl}}/${resourceName}/:id`,
          host: ["{{baseUrl}}"],
          path: [resourceName, ":id"],
          variable: [
            {
              key: "id",
              value: "1",
            },
          ],
        },
      },
    });

    // Add nested resource requests if they exist
    const nestedResources = findNestedResources(resourceData[0]);
    nestedResources.forEach((nestedResource) => {
      resourceItem.item.push({
        name: `Get ${capitalizeFirstLetter(
          resourceName
        )} ${capitalizeFirstLetter(nestedResource)}`,
        request: {
          method: "GET",
          url: {
            raw: `{{baseUrl}}/${resourceName}/:id/${nestedResource}`,
            host: ["{{baseUrl}}"],
            path: [resourceName, ":id", nestedResource],
            variable: [
              {
                key: "id",
                value: "1",
              },
            ],
          },
        },
      });
    });

    collection.item.push(resourceItem);
  });

  return collection;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateQueryParams(resourceExample) {
  const params = [
    {
      key: "_page",
      value: "1",
      description: "Page number",
      disabled: true,
    },
    {
      key: "_limit",
      value: "10",
      description: "Items per page",
      disabled: true,
    },
    {
      key: "q",
      value: "",
      description: "Search term",
      disabled: true,
    },
  ];

  // Add params based on resource properties
  Object.keys(resourceExample || {}).forEach((key) => {
    if (key !== "id") {
      params.push({
        key: key,
        value: "",
        description: `Filter by ${key}`,
        disabled: true,
      });
    }
  });

  return params;
}

function generateSampleBody(example) {
  if (!example) return {};

  const sampleBody = { ...example };
  delete sampleBody.id;
  return sampleBody;
}

function findNestedResources(example) {
  if (!example) return [];

  return Object.entries(example)
    .filter(([_, value]) => Array.isArray(value))
    .map(([key]) => key);
}

// Main execution
const dbPath = path.join(__dirname, "..", "src", "data", "db.json");
const outputPath = path.join(__dirname, "..", "postman_collection.json");

try {
  const collection = generatePostmanCollection(dbPath);
  fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));
  console.log(`✅ Postman collection generated successfully at ${outputPath}`);
} catch (error) {
  console.error("❌ Error generating Postman collection:", error);
}

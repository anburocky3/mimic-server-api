import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

dotenv.config();

// ES6 equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
const POSTMAN_WORKSPACE_ID = process.env.POSTMAN_WORKSPACE_ID;

const dbPath = path.join(__dirname, "..", "db.json");
const outputPath = path.join(
  __dirname,
  "..",
  "public",
  "postman_collection.json"
);

// Convert regular functions to arrow functions
const generatePostmanCollection = (dbPath) => {
  const dbContent = JSON.parse(fs.readFileSync(dbPath, "utf8"));

  // Base collection structure
  const collection = {
    info: {
      name: "Mimic Server API",
      description:
        "This is a simple API server that mimics the behavior of a real API server. It is useful for testing and development purposes.",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: [],
    variable: [
      {
        key: "baseUrl",
        value: "https://mimic-server-api.vercel.app",
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
};

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const generateQueryParams = (resourceExample) => {
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
};

const generateSampleBody = (example) => {
  if (!example) return {};
  const sampleBody = { ...example };
  delete sampleBody.id;
  return sampleBody;
};

const findNestedResources = (example) => {
  if (!example) return [];
  return Object.entries(example)
    .filter(([_, value]) => Array.isArray(value))
    .map(([key]) => key);
};

const publishToPostman = async (collectionData) => {
  if (!POSTMAN_API_KEY || !POSTMAN_WORKSPACE_ID) {
    console.warn(
      "⚠️ Skipping Postman publish: POSTMAN_API_KEY or POSTMAN_WORKSPACE_ID not set"
    );
    return;
  }

  const options = {
    hostname: "api.getpostman.com",
    path: "/collections",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": POSTMAN_API_KEY,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Failed to publish: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on("error", reject);
    req.write(JSON.stringify({ collection: collectionData }));
    req.end();
  });
};

const main = async () => {
  try {
    const collection = generatePostmanCollection(dbPath);

    // Write to file
    fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));
    console.log(
      `✅ Postman collection generated successfully at ${outputPath}`
    );

    // Publish to Postman
    const result = await publishToPostman(collection);
    console.log(
      `✅ Collection published to Postman: https://www.postman.com/workspace/${POSTMAN_WORKSPACE_ID}/${result.collection.uid}`
    );
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

main();

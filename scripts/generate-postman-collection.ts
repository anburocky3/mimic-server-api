const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const https = require("https");

dotenv.config();

const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
const POSTMAN_WORKSPACE_ID = process.env.POSTMAN_WORKSPACE_ID;
const POSTMAN_COLLECTION_UID = process.env.POSTMAN_COLLECTION_UID;

const dbPath = path.join(__dirname, "..", "db.json");
const outputPath = path.join(
  __dirname,
  "..",
  "public",
  "postman_collection.json"
);

// Updated type definitions
type PostmanRequest = {
  name: string;
  request: {
    method: string;
    url: {
      raw: string;
      host: string[];
      path: string[];
      query?: Array<{
        key: string;
        value: string;
        description: string;
        disabled: boolean;
      }>;
      variable?: Array<{
        key: string;
        value: string;
      }>;
    };
    header?: Array<{
      key: string;
      value: string;
    }>;
    body?: {
      mode: string;
      raw: string;
      options: {
        raw: {
          language: string;
        };
      };
    };
  };
};

type ResourceItem = {
  name: string;
  item: PostmanRequest[];
};

// Add near the top with other types
type DbContent = {
  [key: string]: any[];
};

type PostmanCollection = {
  info: {
    name: string;
    description: string;
    schema: string;
    uid: string;
    version: string;
  };
  item: ResourceItem[];
  variable: Array<{
    key: string;
    value: string;
    type: string;
  }>;
};

type PostmanApiResponse = {
  collection: {
    uid: string;
  };
};

// Updated function signatures
const generatePostmanCollection = (dbPath: string): PostmanCollection => {
  const dbContent = JSON.parse(fs.readFileSync(dbPath, "utf8")) as DbContent;

  // Base collection structure
  const collection: PostmanCollection = {
    info: {
      name: "Mimic Server API",
      description:
        "This is a simple API server that mimics the behavior of a real API server. It is useful for testing and development purposes.",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      uid: POSTMAN_COLLECTION_UID,
      version: "1.0.0",
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
    const resourceItem: ResourceItem = {
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

const capitalizeFirstLetter = (string: string): string =>
  string.charAt(0).toUpperCase() + string.slice(1);

const generateQueryParams = (resourceExample: Record<string, any>) => {
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

const generateSampleBody = (example: Record<string, any>) => {
  if (!example) return {};
  const sampleBody = { ...example };
  delete sampleBody.id;
  return sampleBody;
};

const findNestedResources = (example: Record<string, any>): string[] => {
  if (!example) return [];
  return Object.entries(example)
    .filter(([_, value]) => Array.isArray(value))
    .map(([key]) => key);
};

const publishToPostman = async (
  collectionData: PostmanCollection
): Promise<PostmanApiResponse | undefined> => {
  if (!POSTMAN_API_KEY || !POSTMAN_WORKSPACE_ID) {
    console.warn(
      "⚠️ Skipping Postman publish: POSTMAN_API_KEY or POSTMAN_WORKSPACE_ID not set"
    );
    return undefined;
  }

  const collectionUid = collectionData.info.uid;

  // check if collectionUid is valid by making a GET request to the collection
  const checkIfCollectionExist = fetch(
    `https://api.getpostman.com/collections/${collectionUid}`,
    {
      headers: {
        "X-API-Key": POSTMAN_API_KEY,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      // check if it has error
      if (
        data.error &&
        data.error.message ===
          "We could not find the collection you are looking for"
      ) {
        return { method: "POST", path: "/collections" };
      }

      return { method: "PUT", path: `/collections/${collectionUid}` };
    });

  // console.log(checkIfCollectionExist);

  const method = (await checkIfCollectionExist).method;
  const path = (await checkIfCollectionExist).path;

  // Increment version before publishing
  const versionParts = collectionData.info.version.split(".");
  versionParts[2] = (parseInt(versionParts[2]) + 1).toString(); // Increment patch version
  collectionData.info.version = versionParts.join("."); // Update version in collection

  const options = {
    hostname: "api.getpostman.com",
    path: path,
    method: method,
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
    fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));
    console.log(
      `✅ Postman collection generated successfully at ${outputPath}`
    );

    const result = await publishToPostman(collection);
    if (result) {
      console.log(
        `✅ Collection published to Postman: https://www.postman.com/workspace/${POSTMAN_WORKSPACE_ID}/${result.collection.uid}`
      );
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

main();

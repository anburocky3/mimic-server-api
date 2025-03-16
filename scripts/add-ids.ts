import { readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";

// Get file path from command line argument
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error("Usage: ts-node add-ids.ts <path-to-json-file>");
  console.error("Example: ts-node add-ids.ts ../data/videos.json");
  process.exit(1);
}

interface BaseItem {
  [key: string]: any;
}

interface ItemWithId extends BaseItem {
  id: number;
}

try {
  // Resolve the absolute path from the provided argument
  const filePath = resolve(args[0]);

  // Read and parse the JSON file
  const fileContent = readFileSync(filePath, "utf8");
  const items = JSON.parse(fileContent) as BaseItem[];

  // Validate that the content is an array
  if (!Array.isArray(items)) {
    throw new Error("The JSON file must contain an array of objects");
  }

  // Validate that all items are objects
  if (!items.every((item) => typeof item === "object" && item !== null)) {
    throw new Error("All items in the array must be objects");
  }

  // Add IDs to each object
  const itemsWithIds: ItemWithId[] = items.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  // Write back to the file with proper formatting
  writeFileSync(filePath, JSON.stringify(itemsWithIds, null, 2), "utf8");

  console.log(`Successfully added IDs to all items in ${filePath}!`);
  console.log(`Total items processed: ${items.length}`);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error processing file:", error.message);
  } else {
    console.error("An unknown error occurred");
  }
  process.exit(1);
}

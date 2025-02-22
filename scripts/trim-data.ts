import * as fs from "fs";

function trimData(inputFile: string, outputFile: string, limit: number): void {
  // Read the input JSON file
  const data = fs.readFileSync(inputFile, "utf-8");
  const originalData: any[] = JSON.parse(data);

  // Validate the limit
  if (limit !== 50 && limit !== 100) {
    console.error("Limit must be either 50 or 100.");
    return;
  }

  // Trim the array to the specified limit
  const trimmedArray = originalData.slice(0, limit);

  // Write the trimmed array to the output JSON file
  fs.writeFileSync(outputFile, JSON.stringify(trimmedArray, null, 2));

  console.log(
    `Trimmed array with ${limit} elements has been written to ${outputFile}`
  );
}

// Get command-line arguments
const args = process.argv.slice(2); // Skip the first two arguments (node and script path)

if (args.length < 3) {
  console.error("Usage: ts-node trimData.ts <inputFile> <outputFile> <limit>");
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1];
const limit = parseInt(args[2], 10);

// Validate the limit
if (isNaN(limit) || (limit !== 50 && limit !== 100)) {
  console.error("Limit must be either 50 or 100.");
  process.exit(1);
}

// Call the trimData function
trimData(inputFile, outputFile, limit);

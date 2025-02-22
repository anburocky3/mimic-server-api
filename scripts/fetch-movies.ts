import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get API key from .env
const apiKey = process.env.TMDB_API_KEY;

if (!apiKey) {
  throw new Error(
    "API key not found in .env file. Please add TMDB_API_KEY=your_api_key to .env."
  );
}

// Get the year from command-line arguments or default to the current year
const year = process.argv[2]
  ? parseInt(process.argv[2], 10)
  : new Date().getFullYear();

// Base URL for the API endpoint
const baseUrl = "https://api.themoviedb.org/3/discover/movie";

// Base URL for images
const imageBaseUrl = "https://image.tmdb.org/t/p/original";

// Parameters for the API request
const params = {
  api_key: apiKey,
  language: "ta",
  with_original_language: "ta",
  sort_by: "vote_average.desc",
  year: year, // Use the year from CLI arguments or default to the current year
  page: 1, // Start with page 1
};

// List to store all movie data
let allMovies: any[] = [];

// Function to fetch all movies
async function fetchAllMovies() {
  try {
    while (true) {
      // Construct the URL with query parameters
      const url = `${baseUrl}?${new URLSearchParams(params as any).toString()}`;

      // Make the API request using fetch
      const response = await fetch(url);

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Process the movies to append the full image URL
      const processedMovies = data.results.map((movie: any) => ({
        ...movie,
        poster_path: movie.poster_path
          ? `${imageBaseUrl}${movie.poster_path}`
          : null,
        backdrop_path: movie.backdrop_path
          ? `${imageBaseUrl}${movie.backdrop_path}`
          : null,
      }));

      // Add the processed movies to the list
      allMovies = allMovies.concat(processedMovies);

      // Check if there are more pages
      if (data.page >= data.total_pages) {
        break;
      }

      // Move to the next page
      params.page += 1;
    }

    // Ensure the /data directory exists
    const dirPath = path.join(__dirname, "../data/movies");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write the data to a JSON file
    const filePath = path.join(dirPath, `movies_${year}.json`);
    fs.writeFileSync(filePath, JSON.stringify(allMovies, null, 2));

    console.log(`Total movies retrieved for year ${year}: ${allMovies.length}`);
    console.log(`Data written to ${filePath}`);
    console.log(`----------------------------`);

    // Merge all movies_*.json files into movies.json
    mergeMoviesFiles(dirPath);
  } catch (error) {
    console.error("Error fetching or writing data:", error);
  }
}

// Function to merge all movies_*.json files into movies.json
function mergeMoviesFiles(dirPath: string) {
  try {
    // Read all files in the /data directory
    const files = fs.readdirSync(dirPath);

    // Filter files that match the pattern movies_*.json
    const movieFiles = files.filter(
      (file) => file.startsWith("movies_") && file.endsWith(".json")
    );

    // Extract years from filenames and sort them in descending order
    const sortedFiles = movieFiles
      .map((file) => {
        const year = parseInt(file.match(/movies_(\d+)\.json/)?.[1] || "0", 10);
        return { file, year };
      })
      .sort((a, b) => b.year - a.year) // Sort by year in descending order
      .map((item) => item.file);

    // Array to store all merged movies
    let mergedMovies: any[] = [];

    // Read and merge each file
    sortedFiles.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const data = fs.readFileSync(filePath, "utf-8");
      const movies = JSON.parse(data);
      mergedMovies = mergedMovies.concat(movies);
    });

    // Write the merged data to movies.json
    const dirDesinationPath = path.join(__dirname, "../data");
    const mergedFilePath = path.join(dirDesinationPath, "movies.json");
    fs.writeFileSync(mergedFilePath, JSON.stringify(mergedMovies, null, 2));

    console.log(`Total movies merged: ${mergedMovies.length}`);
    console.log(`Merged data written to ${mergedFilePath}`);
  } catch (error) {
    console.error("Error merging movie files:", error);
  }
}

// Run the function
fetchAllMovies();

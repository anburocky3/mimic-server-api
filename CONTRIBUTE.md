# Contributing to Mimic Server API 🤝

Thank you for considering contributing to Mimic API! We appreciate your help in making this project better.

## How to Contribute 🛠️

1. **Fork & Clone the Repository** 🍴

   - Click the ["Fork"](https://github.com/anburocky3/mimic-server-api/fork) button at the top right of the repository page to create your own copy of the project.
   - Once done, clone your forked repository to your local machine for making your contribution changes.
   - Open `Terminal` in your system and clone the project:

     ```bash
     git clone https://github.com/{anburocky3}/mimic-server-api.git
     ```

   - Replace `{anburocky3}` and `mimic-server-api` with your GitHub username and the name of the repository.

2. **Create a New Branch** 🌿

   - Create a new branch for your feature or bug fix:

     ```bash
     git checkout -b my-feature-branch # name meaningfully
     ```

3. **Make Your Changes** ✏️

   - Make your changes in your local repository.
   - If you are providing API Data, create a new JSON file in `data/fileName.json` and enter the data in JSON structure.
   - Open `scripts/generate-tamil-data.ts` and import the JSON file you created earlier like this:

     ```js
     const endpointName = require("../data/fileName.json");
     ```

   - Once imported, in the same file, look for the `generateDatabase()` function and pass your returned JSON in that function's return.
   - **For example**, if you would like to import `todolist`:

     - Create a new file named `todolist.json` inside the `data/` directory.
     - Import your JSON file like this:

       ```js
       const todoList = require("../data/todolist.json");
       // Existing code, DON'T TOUCH THAT.
       const generateDatabase = () => {
         // Existing code, DON'T TOUCH THAT.
         // On returning, just pass your JSON data.
         return {
           users,
           posts,
           todos,
           projects,
           quotes,
           todoList, // <- like this
         };
       };
       ```

     - Now your API can be browsed at this path:
       - https://mimic-server-api.vercel.app/api/todolist

4. **Commit Your Changes** 💾

   - Commit your changes with a descriptive message:

     ```bash
     git commit -m "Add a new feature"
     ```

5. **Push Your Changes** 🚀

   - Push your changes to your forked repository:

     ```bash
     git push origin my-feature-branch
     ```

6. **Create a Pull Request** 📥
   - Go to the original repository where you want to contribute and click on the "Pull Requests" tab.
   - Click the "New Pull Request" button and select your branch to create a pull request.

## Guidelines 📋

- Please ensure your code adheres to the project's coding standards.
- Write clear and concise commit messages.
- If your changes include new features, please update the documentation accordingly.

## scripts ⚙️

1. **Trim Junk data** to 50 or 100 records

   ```bash
   ts-node /scripts/trim-data.ts --input-file --output-file limit
   ```

   _For example:_

   ```bash
   ts-node /scripts/trim-data.ts data/junk/fileName.ts data/fileName.ts 100
   ```

   > This will trim 50 or 100 records based on what you have provided in the CLI.

2. **Get Movies from TMDB:** (API KEY needed)

   ```bash
   ts-node /scripts/fetch-movies.ts --year
   ```

   _For example:_

   ```bash
   ts-node /scripts/fetch-movies.ts 2025
   ```

   > Fetch movies by year (themoviedb.org): This will fetch all the movies and merge it as single `data/movies.json`

## Questions? ❓

If you have any questions or need help, feel free to open an issue in the repository or reach out to the [maintainers](https://fb.me/anburocky3).

Thank you for your contributions! 🍻

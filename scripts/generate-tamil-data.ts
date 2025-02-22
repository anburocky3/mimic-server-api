const fs = require("fs");
const path = require("path");
const quotes = require("../data/quotes.json");
const bills = require("../data/bills.json");
const movies = require("../data/movies.json");
const videos = require("../data/videos.json");

// Tamil Nadu names data
const tamilNames = {
  firstNames: [
    "Anbu",
    "Senthil",
    "Muthu",
    "Karthik",
    "Surya",
    "Vijay",
    "Raja",
    "Kumar",
    "Prakash",
    "Ravi",
    "Selvi",
    "Lakshmi",
    "Priya",
    "Tamil",
    "Kavitha",
    "Meena",
    "Devi",
    "Kala",
    "Valli",
    "Thangam",
    "Arjun",
    "Bala",
    "Chandran",
    "Dharan",
    "Ezhil",
    "Ganesh",
    "Hari",
    "Inba",
    "Jenika",
    "Kannan",
    "Jenifer",
    "Monika",
    "Sowmiya",
  ],
  lastNames: [
    "Selvan",
    "Murugan",
    "Krishnan",
    "Sundaram",
    "Palani",
    "Rajan",
    "Selvi",
    "Pandian",
    "Arumugam",
    "Velan",
    "Sekhar",
    "Boopalan",
    "Senthil",
    "Elango",
    "Annamalai",
    "Duraisingam",
    "Mageshwari",
    "Vivek",
    "Subramanian",
    "Venkatesh",
    "Raj",
  ],
};

// Cities in Tamil Nadu
const tamilCities = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tirunelveli",
  "Thoothukudi",
  "Thanjavur",
  "Vellore",
  "Erode",
  "Neyveli",
];

// Tech-related project names
const projectTypes = [
  "AI/ML",
  "Web Development",
  "Mobile App",
  "Data Analytics",
  "IoT",
  "Blockchain",
  "Cloud Computing",
  "Cybersecurity",
  "E-commerce",
  "Digital Marketing",
];

// Convert functions to arrow functions and use const
const generateRandomUser = (id: number) => {
  const firstName =
    tamilNames.firstNames[
      Math.floor(Math.random() * tamilNames.firstNames.length)
    ];
  const lastName =
    tamilNames.lastNames[
      Math.floor(Math.random() * tamilNames.lastNames.length)
    ];

  return {
    id,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}${id}@techmail.com`,
    username: `${firstName.toLowerCase()}${id}`,
  };
};

const generateRandomPost = (id: number, userIds: number[]) => {
  const userId = userIds[Math.floor(Math.random() * userIds.length)];
  const topics = [
    "Tech Innovation in Tamil Nadu",
    "Traditional Tech Meets Modern",
    "Startup Scene in Chennai",
    "Digital Transformation",
    "Smart City Initiatives",
    "Rural Tech Development",
    "Education Technology",
    "Healthcare Innovation",
    "Sustainable Tech Solutions",
  ];
  const title = topics[Math.floor(Math.random() * topics.length)];
  const city = tamilCities[Math.floor(Math.random() * tamilCities.length)];

  return {
    id,
    userId,
    title,
    body: `Exploring the impact of ${title} in ${city}...`,
    comments: generateComments(id, userIds),
  };
};

const generateComments = (postId: number, userIds: number[]) => {
  const numComments = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: numComments }, (_, i) => ({
    id: postId * 10 + i,
    postId,
    userId: userIds[Math.floor(Math.random() * userIds.length)],
    text: "Great insights about the tech scene in Tamil Nadu!",
  }));
};

const generateTodo = (id: number, userId: number) => {
  const tasks = [
    "Review Tamil NLP model",
    "Update Chennai traffic monitoring system",
    "Develop smart agriculture app",
    "Implement blockchain for land records",
    "Create e-governance portal",
    "Design rural healthcare platform",
  ];

  return {
    id,
    userId,
    task: tasks[Math.floor(Math.random() * tasks.length)],
    completed: Math.random() > 0.5,
  };
};

const generateProject = (id: number, userId: number) => {
  const projectType =
    projectTypes[Math.floor(Math.random() * projectTypes.length)];
  const city = tamilCities[Math.floor(Math.random() * tamilCities.length)];

  return {
    id,
    name: `${city} ${projectType} Initiative`,
    userId,
    description: `Implementing ${projectType} solutions for ${city} region`,
    tasks: generateProjectTasks(id),
  };
};

const generateProjectTasks = (projectId: number) => {
  const statuses = ["Not Started", "In Progress", "Completed"];
  return Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, i) => ({
    id: projectId * 10 + i,
    projectId,
    task: `Phase ${i + 1} Implementation`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

const generateDatabase = () => {
  const users = Array.from({ length: 50 }, (_, i) => generateRandomUser(i + 1));
  const userIds = users.map(({ id }) => id);

  const posts = Array.from({ length: 50 }, (_, i) =>
    generateRandomPost(i + 1, userIds)
  );

  let todoId = 1; // Add a counter for todo IDs
  const todos = userIds.flatMap((userId) => {
    const numTodos = Math.floor(Math.random() * 3) + 1;
    return Array.from(
      { length: numTodos },
      (_, i) => generateTodo(todoId++, userId) // Use and increment todoId
    );
  });

  const projects = Array.from({ length: 50 }, (_, i) =>
    generateProject(i + 1, userIds[Math.floor(Math.random() * userIds.length)])
  );

  return {
    users,
    movies,
    quotes,
    posts,
    todos,
    projects,
    bills,
    videos,
  };
};

// Generate and save the database
const db = generateDatabase();
const outputPath = path.join(__dirname, "..", "db.json");

// Create directory if it doesn't exist
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(db, null, 2));
console.log(
  `✅ Generated db.json with Tamil Nadu specific data at ${outputPath}`
);

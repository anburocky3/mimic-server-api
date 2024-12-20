const fs = require("fs");
const path = require("path");

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
    "Sowmiya",
  ],
  lastNames: [
    "Murugan",
    "Krishnan",
    "Sundaram",
    "Palani",
    "Rajan",
    "Selvan",
    "Pandian",
    "Arumugam",
    "Velan",
    "Thevar",
    "Nadar",
    "Pillai",
    "Gounder",
    "Chettiar",
    "Iyer",
    "Iyengar",
    "Selvan",
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

function generateRandomUser(id) {
  const firstName =
    tamilNames.firstNames[
      Math.floor(Math.random() * tamilNames.firstNames.length)
    ];
  const lastName =
    tamilNames.lastNames[
      Math.floor(Math.random() * tamilNames.lastNames.length)
    ];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}${id}@techmail.com`;
  const username = `${firstName.toLowerCase()}${id}`;

  return { id, name, email, username };
}

function generateRandomPost(id, userIds) {
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
  const body = `Exploring the impact of ${title} in ${
    tamilCities[Math.floor(Math.random() * tamilCities.length)]
  }...`;

  return {
    id,
    userId,
    title,
    body,
    comments: generateComments(id, userIds),
  };
}

function generateComments(postId, userIds) {
  const numComments = Math.floor(Math.random() * 3) + 1;
  const comments = [];

  for (let i = 0; i < numComments; i++) {
    comments.push({
      id: postId * 10 + i,
      postId,
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      text: `Great insights about the tech scene in Tamil Nadu!`,
    });
  }

  return comments;
}

function generateTodo(id, userId) {
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
}

function generateProject(id, userId) {
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
}

function generateProjectTasks(projectId) {
  const numTasks = Math.floor(Math.random() * 3) + 2;
  const tasks = [];
  const statuses = ["Not Started", "In Progress", "Completed"];

  for (let i = 0; i < numTasks; i++) {
    tasks.push({
      id: projectId * 10 + i,
      projectId,
      task: `Phase ${i + 1} Implementation`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return tasks;
}

// Generate the complete database
function generateDatabase() {
  const users = Array.from({ length: 50 }, (_, i) => generateRandomUser(i + 1));
  const userIds = users.map((user) => user.id);

  const posts = Array.from({ length: 50 }, (_, i) =>
    generateRandomPost(i + 1, userIds)
  );

  const todos = [];
  userIds.forEach((userId) => {
    const numTodos = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numTodos; i++) {
      todos.push(generateTodo(todos.length + 1, userId));
    }
  });

  const projects = Array.from({ length: 50 }, (_, i) =>
    generateProject(i + 1, userIds[Math.floor(Math.random() * userIds.length)])
  );

  return {
    users,
    posts,
    todos,
    projects,
  };
}

// Generate and save the database
const db = generateDatabase();
const outputPath = path.join(__dirname, "..", "data", "db.json");

fs.writeFileSync(outputPath, JSON.stringify(db, null, 2));
console.log(
  `✅ Generated db.json with Tamil Nadu specific data at ${outputPath}`
);

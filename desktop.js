
const TEAM_MEMBERS = [
  {
    name: "RedstoneCoreDev",
    role: "Lead Developer",
    location: "Austria",
    bio: "Lead developer and founder of RDT.",
    skills: ["HTML", "CSS", "JavaScript", "Efficiency", "Network Architecture", "System Architecture"],
    profileImage: "img/redstone.jpg",
    nameColor: "redstone-gradient-enhanced",
  },
  {
    name: "Jonger",
    role: "Artist / Designer",
    location: "unknown",
    bio: "unknown",
    skills: ["unknown"],
    profileImage: "", // Add image URL here
    nameColor: "text-blue-500",
  },
  {
    name: "Argentum",
    role: "Frontend Developer",
    location: "Europe",
    bio: "unknown",
    skills: ["unknown"],
    profileImage: "", // Add image URL here
    nameColor: "text-purple-500",
  },
  {
    name: "TheElderTangent",
    role: "Backend Developer",
    location: "Israel",
    bio: "Enthusiastic developer passionate about clean code, creative solutions, and building useful tools that actually work. Focused on backend development and always learning something new.",
    description: "Hi, I'm a developer from Israel who enjoys solving problems with code. I like working with Python for backend logic and automation, and I use HTML, CSS, and JavaScript to bring interfaces to life. I've been experimenting with frameworks and tools like Flask, DBUtils, and modern backend  libraries, but I also appreciate the simplicity of building things from scratch. Whether I'm scripting utilities, designing a web interface, or just exploring how something works under the hood, I'm driven by curiosity and a desire to make things better. You can find my projects and code experiments on GitHub, and some of them live at my personal site hosted on PythonAnywhere. Feel free to reach out or explore my work — I'm always open to learning and collaborating.",
    skills: ["Python", "HTML", "CSS", "JS"],
    profileImage: "img/tangent.png",
    nameColor: "random",
  },
  {
    name: "Androidl2",
    role: "Designer / Artist",
    location: "unknown",
    bio: "unknown",
    skills: ["unknown"],
    profileImage: "",
    nameColor: "text-green-700",
  },
    {
    name: "anyaa308",
    role: "unknown",
    location: "unknown",
    bio: "unknown",
    skills: ["unknown"],
    profileImage: "",
    nameColor: "text-green-700",
  },
];

// PROJECTS - Add your projects here!
const PROJECTS = [
  {
    title: "RDT Website",
    description: "Modern, responsive website showcasing our team and projects",
    status: "Completed", // Options: "Completed", "Developing", "Planning", "Concept"
    technologies: ["HTML", "CSS", "JS", "GitHub Pages"],
    features: ["Responsive Design", "Team Profiles", "Project Showcase", "Legal Pages"],
    contributors: ["RedstoneCoreDev"],
  },
  {
    title: "Burnt Horizons",
    description: "2D survival game set in a post-apocalyptic world",
    status: "Planning",
    technologies: ["HTML", "CSS", "JS", "RDT Framework"],
    features: ["Game", "Exploration", "Crafting", "Multiplayer"],
    contributors: ["RedstoneCoreDev", "Argentum", "Jonger", "Androidl2"],
  },
  {
    title: "RDT Framework",
    description: "A powerful framework for building web applications or games",
    status: "Concept",
    technologies: ["HTML", "CSS", "JS"],
    features: ["Easier Syntax", "Manage things easier"],
    contributors: ["RedstoneCoreDev"],
  },
  {
    title: "RDT Browser",
    description: "A powerful browser for accessing the web, games and RDT services over the RDT Network",
    status: "Developing",
    technologies: ["HTML", "CSS", "JS"],
    features: ["Secure Browsing", "RDT Services and Games", "Access RDT Network", "Customize your browser with templates or plugins"],
    contributors: ["RedstoneCoreDev"],
  },
  {
    title: "RDT Network",
    description: "Server network for hosting RDT services, applications, games and search the web over the RDT Network with extra security features.",
    status: "Concept",
    technologies: [""],
    features: [""],
    contributors: ["RedstoneCoreDev"],
  },
];

// WEBSITE SETTINGS
const WEBSITE_CONFIG = {
  teamName: "Reds Dev Team",
  heroDescription:
    "Building innovative digital solutions with passion, creativity, and cutting-edge technology.",
  discordLink: "https://discord.gg/9dg8Z6be",
  contactEmail: "redstone9263@gmail.com",
};

// Random colors for special effects
const RANDOM_COLORS = [
  "text-yellow-400",
  "text-green-400",
  "text-blue-400",
  "text-pink-400",
  "text-cyan-400",
  "text-orange-400",
  "text-lime-400",
  "text-violet-400",
  "text-emerald-400",
  "text-teal-400",
  "text-indigo-400",
  "text-rose-400",
];

function getRandomColor() {
  return RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
}

function getStatusClass(status) {
  const statusMap = {
    Completed: "status-completed",
    Developing: "status-development",
    Planning: "status-planning",
    Concept: "status-concept",
  };
  return statusMap[status] || "status-concept";
}

function populateTeamMembers() {
  const teamGrid = document.getElementById("teamGrid");
  teamGrid.innerHTML = "";

  TEAM_MEMBERS.forEach((member, index) => {
    const memberCard = document.createElement("div");
    memberCard.className = "team-card";
    memberCard.style.animationDelay = `${index * 150}ms`;

    // Handle name color
    let nameColorClass = member.nameColor;
    if (member.nameColor === "random") {
      nameColorClass = getRandomColor();
    }

    // Handle profile image
    let avatarContent = "👤"; // Default emoji
    if (member.profileImage && member.profileImage.trim() !== "") {
      avatarContent = `<img src="${member.profileImage}" alt="${member.name}" onerror="this.style.display='none'; this.parentNode.innerHTML='👤';">`;
    }

    const skillsHtml = member.skills
      .slice(0, 3)
      .map((skill) => `<span class="skill-tag">${skill}</span>`)
      .join("");

    memberCard.innerHTML = `
    <div class="team-avatar">${avatarContent}</div>
    <div class="team-name ${nameColorClass}">${member.name}</div>
    <div class="team-role">${member.role}</div>
    <div class="team-location">${member.location}</div>
    <div class="team-bio">${member.bio}</div>
    <div class="skills">${skillsHtml}</div>`;

    teamGrid.appendChild(memberCard);
  });
}

function populateProjects() {
  const projectsGrid = document.getElementById("projectsGrid");
  projectsGrid.innerHTML = "";

  // Define the order of categories (statuses)
  const statusOrder = ["Completed", "Developing", "Planning", "Concept"];

  // Group projects by status
  const grouped = {};
  PROJECTS.forEach((project) => {
    const status = project.status || "Concept";
    if (!grouped[status]) grouped[status] = [];
    grouped[status].push(project);
  });

  // Render each category in order
  statusOrder.forEach((status) => {
    if (!grouped[status] || grouped[status].length === 0) return;

    // Category header (smaller)
    const categoryHeader = document.createElement("h3");
    categoryHeader.className = "project-category-header";
    categoryHeader.style.fontSize = "1.25rem";
    categoryHeader.style.margin = "32px 0 12px 0";
    categoryHeader.textContent = status;
    projectsGrid.appendChild(categoryHeader);

    // Container for up to 3 cards per row
    const row = document.createElement("div");
    row.className = "project-row";
    row.style.display = "grid";
    row.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
    row.style.gap = "20px";
    row.style.marginBottom = "24px";

    grouped[status].forEach((project) => {
      const projectCard = document.createElement("div");
      projectCard.className = "project-card";

      const techHtml = project.technologies
        .map((tech) => `<span class="tech-tag">${tech}</span>`)
        .join("");

      const featuresHtml = project.features
        .map((feature) => `<li>${feature}</li>`)
        .join("");

      const Contributors = (project.contributors || [])
        .map((contributor) => `<span class="contributor-tag">${contributor}</span>`)
        .join("");

      // Make the category header a small hero space above the row (already handled above)
      // Project cards: fixed 3 columns per row, not dynamic

      projectCard.innerHTML = `
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <span class="status-badge ${getStatusClass(project.status)}">${project.status}</span>
        <div>
          <h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">Technologies</h4>
          <div class="tech-tags">${techHtml}</div>
        </div>
        <div>
          <h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">Key Features</h4>
          <ul class="features-list">${featuresHtml}</ul>
        </div>
        <div>
          <h4 class="contributor">Contributors</h4>
          <ul>${Contributors}</ul>
        </div>
      `;

      // Adjust the row to always have 3 columns, not dynamic
      row.style.gridTemplateColumns = "repeat(3, 1fr)";
      row.style.alignItems = "stretch";
      row.style.width = "100%";
      row.style.marginLeft = "0";
      row.style.marginRight = "0";

      // Make the category header a small hero space
      categoryHeader.style.width = "100%";
      categoryHeader.style.textAlign = "left";
      categoryHeader.style.background = "rgba(0,0,0,0.04)";
      categoryHeader.style.padding = "8px 16px";
      categoryHeader.style.borderRadius = "8px";
      categoryHeader.style.margin = "32px 0 8px 0";

      row.appendChild(projectCard);
    });

    projectsGrid.appendChild(row);
  });
}

function showTab(tabName) {
  const tabs = ["home", "projects", "data-protection", "imprint", "profile"];
  tabs.forEach((tab) => {
    const element = document.getElementById(`${tab}-tab`);
    if (element) {
      element.classList.add("hidden");
    }
  });

  const selectedTab = document.getElementById(`${tabName}-tab`);
  if (selectedTab) {
    selectedTab.classList.remove("hidden");
  }

  const navButtons = document.querySelectorAll(".nav-button");
  navButtons.forEach((button) => {
    button.classList.remove("active");
  });

  navButtons.forEach((button) => {
    if (button.textContent.toLowerCase() === tabName) {
      button.classList.add("active");
    }
  });
}

function handleScroll() {
  const header = document.getElementById("header");
  const rdtTitle = document.getElementById("rdtTitle");
  const scrollY = window.scrollY;

  if (scrollY > 60) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  const scrollProgress = Math.min(scrollY / 400, 1);
  const titleScale = 1.2 - scrollProgress * 0.4;
  rdtTitle.style.fontSize = `${titleScale * 3}rem`;
}

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", function () {
  populateTeamMembers();
  populateProjects();

  handleScroll(); // Ensure header state is correct on initial load

  let ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
});

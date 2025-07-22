const TEAM_MEMBERS = [
  {
    name: "RedstoneCoreDev",
    role: "Lead Developer",
    location: "Austria",
    bio: "Lead developer and founder of RDT. Passionate about creating innovative solutions and leading the team to success.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "Efficiency",
      "Network Arichitecture",
      "System Architecture",
    ],
    profileImage: "img/redstone.jpg", // Add image URL here like: "images/redstone.jpg"
    nameColor: "redstone-gradient-enhanced", // Special gradient for RedstoneCoreDev
  },
  {
    name: "Jonger",
    role: "Creative Director",
    location: "Netherlands",
    bio: "Creative artist specializing in UI/UX design and digital art. Brings visual concepts to life with stunning designs.",
    skills: ["Figma", "Photoshop", "Illustrator", "UI/UX", "Brand Design"],
    profileImage: "", // Add image URL here
    nameColor: "text-blue-500",
  },
  {
    name: "Argentum",
    role: "Backend Architect",
    location: "Europe",
    bio: "Backend specialist with expertise in database design and API development. Ensures our systems run smoothly and efficiently.",
    skills: ["Java", "Spring", "PostgreSQL", "AWS", "Microservices"],
    profileImage: "", // Add image URL here
    nameColor: "text-purple-500",
  },
  {
    name: "TheElderTangent",
    role: "Frontend Developer",
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
];

// PROJECTS - Add your projects here!
const PROJECTS = [
  {
    title: "RDT Website",
    description: "Modern, responsive website showcasing our team and projects",
    status: "Completed", // Options: "Completed", "In Development", "Planning", "Concept"
    technologies: ["HTML", "CSS", "JS", "GitHub Pages"],
    features: ["Responsive Design", "Team Profiles", "Project Showcase", "Legal Pages"],
  },
  {
    title: "Burnt Horizons",
    description: "2D survival game set in a post-apocalyptic world",
    status: "Planning",
    technologies: ["HTML", "CSS", "JS", "RDT Framework"],
    features: ["Game", "Exploration", "Crafting", "Base Building", "Multiplayer"],
  },
  {
    title: "RDT Framework",
    description: "A powerful framework for building web applications or games",
    status: "Concept",
    technologies: ["HTML", "CSS", "JS"],
    features: ["Easier Syntax", "Manage things easier"],
  },
  {
    title: "RDT Browser",
    description: "A powerful browser for accessing the web, games and RDT services over the RDT Network",
    status: "In Development",
    technologies: ["HTML", "CSS", "JS"],
    features: ["Browser", "Easier Syntax", "Manage things easier"],
  },
  {
    title: "RDT Network",
    description: "Server network for hosting RDT services, applications, games and search the web over the RDT Network with extra security features.",
    status: "Concept",
    technologies: ["", "", "", ""],
    features: ["", "", "", ""],
  },
];

// WEBSITE SETTINGS
const WEBSITE_CONFIG = {
  teamName: "Reds Dev Team",
  heroDescription:
    "Building innovative digital solutions with passion, creativity, and cutting-edge technology.",
  discordLink: "https://discord.gg/sAVMabyH",
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
    "In Development": "status-development",
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

  PROJECTS.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";

    const techHtml = project.technologies
      .map((tech) => `<span class="tech-tag">${tech}</span>`)
      .join("");

    const featuresHtml = project.features
      .map((feature) => `<li>${feature}</li>`)
      .join("");

    projectCard.innerHTML = `
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <span class="status-badge ${getStatusClass(
                      project.status
                    )}">${project.status}</span>
                    <div>
                        <h4 style="font-size: 1.125rem; font-weight: 600; color: white; margin-bottom: 8px;">Technologies</h4>
                        <div class="tech-tags">${techHtml}</div>
                    </div>
                    <div>
                        <h4 style="font-size: 1.125rem; font-weight: 600; color: white; margin-bottom: 8px;">Key Features</h4>
                        <ul class="features-list">${featuresHtml}</ul>
                    </div>
                `;

    projectsGrid.appendChild(projectCard);
  });
}

function showTab(tabName) {
  const tabs = ["home", "projects", "data-protection", "imprint"];
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

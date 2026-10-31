const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);
const toastRegion = $("#toastRegion");
let toastTimer;

function toast(message, error = false) {
  const item = document.createElement("div");
  item.className = `toast${error ? " error" : ""}`;
  item.textContent = message;
  toastRegion.append(item);
  window.setTimeout(() => item.remove(), 3500);
}

function initPage() {
  const loader = $("#loader");
  window.setTimeout(() => loader.classList.add("is-done"), 500);
  window.setTimeout(() => loader.remove(), 1150);

  const header = $(".site-header");
  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const menuToggle = $("#menuToggle");
  const nav = $("#primaryNav");
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav.classList.toggle("open", open);
  });
  $$("a", nav).forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }));

  const themeToggle = $("#themeToggle");
  const savedTheme = localStorage.getItem("ieee-rrce-theme");
  if (savedTheme === "light") document.documentElement.dataset.theme = "light";
  const updateThemeButton = () => {
    const light = document.documentElement.dataset.theme === "light";
    themeToggle.querySelector(".theme-icon").textContent = light ? "☾" : "☼";
    themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  };
  updateThemeButton();
  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    if (next === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    localStorage.setItem("ieee-rrce-theme", next);
    updateThemeButton();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  $$(".reveal").forEach((element) => observer.observe(element));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.id;
      $$(".primary-nav > a[href^='#']").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  $$("main section[id]").forEach((section) => sectionObserver.observe(section));
}

const events = [
  { title: "AI & ML: First Steps", type: "workshop", category: "Workshop", date: "14 NOV 2026", time: "10:00 AM", venue: "Innovation Lab · Demo", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80", alt: "Abstract glowing artificial intelligence network", desc: "Get hands-on with the ideas behind machine learning, explore a small dataset and build your first simple model. Designed for curious beginners." },
  { title: "Build the Web: Weekend Lab", type: "workshop", category: "Workshop", date: "21 NOV 2026", time: "9:30 AM", venue: "Computer Lab · Demo", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80", alt: "Laptop on a desk displaying a coding workspace", desc: "Go from first HTML tag to a polished responsive landing page in a collaborative, project-first session." },
  { title: "Robotics Innovation Sprint", type: "competition", category: "Competition", date: "05 DEC 2026", time: "10:00 AM", venue: "Seminar Hall · Demo", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80", alt: "Friendly humanoid robot in a technology lab", desc: "Prototype a creative automation solution with a team. Bring an open mind; a robotics background is not required." },
  { title: "Design for a Greener Grid", type: "talk", category: "Guest talk", date: "12 DEC 2026", time: "2:00 PM", venue: "Auditorium · Demo", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80", alt: "Wind turbines generating renewable energy", desc: "A sample talk on the engineering challenges and emerging ideas behind cleaner, more resilient energy systems." },
  { title: "Build for Bengaluru Hack Day", type: "competition", category: "Hackathon", date: "19 DEC 2026", time: "9:00 AM", venue: "Campus Commons · Demo", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80", alt: "Collaborators working together at a laptop", desc: "Team up to make a thoughtful technology prototype around a challenge inspired by city life. Demo event content only." },
  { title: "Signals, Sensors & Smart Things", type: "workshop", category: "Workshop", date: "09 JAN 2027", time: "10:30 AM", venue: "Electronics Lab · Demo", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", alt: "Electronic circuit board with components", desc: "Explore how sensors and connected devices turn real-world signals into useful information through a guided prototype." }
];
let eventFilter = "all";

function renderEvents() {
  const query = $("#eventSearch").value.trim().toLowerCase();
  const filtered = events.filter((event) => (eventFilter === "all" || event.type === eventFilter)
    && `${event.title} ${event.category} ${event.desc}`.toLowerCase().includes(query));
  $("#eventGrid").innerHTML = filtered.length ? filtered.map((event) => `
    <article class="event-card">
      <div class="event-image"><img src="${event.image}" alt="${event.alt}" loading="lazy"><span class="event-tag">${event.category} · Sample</span></div>
      <div class="event-content"><span class="event-meta">${event.date} &nbsp;·&nbsp; ${event.time}</span><h3>${event.title}</h3><p>${event.desc}</p>
        <div class="event-bottom"><span>⌖ ${event.venue}</span><button type="button" data-event="${escapeHTML(event.title)}">Event details ↗</button></div>
      </div>
    </article>`).join("") : '<div class="empty-state">No sample events match that search. Try another topic.</div>';
}

const projects = [
  { title: "AquaSense", category: "IoT", tags: ["IoT", "Sensors", "Sustainability"], image: "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=800&q=80", alt: "Water surface reflecting sunlight", desc: "A concept sensor network that monitors water quality signals and presents readable trends for local communities.", problem: "Important water quality changes can be hard to spot without accessible, timely monitoring.", solution: "A low-cost sensor concept paired with a clear dashboard to make sample readings easier to understand.", team: "Demo team · names not provided" },
  { title: "Campus Energy Lens", category: "Sustainability", tags: ["IoT", "Web", "Clean tech"], image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80", alt: "Wind turbines against a bright sky", desc: "A dashboard concept for visualizing building energy patterns and highlighting practical efficiency opportunities.", problem: "Energy use can feel invisible to the people who could help reduce it.", solution: "An illustrative data view that turns building-level energy readings into understandable patterns.", team: "Demo team · names not provided" },
  { title: "Study Buddy, Reimagined", category: "AI / ML", tags: ["AI / ML", "Python", "Education"], image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80", alt: "Student using a laptop for online learning", desc: "A learning companion concept that turns a topic into short prompts, revision questions and a gentle study plan.", problem: "Large technical subjects can be difficult to break into manageable learning steps.", solution: "A prototype prompt flow that helps a student organize self-directed practice.", team: "Demo team · names not provided" },
  { title: "Signal Garden", category: "Web", tags: ["Web", "Data", "Accessibility"], image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", alt: "Colorful abstract digital data visualization", desc: "An accessible web experience that transforms live-like sensor patterns into a playful, human-readable story.", problem: "Technical data is often presented in ways that feel difficult to explore.", solution: "A fictional responsive interface concept that makes patterns inviting without hiding their meaning.", team: "Demo team · names not provided" }
];
let projectFilter = "all";

function renderProjects() {
  const query = $("#projectSearch").value.trim().toLowerCase();
  const filtered = projects.filter((project) => (projectFilter === "all" || project.category === projectFilter)
    && `${project.title} ${project.category} ${project.tags.join(" ")} ${project.desc}`.toLowerCase().includes(query));
  $("#projectGrid").innerHTML = filtered.length ? filtered.map((project) => `
    <article class="project-card">
      <div class="project-image"><img src="${project.image}" alt="${project.alt}" loading="lazy"><span>${project.category}</span></div>
      <div class="project-content"><span class="card-kicker">DEMO CONCEPT</span><h3>${project.title}</h3><p>${project.desc}</p>
        <div class="project-stack">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div><button type="button" data-project="${escapeHTML(project.title)}">Explore the idea ↗</button>
      </div>
    </article>`).join("") : '<div class="empty-state">No demo projects match that search. Try another topic.</div>';
}

const resources = [
  { title: "A gentle introduction to machine learning", category: "AI", desc: "Build an intuition for models, data and the questions behind responsible machine learning.", href: "https://developers.google.com/machine-learning/crash-course" },
  { title: "Python for everybody", category: "Programming", desc: "A welcoming path through Python fundamentals and working with data.", href: "https://www.py4e.com/" },
  { title: "The web platform, explained", category: "Web", desc: "Understand how the browser, HTML, CSS and JavaScript fit together.", href: "https://developer.mozilla.org/en-US/docs/Learn" },
  { title: "Research: getting started", category: "Research", desc: "Learn how to search, read and evaluate scholarly literature.", href: "https://ieeexplore.ieee.org/Xplorehelp/overview-of-ieee-xplore" },
  { title: "Cybersecurity learning path", category: "Security", desc: "Explore foundational security concepts with free guided learning resources.", href: "https://www.cisa.gov/resources-tools/resources/cybersecurity-awareness-programs" },
  { title: "Getting started with Arduino", category: "Electronics", desc: "Discover electronics and prototyping through practical beginner projects.", href: "https://docs.arduino.cc/learn/" },
  { title: "Robotics: an introduction", category: "Robotics", desc: "Meet the ideas, tools and building blocks behind modern robotics.", href: "https://www.ros.org/" },
  { title: "IEEE TryEngineering", category: "Engineering", desc: "Explore engineering activities, resources and pathways for learners.", href: "https://tryengineering.org/" }
];
const savedResources = new Set(JSON.parse(localStorage.getItem("ieee-rrce-bookmarks") || "[]"));
let resourceFilter = "all";

function renderResources() {
  const query = $("#resourceSearch").value.trim().toLowerCase();
  const filtered = resources.filter((resource) => (resourceFilter === "all" || resource.category.includes(resourceFilter))
    && `${resource.title} ${resource.category} ${resource.desc}`.toLowerCase().includes(query));
  $("#resourceGrid").innerHTML = filtered.length ? filtered.map((resource) => {
    const saved = savedResources.has(resource.title);
    return `<article class="resource-card">
      <div class="resource-top"><span class="resource-category">${resource.category.toUpperCase()}</span><button class="bookmark-button${saved ? " saved" : ""}" type="button" data-bookmark="${escapeHTML(resource.title)}" aria-label="${saved ? "Remove bookmark" : "Bookmark"} ${escapeHTML(resource.title)}" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button></div>
      <h3>${resource.title}</h3><p>${resource.desc}</p><a href="${resource.href}" target="_blank" rel="noopener noreferrer">Open learning resource <span>↗</span></a>
    </article>`;
  }).join("") : '<div class="empty-state">No resources found. Try a broader search.</div>';
}

const galleryItems = [
  { title: "A room full of ideas", category: "workshops", label: "WORKSHOPS", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1100&q=85", alt: "Students collaborating around a table" },
  { title: "Code, coffee, create", category: "community", label: "COMMUNITY", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85", alt: "A diverse team sharing ideas at a laptop" },
  { title: "Make the invisible visible", category: "projects", label: "PROJECTS", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85", alt: "Close-up of a detailed electronics circuit board" },
  { title: "Build something together", category: "workshops", label: "WORKSHOPS", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85", alt: "People collaborating in a bright workshop" },
  { title: "Prototype, test, repeat", category: "projects", label: "PROJECTS", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=85", alt: "Engineer working on a technical prototype" },
  { title: "Good ideas find a team", category: "community", label: "COMMUNITY", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85", alt: "Team members meeting and sharing ideas" }
];
let lightboxIndex = 0;

function renderGallery() {
  $("#galleryGrid").innerHTML = galleryItems.map((item, index) => `
    <button class="gallery-item" type="button" data-gallery="${index}" data-category="${item.category}" aria-label="View ${item.title}">
      <img src="${item.image}" alt="${item.alt}" loading="lazy"><span class="gallery-caption"><span>${item.label} · ILLUSTRATIVE</span><b>${item.title}</b></span>
    </button>`).join("");
}

function openLightbox(index) {
  lightboxIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[lightboxIndex];
  $("#lightboxImage").src = item.image;
  $("#lightboxImage").alt = item.alt;
  $("#lightboxCaption").textContent = `${item.title} · Illustrative photography`;
  $("#lightboxDialog").showModal();
}

function openDetails(html) {
  $("#dialogContent").innerHTML = html;
  $("#contentDialog").showModal();
}

const eventDetails = (event) => {
  const safeTitle = escapeHTML(event.title);
  openDetails(`<div class="dialog-content"><span class="dialog-kicker">${escapeHTML(event.category)} · Demonstration event</span><h2>${safeTitle}</h2><p>${escapeHTML(event.desc)}</p><h4>Sample schedule</h4><ul><li>${escapeHTML(event.date)} at ${escapeHTML(event.time)}</li><li>${escapeHTML(event.venue)}</li></ul><p>This is illustrative event content. It is not a confirmed RRCE schedule, and no registration is being recorded.</p><button class="button button-primary" type="button" id="demoRegister">Got it <span>✓</span></button></div>`);
  $("#demoRegister").addEventListener("click", () => {
    $("#contentDialog").close();
    toast("Demo event details viewed. No registration was submitted.");
  });
};

const projectDetails = (project) => {
  openDetails(`<div class="dialog-content"><span class="dialog-kicker">${escapeHTML(project.category)} · Demonstration concept</span><h2>${escapeHTML(project.title)}</h2><p>${escapeHTML(project.desc)}</p><h4>Problem space</h4><p>${escapeHTML(project.problem)}</p><h4>Proposed direction</h4><p>${escapeHTML(project.solution)}</p><h4>Technologies</h4><p>${project.tags.map(escapeHTML).join(" · ")}</p><p>Team: ${escapeHTML(project.team)}. No repository or live demo is claimed for this concept.</p><button class="button button-outline" type="button" id="projectClose">Close details</button></div>`);
  $("#projectClose").addEventListener("click", () => $("#contentDialog").close());
};

const careerStages = {
  "Artificial Intelligence": ["Python fundamentals", "Maths for machine learning", "Build small ML models", "Explore neural networks", "Create an AI project", "Share your learning and research"],
  "Web Development": ["HTML & semantic structure", "CSS & responsive design", "JavaScript fundamentals", "Build with an API", "Explore a frontend framework", "Ship an accessible project"],
  "Cybersecurity": ["Networking fundamentals", "Linux & command line", "Web security basics", "Practice in legal learning labs", "Threat modelling & defence", "Document a security project"],
  "Robotics": ["Python or C++ fundamentals", "Electronics & sensors", "Control systems basics", "Robot simulation", "Build a small robot", "Explore ROS and autonomy"],
  "Data Science": ["Python & data structures", "Statistics fundamentals", "Data cleaning & visualization", "Machine learning basics", "Tell a story with a dataset", "Publish a reproducible project"],
  "Cloud Computing": ["Networking & Linux basics", "Choose a cloud fundamentals path", "Deploy a small web app", "Explore storage and databases", "Learn identity & security basics", "Automate a project deployment"]
};

const ideas = [
  { domain: "Artificial Intelligence", title: "Study Sprint Companion", problem: "Students can struggle to turn a broad topic into consistent, manageable practice.", solution: "Create a simple tool that turns a learner's own notes into a weekly study outline and self-check questions.", tech: "Python, basic NLP, a small web interface", outcome: "A testable learning prototype with clear limitations." },
  { domain: "Internet of Things", title: "Room Comfort Monitor", problem: "Temperature and light conditions in study areas are easy to overlook.", solution: "Prototype a sensor that displays simple environment readings over time.", tech: "Microcontroller, temperature sensor, JavaScript dashboard", outcome: "An understandable sensor-to-dashboard demonstration." },
  { domain: "Web Development", title: "Accessible Campus Resource Finder", problem: "New students may not know where useful learning spaces and resources are.", solution: "Build a keyboard-friendly directory with categories, search and clear location details.", tech: "HTML, CSS, JavaScript, local JSON data", outcome: "A responsive, accessible static prototype." },
  { domain: "Sustainability", title: "Waste Sorting Guide", problem: "People may be uncertain how to sort common recyclable materials.", solution: "Design a multilingual, visual guide that explains disposal choices and local caveats.", tech: "Web app, accessible illustrations, optional image classification", outcome: "A practical education prototype without claiming local policy accuracy." },
  { domain: "Robotics", title: "Line-Following Bot with a Twist", problem: "Basic robot builds can teach movement without a meaningful challenge.", solution: "Create a small line-following robot that adapts speed when it detects a turn or obstacle.", tech: "Microcontroller, IR sensors, motor driver, C++", outcome: "A hands-on control and sensor project." },
  { domain: "Artificial Intelligence", title: "Local Language Learning Cards", problem: "Technical vocabulary can be harder to learn across languages.", solution: "Prototype a community-editable set of verified bilingual engineering flashcards.", tech: "Web development, structured content, review workflow", outcome: "A useful learning resource with human-reviewed translations." }
];
let currentIdea = null;

function generateIdea() {
  const domain = $("#ideaDomain").value;
  const level = $("#ideaDifficulty").value;
  const available = ideas.filter((idea) => domain === "Surprise me" || idea.domain === domain);
  const lastTitle = currentIdea?.title;
  const options = available.filter((idea) => idea.title !== lastTitle);
  currentIdea = options[Math.floor(Math.random() * options.length)] || available[0];
  const difficultyNote = `Suggested level: ${level}. Scope the project to match your experience and available guidance.`;
  $("#ideaOutput").innerHTML = `<span class="resource-category">${escapeHTML(currentIdea.domain.toUpperCase())} · ${escapeHTML(level.toUpperCase())}</span><h4>${escapeHTML(currentIdea.title)}</h4><p><strong>Problem:</strong> ${escapeHTML(currentIdea.problem)}</p><p><strong>Approach:</strong> ${escapeHTML(currentIdea.solution)}</p><p><strong>Tools:</strong> ${escapeHTML(currentIdea.tech)}</p><p><strong>Outcome:</strong> ${escapeHTML(currentIdea.outcome)}</p><p>${escapeHTML(difficultyNote)}</p>`;
  $("#ideaOutput").classList.add("visible");
}

function initTools() {
  $("#careerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const domain = $("#careerDomain").value;
    if (!domain || !careerStages[domain]) return toast("Choose a technology domain first.", true);
    const stages = careerStages[domain];
    const level = $("#careerLevel").value;
    const output = $("#roadmapOutput");
    output.innerHTML = `<h4>${escapeHTML(domain)} · A starter roadmap</h4><p class="privacy-note">A suggested learning sequence for ${escapeHTML(level.toLowerCase())}; adapt it to your goals.</p><ol>${stages.map((stage) => `<li>${escapeHTML(stage)}</li>`).join("")}</ol><p class="privacy-note">Explore free resources in the Knowledge Hub below.</p>`;
    output.classList.add("visible");
    output.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  $("#ideaForm").addEventListener("submit", (event) => { event.preventDefault(); generateIdea(); });
  $("#anotherIdea").addEventListener("click", () => {
    if (!currentIdea) return generateIdea();
    generateIdea();
  });
  $("#copyIdea").addEventListener("click", async () => {
    if (!currentIdea) return toast("Generate an idea before copying it.", true);
    const text = `${currentIdea.title}\n${currentIdea.domain}\nProblem: ${currentIdea.problem}\nApproach: ${currentIdea.solution}\nTechnologies: ${currentIdea.tech}\nOutcome: ${currentIdea.outcome}`;
    try { await navigator.clipboard.writeText(text); toast("Project idea copied."); }
    catch { toast("Clipboard access is unavailable in this browser.", true); }
  });
  $("#saveIdea").addEventListener("click", () => {
    if (!currentIdea) return toast("Generate an idea before saving it.", true);
    try {
      const saved = JSON.parse(localStorage.getItem("ieee-rrce-saved-ideas") || "[]");
      if (!saved.some((idea) => idea.title === currentIdea.title)) saved.push(currentIdea);
      localStorage.setItem("ieee-rrce-saved-ideas", JSON.stringify(saved));
      toast("Idea saved in this browser.");
    } catch { toast("Unable to save in this browser.", true); }
  });

  const collabList = $("#collabList");
  function renderCollabs() {
    let posts = [];
    try { posts = JSON.parse(localStorage.getItem("ieee-rrce-collabs") || "[]"); } catch { posts = []; }
    if (!posts.length) {
      collabList.innerHTML = '<div class="collab-empty">No demo posts yet. Add the first idea.</div>';
      return;
    }
    collabList.innerHTML = posts.slice(0, 3).map((post) => `<div class="collab-item"><b>${escapeHTML(post.title)}</b><span>Looking for: ${escapeHTML(post.skills)}</span></div>`).join("");
  }
  renderCollabs();
  $("#collabForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const post = { title: $("#collabTitle").value.trim(), skills: $("#collabSkills").value.trim() };
    if (!post.title || !post.skills) return toast("Add a project idea and the skills you need.", true);
    try {
      const posts = JSON.parse(localStorage.getItem("ieee-rrce-collabs") || "[]");
      posts.unshift(post);
      localStorage.setItem("ieee-rrce-collabs", JSON.stringify(posts.slice(0, 10)));
      event.target.reset();
      renderCollabs();
      toast("Demo opportunity posted to this browser.");
    } catch { toast("Unable to save the demo post in this browser.", true); }
  });
}

const domainDetails = {
  "Artificial Intelligence": { intro: "Build systems that can recognize patterns, learn from examples and support thoughtful decisions.", projects: "Study Sprint Companion · Local Language Learning Cards", resources: "Python for Everybody · Google ML Crash Course", workshop: "AI & ML: First Steps (sample event)" },
  "Robotics": { intro: "Bring software, electronics and the physical world together through motion, sensing and control.", projects: "Line-Following Bot · Robotics Innovation Sprint", resources: "ROS · Arduino Learning", workshop: "Robotics Innovation Sprint (sample event)" },
  "Internet of Things": { intro: "Connect sensors and everyday objects to meaningful data, useful services and responsible systems.", projects: "AquaSense · Room Comfort Monitor", resources: "Arduino Learning · The Web Platform, Explained", workshop: "Signals, Sensors & Smart Things (sample event)" },
  "Cybersecurity": { intro: "Learn how to design, operate and protect digital systems with care and a defender's mindset.", projects: "Accessible Resource Finder security review", resources: "CISA Cybersecurity Awareness · IEEE Xplore", workshop: "Security learning sessions (check with the branch)" },
  "Space Technology": { intro: "Explore the engineering of spacecraft, satellite communications, remote sensing and life beyond Earth.", projects: "Satellite image learning dashboard (idea prompt)", resources: "NASA STEM Engagement · IEEE Xplore", workshop: "Space technology sessions (check with the branch)" },
  "Sustainable Technology": { intro: "Use engineering to make systems more resource-aware, resilient and considerate of the planet.", projects: "Campus Energy Lens · Waste Sorting Guide", resources: "IEEE Power & Energy Society · TryEngineering", workshop: "Design for a Greener Grid (sample event)" }
};

function initDialogsAndMaps() {
  $$(".dialog-close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
  [$("#contentDialog"), $("#lightboxDialog")].forEach((dialog) => dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  }));
  $("#eventGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-event]");
    if (button) eventDetails(events.find((item) => item.title === button.dataset.event));
  });
  $("#projectGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-project]");
    if (button) projectDetails(projects.find((item) => item.title === button.dataset.project));
  });
  $$(".domain-node").forEach((button) => button.addEventListener("click", () => {
    const domain = button.dataset.domain;
    const detail = domainDetails[domain];
    $$(".domain-node").forEach((node) => node.classList.toggle("selected", node === button));
    $("#labSelection").classList.add("has-selection");
    $("#labSelection").innerHTML = `<span class="lab-selection-icon">${button.querySelector("span").textContent}</span><div><b>${escapeHTML(domain)}</b><small>${escapeHTML(detail.intro)}</small></div>`;
    openDetails(`<div class="dialog-content"><span class="dialog-kicker">Future Lab · Explore a domain</span><h2>${escapeHTML(domain)}</h2><p>${escapeHTML(detail.intro)}</p><h4>Related project prompts</h4><p>${escapeHTML(detail.projects)}</p><h4>Start learning</h4><p>${escapeHTML(detail.resources)}</p><h4>Workshop radar</h4><p>${escapeHTML(detail.workshop)}</p><button class="button button-outline" type="button" id="domainKnowledge">Explore Knowledge Hub</button></div>`);
    $("#domainKnowledge").addEventListener("click", () => {
      $("#contentDialog").close();
      $("#knowledge").scrollIntoView({ behavior: "smooth" });
    });
  }));
  $("#galleryGrid").addEventListener("click", (event) => {
    const item = event.target.closest("[data-gallery]");
    if (item) openLightbox(Number(item.dataset.gallery));
  });
  $("#lightboxDialog .lightbox-prev").addEventListener("click", () => openLightbox(lightboxIndex - 1));
  $("#lightboxDialog .lightbox-next").addEventListener("click", () => openLightbox(lightboxIndex + 1));
  $("#galleryFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    setActiveFilter("#galleryFilters", button);
    $$(".gallery-item").forEach((item) => { item.hidden = button.dataset.filter !== "all" && item.dataset.category !== button.dataset.filter; });
  });
  $$(".map-point").forEach((button) => button.addEventListener("click", () => {
    const descriptions = {
      "Seminar Hall": "Illustrative pin: check the official RRCE campus map for verified location details.",
      "Innovation Lab": "Illustrative pin only; lab availability and location have not been verified."
    };
    $("#mapTooltip").textContent = `${button.dataset.location}: ${descriptions[button.dataset.location]}`;
    toast(`${button.dataset.location} is an illustrative map location.`);
  }));
}

function setActiveFilter(container, button) {
  $$(".filter-pill", $(container)).forEach((item) => item.classList.toggle("active", item === button));
}

function initFilters() {
  $("#eventFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    eventFilter = button.dataset.filter;
    setActiveFilter("#eventFilters", button);
    renderEvents();
  });
  $("#eventSearch").addEventListener("input", renderEvents);
  $("#projectFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    projectFilter = button.dataset.filter;
    setActiveFilter("#projectFilters", button);
    renderProjects();
  });
  $("#projectSearch").addEventListener("input", renderProjects);
  $("#resourceFilters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    resourceFilter = button.dataset.filter;
    setActiveFilter("#resourceFilters", button);
    renderResources();
  });
  $("#resourceSearch").addEventListener("input", renderResources);
  $("#resourceGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-bookmark]");
    if (!button) return;
    const title = button.dataset.bookmark;
    if (savedResources.has(title)) savedResources.delete(title);
    else savedResources.add(title);
    localStorage.setItem("ieee-rrce-bookmarks", JSON.stringify([...savedResources]));
    renderResources();
    toast(savedResources.has(title) ? "Resource bookmarked in this browser." : "Bookmark removed.");
  });
}

function initForms() {
  $("#membershipForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.reset();
    toast("Thanks for your interest! This demo didn't transmit your information. Contact the branch to follow up.");
  });
  $("#contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.reset();
    toast("Message validated in this demo. It was not sent or stored.");
  });
  $("#idForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const name = $("#idName").value.trim();
    const department = $("#idDepartment").value.trim();
    $("#idCardName").textContent = name;
    $("#idCardDepartment").textContent = department;
    $("#idCardYear").textContent = $("#idYear").value;
    $("#idMonogram").textContent = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    $("#idCard").hidden = false;
    const qr = $("#qrCode");
    qr.replaceChildren();
    if (window.QRCode) new QRCode(qr, { text: `IEEE RRCE demo ID · ${name} · ${department}`, width: 50, height: 50, colorDark: "#07152f", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    else qr.textContent = "DEMO";
    toast("Demonstration ID created in this browser; it is not an IEEE credential.");
  });
  $("#printId").addEventListener("click", () => window.print());
  $("#certificateForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    $("#certificateStudent").textContent = $("#certificateName").value.trim();
    $("#certificateEventName").textContent = $("#certificateEvent").value;
    $("#certificatePreview").hidden = false;
    $("#printCertificate").hidden = false;
    $("#certificatePreview").scrollIntoView({ behavior: "smooth", block: "nearest" });
    toast("Sample certificate preview generated. It is not proof of event participation.");
  });
  $("#printCertificate").addEventListener("click", () => window.print());
}

const assistantResponses = [
  { test: /what is ieee|about ieee|ieee mean/, answer: "IEEE is the world's largest technical professional organization. It advances technology through communities, education, publications and standards. Start at the About section or visit IEEE.org." },
  { test: /join|membership|how.*join/, answer: "Use the interest form in the Join section to express interest in the IEEE RRCE community. This prototype does not create official IEEE membership; please confirm membership steps with the branch." },
  { test: /event|workshop|coming|hackathon/, answer: "The Events section has sample workshops, talks and competitions with filters. These dates are demonstration content, not a confirmed RRCE schedule." },
  { test: /chapter|societ|community/, answer: "Explore IEEE Computer Society, Power & Energy, Robotics & Automation, Women in Engineering, Communications and Signal Processing. The cards describe IEEE communities, not verified active RRCE chapters." },
  { test: /project|idea/, answer: "Visit Projects for demo concepts, or open the Innovation Toolkit and generate a project idea. All displayed project examples are illustrative." },
  { test: /career|roadmap|learn|skill/, answer: "The Career Path Finder makes a starter roadmap for AI, web development, cybersecurity, robotics, data science or cloud computing. The Knowledge Hub links to free learning resources." },
  { test: /benefit|why ieee/, answer: "IEEE can connect students with technical communities, learning resources, publications, events and a global network. Explore what is relevant to your goals and verify local opportunities with the branch." },
  { test: /where|resource|knowledge|paper/, answer: "The Knowledge Hub includes links for AI, programming, web development, research, cybersecurity, electronics and robotics. You can search topics and bookmark resources in this browser." },
  { test: /team|contact|email/, answer: "The Team and Contact sections show roles and college information without inventing personal contact details. Ask the college or branch for verified IEEE contact channels." },
  { test: /voice|navigate/, answer: "Try the Voice button for commands like “open events,” “show projects,” or “open knowledge hub” where your browser supports speech recognition." }
];

function assistantReply(message) {
  const normalized = message.toLowerCase();
  if (/show events|open events/.test(normalized)) {
    $("#events").scrollIntoView({ behavior: "smooth" });
    return "Here are the sample events. Their dates are demonstration content, not a confirmed schedule.";
  }
  if (/show projects|open projects/.test(normalized)) {
    $("#projects").scrollIntoView({ behavior: "smooth" });
    return "I've taken you to the project showcase. The projects are illustrative demo concepts.";
  }
  if (/open knowledge|knowledge hub/.test(normalized)) {
    $("#knowledge").scrollIntoView({ behavior: "smooth" });
    return "Here's the Knowledge Hub. Search a topic or bookmark a resource for later.";
  }
  if (/open about|about section/.test(normalized)) {
    $("#about").scrollIntoView({ behavior: "smooth" });
    return "Here's a little more about IEEE and the RRCE student community.";
  }
  return assistantResponses.find((entry) => entry.test.test(normalized))?.answer
    || "I can help with IEEE, joining the community, sample events, technical chapters, projects, career paths or learning resources. Try one of the suggested questions.";
}

function initChat() {
  const launcher = $("#chatLauncher");
  const panel = $("#chatPanel");
  const input = $("#chatInput");
  const messages = $("#chatMessages");
  const setOpen = (open) => {
    panel.classList.toggle("open", open);
    panel.setAttribute("aria-hidden", String(!open));
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
  };
  launcher.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
  $("#chatClose").addEventListener("click", () => setOpen(false));
  function ask(message) {
    const text = message.trim().slice(0, 300);
    if (!text) return;
    const userBubble = document.createElement("div");
    userBubble.className = "chat-bubble user-bubble";
    userBubble.textContent = text;
    messages.append(userBubble);
    input.value = "";
    const typing = document.createElement("div");
    typing.className = "chat-bubble assistant-bubble";
    typing.textContent = "Thinking...";
    messages.append(typing);
    messages.scrollTop = messages.scrollHeight;
    window.setTimeout(() => {
      typing.textContent = assistantReply(text);
      messages.scrollTop = messages.scrollHeight;
    }, 420);
  }
  $("#chatForm").addEventListener("submit", (event) => { event.preventDefault(); ask(input.value); });
  $$(".suggested-questions button").forEach((button) => button.addEventListener("click", () => ask(button.textContent)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setOpen(false); });
}

function initVoice() {
  const button = $("#voiceButton");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    button.title = "Voice navigation is not supported in this browser. Use the site navigation.";
    button.addEventListener("click", () => toast("Voice recognition isn't supported here. Use the navigation links or chat assistant."));
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.addEventListener("start", () => { button.classList.add("listening"); button.setAttribute("aria-label", "Listening for a navigation command"); toast("Listening. Try “open events” or “show projects”."); });
  recognition.addEventListener("end", () => { button.classList.remove("listening"); button.setAttribute("aria-label", "Start voice navigation"); });
  recognition.addEventListener("error", (event) => toast(`Voice navigation: ${event.error}. You can use the navigation links instead.`, true));
  recognition.addEventListener("result", (event) => {
    const heard = event.results[0][0].transcript.toLowerCase();
    const destinations = [
      { match: /home/, id: "home", name: "Home" },
      { match: /about/, id: "about", name: "About" },
      { match: /event|workshop|hackathon/, id: "events", name: "Events" },
      { match: /project/, id: "projects", name: "Projects" },
      { match: /team/, id: "team", name: "Team" },
      { match: /contact/, id: "contact", name: "Contact" },
      { match: /knowledge|resource|learning/, id: "knowledge", name: "Knowledge Hub" }
    ];
    const destination = destinations.find((item) => item.match.test(heard));
    if (destination) {
      document.getElementById(destination.id).scrollIntoView({ behavior: "smooth" });
      toast(`Voice command: opening ${destination.name}.`);
    } else toast(`I heard “${heard}”, but couldn't match it. Try “open events” or use the navigation.`, true);
  });
  button.addEventListener("click", () => {
    try { recognition.start(); }
    catch { toast("Voice navigation is already listening. Please try again in a moment.", true); }
  });
}

function initCounters() {
  const counterObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    const started = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - started) / 900, 1);
      element.textContent = String(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    counterObserver.unobserve(element);
  }), { threshold: .6 });
  $$("[data-count]").forEach((element) => counterObserver.observe(element));
}

function init() {
  try {
    initPage();
    renderEvents();
    renderProjects();
    renderResources();
    renderGallery();
    initFilters();
    initTools();
    initDialogsAndMaps();
    initForms();
    initChat();
    initVoice();
    initCounters();
  } catch (error) {
    console.error("IEEE RRCE prototype could not initialize:", error);
    toast("Some interactive features could not start. Reload the page to try again.", true);
  }
}

document.addEventListener("DOMContentLoaded", init);


"use strict";

// 1. Select HTML elements
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const scrollProgress = document.getElementById("scrollProgress");

// 2. Dark and light theme
try {
  if (localStorage.getItem("portfolio-theme") === "light") {
    body.classList.add("light-theme");
  }
} catch (error) {
  console.log("Theme preference storage is unavailable.");
}

function updateThemeButton() {
  const isLight = body.classList.contains("light-theme");

  themeToggle.textContent = isLight ? "☾" : "☼";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-theme");

  try {
    localStorage.setItem(
      "portfolio-theme",
      body.classList.contains("light-theme") ? "light" : "dark"
    );
  } catch (error) {
    console.log("Could not save the theme preference.");
  }

  updateThemeButton();
});

// 3. Mobile navigation
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// 4. Scroll progress and active navigation
function handleScroll() {
  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = scrollable > 0
    ? (window.scrollY / scrollable) * 100
    : 0;

  scrollProgress.style.width = `${progress}%`;

  let currentSection = "home";

  document.querySelectorAll("main section[id]").forEach((section) => {
    if (window.scrollY >= section.offsetTop - 150) {
      currentSection = section.id;
    }
  });

  navItems.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${currentSection}`
    );
  });
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

// 5. Reveal elements when they enter the viewport
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
}

// 6. Animated statistics
if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.count);
        const suffix = element.dataset.suffix || "";
        const duration = 900;
        const start = performance.now();

        function animate(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          element.textContent =
            `${Math.round(target * eased)}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        }

        requestAnimationFrame(animate);
        observer.unobserve(element);
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll("[data-count]").forEach((element) => {
    countObserver.observe(element);
  });
} else {
  document.querySelectorAll("[data-count]").forEach((element) => {
    element.textContent =
      `${element.dataset.count}${element.dataset.suffix || ""}`;
  });
}

// 7. Project category filters
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      const matches =
        filter === "all" || card.dataset.category === filter;

      card.classList.toggle("hidden", !matches);
    });
  });
});

// 8. Project detail popup
const projectDetails = {
  TaskFlow: {
    description:
      "A task management concept designed to help people organise work and priorities.",
    goal:
      "Make everyday planning easier and reduce friction in common workflows.",
    next:
      "Add task creation, deadlines, browser storage, and completion statistics."
  },

  Weatherly: {
    description:
      "A weather dashboard concept focused on presenting conditions clearly.",
    goal:
      "Make everyday weather information easy to understand at a glance.",
    next:
      "Connect a real weather API and add location search and forecasts."
  },

  InsightBoard: {
    description:
      "A business analytics dashboard concept using illustrative data.",
    goal:
      "Help users understand key indicators and communicate insights.",
    next:
      "Use a verified dataset and add filters, KPIs, and business analysis."
  },

  BizQuiz: {
    description:
      "A short-form learning concept for practising business fundamentals.",
    goal:
      "Encourage active recall and make learning more engaging.",
    next:
      "Add real question sets, scoring, and progress tracking."
  }
};

const dialog = document.getElementById("projectDialog");

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projectDetails[button.dataset.project];

    if (!project) return;

    document.getElementById("dialogTitle").textContent =
      button.dataset.project;

    document.getElementById("dialogDescription").textContent =
      project.description;

    document.getElementById("dialogGoal").textContent =
      project.goal;

    document.getElementById("dialogNext").textContent =
      project.next;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      alert(`${button.dataset.project}\n\n${project.description}`);
    }
  });
});

document.getElementById("dialogClose").addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

document.getElementById("dialogContact").addEventListener("click", () => {
  dialog.close();

  document.getElementById("contact").scrollIntoView({
    behavior: "smooth"
  });
});

// 9. Contact form validation and email draft
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

// IMPORTANT: Replace this with your actual email address.
const recipientEmail = "vanitha.reddy@example.com";

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    formMessage.textContent =
      "Please complete all required fields correctly.";
    return;
  }

  const formData = new FormData(contactForm);

  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const topic = String(formData.get("topic"));
  const message = String(formData.get("message")).trim();

  const subject = encodeURIComponent(
    `${topic} - Portfolio message from ${name}`
  );

  const emailBody = encodeURIComponent(
    `Hello Vanitha,\n\n${message}\n\n` +
    `From: ${name}\nReply email: ${email}`
  );

  formMessage.textContent =
    "Opening your email application with a prepared draft.";

  window.location.href =
    `mailto:${recipientEmail}?subject=${subject}&body=${emailBody}`;
});

// 10. Automatic footer year
document.getElementById("year").textContent =
  new Date().getFullYear();

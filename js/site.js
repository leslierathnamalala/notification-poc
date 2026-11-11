(function () {
  var stories = [
    {
      pill: "Open",
      wa: "Ticket INC-1042 is open with the service desk.",
      tm: "No Teams message for this moment.",
      sla: "78%"
    },
    {
      pill: "In progress",
      wa: "Ticket INC-1042 moved to In progress.",
      tm: "The status change is configured for WhatsApp.",
      sla: "62%"
    },
    {
      pill: "SLA watch",
      wa: "A separate SLA notice can use the other medium.",
      tm: "Ticket INC-1042 is 30 minutes from its response target.",
      sla: "28%"
    }
  ];

  var index = 0;
  var pill = document.getElementById("heroPill");
  var wa = document.getElementById("heroWa");
  var tm = document.getElementById("heroTm");
  var sla = document.getElementById("heroSla");

  function showStory(i) {
    var story = stories[i];
    pill.textContent = story.pill;
    wa.textContent = story.wa;
    tm.textContent = story.tm;
    sla.style.width = story.sla;
    sla.style.background = story.sla === "28%" ? "#8a4b12" : "#1b7a45";
    [wa, tm].forEach(function (node) {
      node.classList.remove("arrive");
      void node.offsetWidth;
      node.classList.add("arrive");
    });
  }

  if (pill && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(function () {
      index = (index + 1) % stories.length;
      showStory(index);
    }, 3200);
  }

  var state = {
    status: { tenant: true, user: true, channel: "whatsapp" },
    sla: { tenant: true, user: true, channel: "teams" }
  };
  var action = "status";
  var copy = {
    status: {
      whatsapp: ["WhatsApp · ticket status changed", "Ticket INC-1042 moved to In progress."],
      teams: ["Teams · ticket status changed", "Ticket INC-1042 moved to In progress."]
    },
    sla: {
      whatsapp: ["WhatsApp · SLA clock", "Ticket INC-1042 is 30 minutes from its response target."],
      teams: ["Teams · SLA clock", "Ticket INC-1042 is 30 minutes from its response target."]
    }
  };

  var kicker = document.getElementById("previewKicker");
  var card = document.getElementById("previewCard");
  var title = document.getElementById("previewTitle");
  var body = document.getElementById("previewBody");
  var tenantInput = document.querySelector('[data-key="tenant"]');
  var userInput = document.querySelector('[data-key="user"]');

  function render() {
    var current = state[action];
    tenantInput.checked = current.tenant;
    userInput.checked = current.user;
    document.querySelectorAll("[data-channel]").forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-channel") === current.channel));
    });
    card.classList.remove("wa", "tm", "quiet", "arrive");
    if (!current.tenant) {
      kicker.textContent = "Held by the tenant";
      title.textContent = "No notification is sent";
      body.textContent = "This action is turned off for the whole tenant.";
      card.classList.add("quiet");
    } else if (!current.user) {
      kicker.textContent = "Held for this user";
      title.textContent = "This person stays quiet";
      body.textContent = "The tenant allows the notification. This user has turned it off.";
      card.classList.add("quiet");
    } else {
      var line = copy[action][current.channel];
      kicker.textContent = line[0];
      title.textContent = current.channel === "whatsapp" ? "WhatsApp message" : "Teams chat";
      body.textContent = line[1];
      card.classList.add(current.channel === "whatsapp" ? "wa" : "tm");
    }
    void card.offsetWidth;
    card.classList.add("arrive");
  }

  document.querySelectorAll("[data-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      action = button.getAttribute("data-action");
      document.querySelectorAll("[data-action]").forEach(function (tab) {
        tab.setAttribute("aria-selected", String(tab === button));
      });
      render();
    });
  });

  tenantInput.addEventListener("change", function () {
    state[action].tenant = tenantInput.checked;
    render();
  });
  userInput.addEventListener("change", function () {
    state[action].user = userInput.checked;
    render();
  });
  document.querySelectorAll("[data-channel]").forEach(function (button) {
    button.addEventListener("click", function () {
      state[action].channel = button.getAttribute("data-channel");
      render();
    });
  });
  render();

  var revealNodes = document.querySelectorAll(".reveal, #thread");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.28 });
    revealNodes.forEach(function (node) { observer.observe(node); });
  } else {
    revealNodes.forEach(function (node) { node.classList.add("is-in"); });
  }
})();

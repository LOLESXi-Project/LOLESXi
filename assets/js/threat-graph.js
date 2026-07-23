(function () {
  const container = document.getElementById("lolesxi-threat-graph");

  if (!container || typeof cytoscape === "undefined") return;

  const elements = window.LOLESXI_THREAT_GRAPH_DATA || [];
  const threatActorTypes = new Set(["actor", "malware"]);
  let selectedThreatActors = new Set();
  let currentMode = "overview";

  const typeColours = {
    actor: "#fb8500",
    malware: "#fd9e02",
    procedure: "#8ecae6",
    binary: "#219ebc",
    technique: "#126782",
    detection: "#ffb703",
    source: "#023047"
  };

  const cy = cytoscape({
    container,
    elements,
    textureOnViewport: true,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    motionBlur: false,
    wheelSensitivity: 0.16,
    minZoom: 0.18,
    maxZoom: 2.5,

    style: [
      {
        selector: "node",
        style: {
          label: "data(label)",
          "background-color": ele => typeColours[ele.data("type")] || "#777777",
          color: "#f8fafc",
          "text-outline-color": "#000000",
          "text-outline-width": 4,
          "font-size": 13,
          "font-weight": 800,
          "text-wrap": "wrap",
          "text-max-width": ele => ele.data("type") === "procedure" ? 130 : 105,
          width: ele => {
            if (threatActorTypes.has(ele.data("type"))) return 66;
            if (ele.data("type") === "procedure") return 138;
            if (ele.data("type") === "binary") return 72;
            return 58;
          },
          height: ele => {
            if (threatActorTypes.has(ele.data("type"))) return 66;
            if (ele.data("type") === "procedure") return 54;
            if (ele.data("type") === "binary") return 72;
            return 58;
          },
          "border-width": 2,
          "border-color": "rgba(255, 255, 255, 0.42)",
          "text-valign": "bottom",
          "text-margin-y": 9,
          "shadow-blur": 16,
          "shadow-color": ele => typeColours[ele.data("type")] || "#777777",
          "shadow-opacity": 0.24,
          "shadow-offset-x": 0,
          "shadow-offset-y": 0,
          "z-index": 10
        }
      },
      {
        selector: 'node[type="procedure"]',
        style: {
          shape: "round-rectangle"
        }
      },
      {
        selector: 'node[type="binary"]',
        style: {
          shape: "diamond",
          "font-size": 14
        }
      },
      {
        selector: 'node[type="technique"]',
        style: {
          shape: "hexagon"
        }
      },
      {
        selector: 'node[type="source"]',
        style: {
          shape: "tag",
          "border-color": "#8ecae6",
          "border-width": 3
        }
      },
      {
        selector: 'node[type="pulse"]',
        style: {
          label: "",
          shape: "ellipse",
          "background-color": "#ffffff",
          "background-opacity": 0,
          "border-color": "#ffffff",
          "border-width": 2,
          "border-opacity": 0,
          events: "no",
          "z-index": 1,
          width: 52,
          height: 52
        }
      },
      {
        selector: "edge",
        style: {
          width: 1.7,
          "line-color": "rgba(150, 150, 150, 0.58)",
          "target-arrow-color": "rgba(180, 180, 180, 0.74)",
          "target-arrow-shape": "triangle",
          "arrow-scale": 0.9,
          "curve-style": "bezier",
          "control-point-step-size": 40,
          label: "data(relationship)",
          "font-size": 9,
          "font-weight": 700,
          color: "#d4d4d4",
          "text-background-color": "#000000",
          "text-background-opacity": 0.84,
          "text-background-padding": 3,
          "text-rotation": "autorotate"
        }
      },
      { selector: ".faded", style: { opacity: 0.08, "text-opacity": 0.04 } },
      {
        selector: ".highlight",
        style: {
          "border-color": "#ffffff",
          "border-width": 4,
          opacity: 1,
          "shadow-opacity": 0.65,
          "shadow-blur": 24
        }
      },
      {
        selector: ".pulse-node",
        style: {
          "border-width": 4,
          "border-color": "#ffffff",
          "shadow-blur": 30,
          "shadow-opacity": 0.85
        }
      },
      {
        selector: ".pulse-edge",
        style: {
          "line-color": "#ffffff",
          "target-arrow-color": "#ffffff",
          width: 3.4,
          opacity: 1
        }
      }
    ],

    layout: {
      name: "preset",
      fit: true,
      padding: 46
    }
  });

  function resetClasses() {
    cy.elements().removeClass("faded highlight pulse-node pulse-edge");
    removePulseRings();
  }

  function getThreatActorNodes() {
    return cy.nodes().filter(node => threatActorTypes.has(node.data("type")));
  }

  function getActivityForActor(actorNode) {
    const taggedBinaries = actorNode.outgoers("edge[relationship='tagged binary']").targets();
    const directProcedures = actorNode.outgoers("edge[relationship='uses procedure']").targets();

    let activity = actorNode.union(actorNode.connectedEdges()).union(taggedBinaries).union(directProcedures);

    if (currentMode === "procedures") {
      const proceduresFromBinaries = taggedBinaries.outgoers("edge[relationship='contains procedure']").targets();
      const procedureEdges = proceduresFromBinaries.union(directProcedures).connectedEdges();
      const procedureNeighbours = procedureEdges.connectedNodes();

      activity = activity
        .union(proceduresFromBinaries)
        .union(procedureEdges)
        .union(procedureNeighbours);
    }

    return activity;
  }

  function buildThreatActorFilter() {
    const actorFilterContainer = document.getElementById("actor-filter-list");
    if (!actorFilterContainer) return;

    const actors = getThreatActorNodes().sort((a, b) => a.data("label").localeCompare(b.data("label")));
    selectedThreatActors = new Set(actors.map(actor => actor.id()));

    actorFilterContainer.innerHTML = actors.map(actor => {
      const binaryCount = actor.outgoers("edge[relationship='tagged binary']").targets().length;
      const procCount = actor.outgoers("edge[relationship='uses procedure']").targets().length;
      const count = binaryCount + procCount;

      return `
        <label>
          <span class="actor-name">
            <input type="checkbox" checked data-actor-id="${escapeHtml(actor.id())}">
            ${escapeHtml(actor.data("label"))}
          </span>
          <span class="actor-count">${count}</span>
        </label>
      `;
    }).join("");

    actorFilterContainer.querySelectorAll("input[data-actor-id]").forEach(input => {
      input.addEventListener("change", event => {
        const actorId = event.target.dataset.actorId;
        if (event.target.checked) selectedThreatActors.add(actorId);
        else selectedThreatActors.delete(actorId);
        applyThreatActorFilter();
      });
    });
  }

  function applyThreatActorFilter() {
    resetClasses();

    if (selectedThreatActors.size === 0) {
      cy.elements().hide();
      updateDetailsEmpty();
      return;
    }

    let visibleElements = cy.collection();

    selectedThreatActors.forEach(actorId => {
      const actorNode = cy.getElementById(actorId);
      if (actorNode && actorNode.nonempty()) visibleElements = visibleElements.union(getActivityForActor(actorNode));
    });

    cy.elements().hide();
    visibleElements.show();

    cy.nodes(":visible")
      .filter(node => threatActorTypes.has(node.data("type")) || node.data("isNew") === true)
      .addClass("pulse-node");

    applyTypeFilters(false);

    const visible = cy.elements(":visible");
    if (visible.length > 0) cy.animate({ fit: { eles: visible, padding: 62 }, duration: 280, easing: "ease-in-out" });
    updateMetrics();
  }

  function applyTypeFilters(refit = true) {
    const checkedTypes = Array.from(document.querySelectorAll("input[data-type]:checked")).map(input => input.dataset.type);

    cy.nodes(":visible").forEach(node => {
      if (!checkedTypes.includes(node.data("type"))) node.hide();
    });

    cy.edges().forEach(edge => {
      if (edge.source().visible() && edge.target().visible()) edge.show();
      else edge.hide();
    });

    if (refit) {
      const visible = cy.elements(":visible");
      if (visible.length > 0) cy.animate({ fit: { eles: visible, padding: 62 }, duration: 240, easing: "ease-in-out" });
    }

    updateMetrics();
  }

  function setMode(mode) {
    currentMode = mode;

    const showProcedureLayers = mode === "procedures";

    document.querySelectorAll("input[data-type]").forEach(input => {
      if (["procedure", "technique", "detection", "source"].includes(input.dataset.type)) {
        input.checked = showProcedureLayers;
      } else {
        input.checked = true;
      }
    });

    applyThreatActorFilter();
    updateDetailsDefault();
  }

  function focusNodeById(id) {
    resetClasses();

    const node = cy.getElementById(id);
    if (!node || node.empty()) return;

    if (!node.visible()) node.show();

    let neighbourhood = node.closedNeighborhood().filter(ele => {
      if (ele.isNode()) return ele.visible();
      return ele.source().visible() && ele.target().visible();
    });

    if (node.data("type") === "binary" && currentMode === "procedures") {
      const procedures = node.outgoers("edge[relationship='contains procedure']").targets();
      neighbourhood = neighbourhood
        .union(procedures)
        .union(procedures.connectedEdges())
        .union(procedures.connectedEdges().connectedNodes());
    }

    cy.elements(":visible").addClass("faded");
    neighbourhood.removeClass("faded").addClass("highlight");
    neighbourhood.nodes().addClass("pulse-node");
    neighbourhood.edges().addClass("pulse-edge");

    cy.animate({ fit: { eles: neighbourhood, padding: 82 }, duration: 360, easing: "ease-in-out" });
    showDetails(node);
  }

  function relationshipPills(node) {
    return node.connectedEdges(":visible").map(edge => {
      const other = edge.source().id() === node.id() ? edge.target() : edge.source();
      if (!other.visible()) return "";
      return `<span class="pill">${escapeHtml(edge.data("relationship"))} → ${escapeHtml(other.data("label"))}</span>`;
    }).join("");
  }

  function showDetails(node) {
    const d = node.data();
    const typeLabel = d.type === "malware" ? "threat group" : (d.type || "node").replace("_", " ");
    const connected = relationshipPills(node);

    const lolesxiButton = d.lolesxiUrl ? `
      <a class="action-link" href="${escapeAttribute(d.lolesxiUrl)}" target="_blank" rel="noopener noreferrer">
        Open LOLESXi binary / procedure page
      </a>` : "";

    const sourceButton = d.sourceUrl ? `
      <a class="action-link" href="${escapeAttribute(d.sourceUrl)}" target="_blank" rel="noopener noreferrer">
        Open source report
      </a>` : "";

    document.getElementById("graph-details").innerHTML = `
      <div class="detail-card">
        <span class="node-type">${escapeHtml(typeLabel)}</span>
        <h2>${escapeHtml(d.label)}</h2>
        <p>${escapeHtml(d.description || "No description available.")}</p>

        ${d.sourceTag ? detailRow("Source tag", d.sourceTag) : ""}
        ${d.tagPrefix ? detailRow("Tag prefix", d.tagPrefix) : ""}
        ${d.sourceTags ? detailRow("Threat tags", d.sourceTags) : ""}
        ${d.category ? detailRow("Category", d.category) : ""}
        ${d.confidence ? detailRow("Confidence", d.confidence) : ""}
        ${d.lolesxi ? detailRow("LOLESXi", d.lolesxi) : ""}
        ${d.telemetry ? detailRow("Telemetry", d.telemetry) : ""}
        ${d.tactic ? detailRow("Tactic", d.tactic) : ""}
        ${d.mitreId ? detailRow("ATT&CK", d.mitreId) : ""}
        ${d.command ? detailRow("Command", d.command) : ""}
        ${d.privileges ? detailRow("Privileges", d.privileges) : ""}
        ${d.firstSeen ? detailRow("First seen", d.firstSeen) : ""}
        ${d.lastSeen ? detailRow("Last seen", d.lastSeen) : ""}
        ${d.isNew ? detailRow("Status", "Pulsing via graph:new tag") : ""}

        ${lolesxiButton}
        ${sourceButton}
      </div>

      <div class="detail-card">
        <p class="panel-title">Relationships</p>
        ${connected || '<p class="empty-state">No visible relationships.</p>'}
      </div>
    `;
  }

  function detailRow(label, value) {
    return `<div class="kv"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>`;
  }

  function updateDetailsDefault() {
    const details = document.getElementById("graph-details");
    if (!details) return;

    details.innerHTML = `
      <div class="detail-card">
        <span class="node-type">Selected node</span>
        <h2>Click a node</h2>
        <p>
          Select a tag-derived threat group, LOLESXi binary, procedure,
          ATT&CK technique, detection, or source to inspect relationships.
        </p>
      </div>
    `;
  }

  function updateDetailsEmpty() {
    const details = document.getElementById("graph-details");
    if (!details) return;

    details.innerHTML = `
      <div class="detail-card">
        <span class="node-type">No threat group selected</span>
        <h2>No activity visible</h2>
        <p>Select one or more threat groups to show their associated LOLESXi entries.</p>
      </div>
    `;
  }

  function updateMetrics() {
    const visibleNodes = cy.nodes(":visible").filter(node => node.data("type") !== "pulse");
    const visibleEdges = cy.edges(":visible");

    setText("metric-nodes", visibleNodes.length);
    setText("metric-edges", visibleEdges.length);
    setText("metric-procedures", visibleNodes.filter(node => node.data("type") === "procedure").length);
    setText("metric-binaries", visibleNodes.filter(node => node.data("type") === "binary").length);
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  function resolveBinaryNodeId(binaryName) {
    const target = String(binaryName || "").toLowerCase();
    const match = cy.nodes().filter(node =>
      node.data("type") === "binary" &&
      String(node.data("label") || "").toLowerCase() === target
    )[0];
    return match ? match.id() : "";
  }

  function removePulseRings() {
    cy.nodes('[type="pulse"]').remove();
  }

  function addPulseRingForNode(node, index) {
    if (!node || node.empty() || !node.visible()) return;

    const ringId = `pulse-ring:${node.id()}:${Date.now()}:${index}`;
    const position = node.position();
    const size = Math.max(Number(node.width()) || 48, Number(node.height()) || 48) + 12;

    const ring = cy.add({
      group: "nodes",
      data: { id: ringId, type: "pulse", parentNodeId: node.id() },
      position: { x: position.x, y: position.y }
    });

    ring.style({
      width: size,
      height: size,
      "border-opacity": 0.72,
      "border-width": 2,
      "border-color": typeColours[node.data("type")] || "#ffffff",
      "background-opacity": 0,
      opacity: 0.72
    });

    ring.animate(
      { style: { width: size * 2.55, height: size * 2.55, opacity: 0, "border-opacity": 0, "border-width": 1 } },
      { duration: 1200, easing: "ease-out", complete: () => { if (ring && ring.nonempty()) ring.remove(); } }
    );
  }

  function startVirusTotalStylePulse() {
    setInterval(() => {
      const pulseNodes = cy.nodes(":visible").filter(node =>
        node.data("type") !== "pulse" && node.hasClass("pulse-node")
      );

      pulseNodes.forEach((node, index) => addPulseRingForNode(node, index));
    }, 1150);
  }

  cy.on("pan zoom resize", removePulseRings);

  cy.on("drag position", "node", event => {
    const node = event.target;
    if (node.data("type") === "pulse") return;

    cy.nodes('[type="pulse"]').filter(ring =>
      ring.data("parentNodeId") === node.id()
    ).positions(node.position());
  });

  cy.on("tap", "node", event => {
    const node = event.target;
    if (node.data("type") === "pulse") return;
    focusNodeById(node.id());
  });

  cy.on("tap", event => {
    if (event.target === cy) {
      resetClasses();
      cy.nodes(":visible").filter(node =>
        threatActorTypes.has(node.data("type")) || node.data("isNew") === true
      ).addClass("pulse-node");
      updateDetailsDefault();
    }
  });

  document.getElementById("view-overview")?.addEventListener("click", () => setMode("overview"));
  document.getElementById("view-procedure-map")?.addEventListener("click", () => setMode("procedures"));
  document.getElementById("view-esxcli")?.addEventListener("click", () => {
    setMode("procedures");
    setTimeout(() => focusNodeById(resolveBinaryNodeId("esxcli")), 120);
  });
  document.getElementById("view-vim-cmd")?.addEventListener("click", () => {
    setMode("procedures");
    setTimeout(() => focusNodeById(resolveBinaryNodeId("vim-cmd")), 120);
  });

  document.getElementById("select-all-actors")?.addEventListener("click", () => {
    selectedThreatActors.clear();
    document.querySelectorAll("input[data-actor-id]").forEach(input => {
      input.checked = true;
      selectedThreatActors.add(input.dataset.actorId);
    });
    applyThreatActorFilter();
  });

  document.getElementById("clear-all-actors")?.addEventListener("click", () => {
    document.querySelectorAll("input[data-actor-id]").forEach(input => input.checked = false);
    selectedThreatActors.clear();
    applyThreatActorFilter();
  });

  document.querySelectorAll("input[data-type]").forEach(input => {
    input.addEventListener("change", () => applyThreatActorFilter());
  });

  buildThreatActorFilter();
  setMode("overview");
  updateDetailsDefault();
  startVirusTotalStylePulse();

  window.addEventListener("resize", () => {
    const visible = cy.elements(":visible");
    if (visible.length > 0) cy.fit(visible, 62);
  });
})();

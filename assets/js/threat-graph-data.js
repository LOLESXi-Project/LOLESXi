/*
  LOLESXi Threat Procedure Graph Data
  Runtime API version.

  This avoids relying on Jekyll/Liquid collection rendering inside JS files.
  It loads the existing public API:
    /api/lolesxi.json

  It supports both tag formats:
    "E-Crime: RansomHouse"
    { "E-Crime": "RansomHouse" }
*/

(function () {
  const THREAT_ACTIVITY_TAG_PREFIXES = [
    "E-Crime",
    "APT",
    "Ransomware",
    "Malware",
    "Actor",
    "Threat Actor",
    "Group"
  ];

  const tacticByTechniquePrefix = {
    T1082: "Discovery",
    T1083: "Discovery",
    T1057: "Discovery",
    T1007: "Discovery",
    T1049: "Discovery",
    T1016: "Discovery",
    T1087: "Discovery",
    T1489: "Impact",
    T1490: "Impact",
    T1491: "Impact",
    T1486: "Impact",
    T1529: "Impact",
    T1562: "Defense Evasion",
    T1070: "Defense Evasion",
    T1222: "Defense Evasion",
    T1547: "Persistence",
    T1505: "Persistence",
    T1059: "Execution",
    T1105: "Command and Control",
    T1090: "Command and Control"
  };

  function apiUrl() {
    const scriptSource = document.querySelector("script[src*='threat-graph-data.js']")?.src || "";
    const base = scriptSource.replace(/\/assets\/js\/threat-graph-data\.js.*$/, "");
    return `${base}/api/lolesxi.json`;
  }

  async function loadLolesxiApi() {
    const url = apiUrl();
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Unable to load ${url}: HTTP ${response.status}`);
    }

    return response.json();
  }

  function normaliseArray(value) {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.flatMap(item => normaliseArray(item)).filter(Boolean);
    }

    if (typeof value === "object") {
      return [value];
    }

    return String(value)
      .split(/[,;\n]/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  function tagObjectToString(tag) {
    if (!tag) return "";

    if (typeof tag === "string") {
      return tag.trim();
    }

    if (typeof tag === "object") {
      const entries = Object.entries(tag);
      if (entries.length === 0) return "";

      const [key, value] = entries[0];
      if (value === undefined || value === null || value === "") return "";

      return `${String(key).trim()}: ${String(value).trim()}`;
    }

    return String(tag).trim();
  }

  function splitThreatActivityTag(tag) {
    const value = tagObjectToString(tag);
    if (!value) return null;

    const match = value.match(/^([^:]+)\s*:\s*(.+)$/);
    if (!match) return null;

    const prefix = match[1].trim();
    const name = match[2].trim();

    const isThreatPrefix = THREAT_ACTIVITY_TAG_PREFIXES.some(
      allowedPrefix => allowedPrefix.toLowerCase() === prefix.toLowerCase()
    );

    if (!isThreatPrefix || !name) return null;

    return {
      prefix,
      name,
      rawTag: value,
      type: inferThreatNodeType(prefix, name)
    };
  }

  function isThreatActivityTag(tag) {
    return splitThreatActivityTag(tag) !== null;
  }

  function inferThreatNodeType(prefix, name) {
    const lowerPrefix = String(prefix || "").toLowerCase();
    const lowerName = String(name || "").toLowerCase();

    if (
      lowerPrefix === "ransomware" ||
      lowerPrefix === "malware" ||
      lowerPrefix === "e-crime" ||
      lowerName.includes("ransomware") ||
      lowerName.includes("raas")
    ) {
      return "malware";
    }

    return "actor";
  }

  function extractThreatActivityFromTags(tags) {
    const parsedTags = normaliseArray(tags)
      .map(splitThreatActivityTag)
      .filter(Boolean);

    const seen = new Set();

    return parsedTags.filter(activity => {
      const key = `${activity.prefix.toLowerCase()}|${activity.name.toLowerCase()}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  function firstMitreId(value) {
    const text = String(value || "");
    const match = text.match(/T\d{4}(?:\.\d{3})?/);
    return match ? match[0] : "";
  }

  function inferTactic(mitreId, techniqueName) {
    const id = firstMitreId(mitreId);
    const text = `${id} ${techniqueName || ""}`.toLowerCase();

    const matchingPrefix = Object.keys(tacticByTechniquePrefix).find(prefix => id.startsWith(prefix));
    if (matchingPrefix) return tacticByTechniquePrefix[matchingPrefix];

    if (text.includes("discovery")) return "Discovery";
    if (text.includes("impair") || text.includes("defense")) return "Defense Evasion";
    if (text.includes("stop") || text.includes("impact") || text.includes("encrypt")) return "Impact";
    if (text.includes("persistence") || text.includes("vib")) return "Persistence";
    if (text.includes("command") || text.includes("cli") || text.includes("execution")) return "Execution";
    if (text.includes("proxy") || text.includes("tunnel")) return "Command and Control";

    return "";
  }

  function procedureLabel(command, binary) {
    const category = String(command.Category || command.category || "").trim();
    if (category) return titleCase(category).slice(0, 56);

    const explicit = String(command.Name || command.name || command.Function || command.function || "").trim();
    if (explicit && explicit.toLowerCase() !== "procedure") return titleCase(explicit).slice(0, 56);

    const usecase = String(command.Usecase || command.usecase || command.Description || command.description || "").trim();
    if (usecase) return titleCase(usecase).replace(/\.$/, "").slice(0, 56);

    return `${binary} procedure`;
  }

  function titleCase(value) {
    return String(value || "")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  }

  function detectionNames(value) {
    return normaliseArray(value)
      .map(item => {
        if (typeof item === "object") {
          const entries = Object.entries(item);
          if (entries.length === 0) return "";

          const [type, link] = entries[0];
          return `${type}: ${link}`;
        }

        return String(item || "").trim();
      })
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }

  function sourceDisplayName(value) {
    let text = "";

    if (typeof value === "object" && value) {
      text = value.Link || value.link || value.URL || value.url || value.Name || value.name || "";
    } else {
      text = String(value || "");
    }

    text = String(text || "").trim();
    if (!text) return "";

    try {
      const url = new URL(text);
      return url.hostname.replace(/^www\./, "");
    } catch (_) {
      return text.length > 52 ? `${text.slice(0, 52)}...` : text;
    }
  }

  function sourceUrl(value) {
    let text = "";

    if (typeof value === "object" && value) {
      text = value.Link || value.link || value.URL || value.url || "";
    } else {
      text = String(value || "");
    }

    text = String(text || "").trim();
    return /^https?:\/\//i.test(text) ? text : "";
  }

  function safeId(prefix, value) {
    return `${prefix}:${String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120)}`;
  }

  function addNode(nodes, id, data, position) {
    if (!nodes.has(id)) {
      nodes.set(id, { data: { id, ...data }, position });
    } else {
      nodes.set(id, {
        ...nodes.get(id),
        data: {
          ...nodes.get(id).data,
          ...removeEmptyValues(data)
        }
      });
    }
  }

  function removeEmptyValues(object) {
    const output = {};

    Object.entries(object || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (Array.isArray(value) && value.length === 0) return;

      output[key] = value;
    });

    return output;
  }

  function addEdge(edges, source, target, relationship) {
    if (!source || !target || source === target) return;

    const id = safeId("edge", `${source}->${relationship}->${target}`);

    if (!edges.has(id)) {
      edges.set(id, {
        data: {
          id,
          source,
          target,
          relationship
        }
      });
    }
  }

  function lanePosition(layer, index) {
    const layerX = {
      actor: 140,
      binary: 520,
      procedure: 900,
      technique: 1240,
      detection: 1540,
      source: 1540
    };

    const maxRows = layer === "actor" ? 12 : layer === "procedure" ? 14 : 10;
    const col = Math.floor(index / maxRows);
    const row = index % maxRows;
    const colOffset = col * (layer === "actor" ? 155 : 125);
    const spacing = layer === "actor" ? 86 : 76;

    return {
      x: (layerX[layer] || 500) + colOffset,
      y: 90 + row * spacing
    };
  }

  function buildGraphElements(entries) {
    const nodes = new Map();
    const edges = new Map();

    const actorIndex = new Map();
    const procedureIndex = new Map();
    const binaryIndex = new Map();
    const techniqueIndex = new Map();
    const detectionIndex = new Map();
    const sourceIndex = new Map();

    entries.forEach(entry => {
      const binary = String(entry.Name || entry.name || entry.title || "").trim();
      if (!binary) return;

      const binaryId = safeId("binary", binary);
      if (!binaryIndex.has(binaryId)) binaryIndex.set(binaryId, binaryIndex.size);

      addNode(
        nodes,
        binaryId,
        {
          label: binary,
          type: "binary",
          binaryType: entry.Type || entry.type || "Binaries",
          description: entry.Description || entry.description || `LOLESXi entry for ${binary}.`,
          lolesxiUrl: entry.url || entry.Url || entry.URL || ""
        },
        lanePosition("binary", binaryIndex.get(binaryId))
      );

      const entryTags = entry.Tags || entry.tags || [];
      const topLevelActivities = extractThreatActivityFromTags(entryTags);

      topLevelActivities.forEach(activity => {
        const actorId = safeId("actor", `${activity.prefix}:${activity.name}`);
        if (!actorIndex.has(actorId)) actorIndex.set(actorId, actorIndex.size);

        addNode(
          nodes,
          actorId,
          {
            label: activity.name,
            type: activity.type,
            sourceTag: activity.rawTag,
            tagPrefix: activity.prefix,
            description: `${activity.name} is linked to the LOLESXi binary entry through tag: ${activity.rawTag}.`
          },
          lanePosition("actor", actorIndex.get(actorId))
        );

        addEdge(edges, actorId, binaryId, "tagged binary");
      });

      const commands = Array.isArray(entry.Commands || entry.commands)
        ? (entry.Commands || entry.commands)
        : [];

      commands.forEach((command, commandIndex) => {
        const procedureName = procedureLabel(command, binary);
        const procedureId = safeId("procedure", `${binary}:${procedureName}:${commandIndex}`);

        if (!procedureIndex.has(procedureId)) procedureIndex.set(procedureId, procedureIndex.size);

        const commandTags = command.Tags || command.tags || [];
        const commandActivities = extractThreatActivityFromTags(commandTags);

        addNode(
          nodes,
          procedureId,
          {
            label: procedureName,
            type: "procedure",
            command: command.Command || command.command || "",
            description: command.Description || command.description || command.Usecase || command.usecase || "",
            usecase: command.Usecase || command.usecase || "",
            category: command.Category || command.category || "",
            confidence: command.Confidence || entry.Confidence || "",
            firstSeen: command.FirstSeen || entry.FirstSeen || "",
            lastSeen: command.LastSeen || entry.LastSeen || "",
            privileges: command.Privileges || command.privileges || "",
            operatingSystem: command.OperatingSystem || command.operatingSystem || "ESXi",
            telemetry: normaliseArray(command.Telemetry || command.telemetry || entry.Telemetry || entry.telemetry).join(", "),
            sourceTags: normaliseArray(commandTags).map(tagObjectToString).filter(isThreatActivityTag).join(", "),
            isNew: normaliseArray(commandTags).map(tagObjectToString).some(tag => /^graph:new$/i.test(String(tag).trim())),
            lolesxi: entry.url ? "Covered" : "",
            lolesxiUrl: entry.url || ""
          },
          lanePosition("procedure", procedureIndex.get(procedureId))
        );

        addEdge(edges, binaryId, procedureId, "contains procedure");

        commandActivities.forEach(activity => {
          const actorId = safeId("actor", `${activity.prefix}:${activity.name}`);
          if (!actorIndex.has(actorId)) actorIndex.set(actorId, actorIndex.size);

          addNode(
            nodes,
            actorId,
            {
              label: activity.name,
              type: activity.type,
              sourceTag: activity.rawTag,
              tagPrefix: activity.prefix,
              description: `${activity.name} is linked directly to this procedure through tag: ${activity.rawTag}.`
            },
            lanePosition("actor", actorIndex.get(actorId))
          );

          addEdge(edges, actorId, procedureId, "uses procedure");
        });

        const mitreId = firstMitreId(command.MitreID || command.MitreId || command.MITREID || command.mitreId);
        const techniqueLabel = command.MitreTechnique || command.Technique || command.technique || mitreId;

        if (mitreId || techniqueLabel) {
          const techniqueName = techniqueLabel && techniqueLabel !== mitreId
            ? `${techniqueLabel} (${mitreId})`
            : mitreId;

          const techniqueId = safeId("technique", techniqueName);
          if (!techniqueIndex.has(techniqueId)) techniqueIndex.set(techniqueId, techniqueIndex.size);

          addNode(
            nodes,
            techniqueId,
            {
              label: techniqueName,
              type: "technique",
              tactic: inferTactic(mitreId, techniqueLabel),
              mitreId,
              description: techniqueLabel || mitreId
            },
            lanePosition("technique", techniqueIndex.get(techniqueId))
          );

          addEdge(edges, procedureId, techniqueId, "maps to");
        }

        detectionNames(command.Detection || command.Detections || command.detections || []).forEach(name => {
          const detectionId = safeId("detection", name);
          if (!detectionIndex.has(detectionId)) detectionIndex.set(detectionId, detectionIndex.size);

          addNode(
            nodes,
            detectionId,
            {
              label: name.length > 58 ? `${name.slice(0, 58)}...` : name,
              type: "detection",
              description: `Detection reference linked to ${procedureName}.`
            },
            lanePosition("detection", detectionIndex.get(detectionId))
          );

          addEdge(edges, procedureId, detectionId, "detected by");
        });

        [
          ...normaliseArray(command.Resources || command.resources || []),
          ...normaliseArray(entry.Resources || entry.resources || [])
        ].forEach(source => {
          const name = sourceDisplayName(source);
          if (!name) return;

          const sourceId = safeId("source", name);
          if (!sourceIndex.has(sourceId)) sourceIndex.set(sourceId, sourceIndex.size);

          addNode(
            nodes,
            sourceId,
            {
              label: name,
              type: "source",
              sourceUrl: sourceUrl(source),
              description: `Source reporting linked to ${procedureName}.`
            },
            lanePosition("source", sourceIndex.get(sourceId))
          );

          addEdge(edges, procedureId, sourceId, "reported in");
        });
      });
    });

    return [...nodes.values(), ...edges.values()];
  }

  window.loadLOLESXIThreatGraphData = async function () {
    const entries = await loadLolesxiApi();
    const elements = buildGraphElements(entries);

    window.LOLESXI_THREAT_GRAPH_RAW = entries;
    window.LOLESXI_THREAT_GRAPH_DATA = elements;

    return elements;
  };
})();

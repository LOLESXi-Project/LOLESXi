---
layout: null
---

(function () {
  const rawEntries = [
    {% assign lolesxi_entries = site.lolesxi | sort: "Name" %}
    {% for item in lolesxi_entries %}
      {% assign binary_name = item.Name | default: item.title | default: item.name | default: item.basename %}
      {% assign binary_slug = binary_name | slugify %}
      {% assign binary_type = item.Type | default: item.type | default: "Binaries" %}

      {
        binary: {{ binary_name | jsonify }},
        binarySlug: {{ binary_slug | jsonify }},
        binaryType: {{ binary_type | jsonify }},
        binaryDescription: {{ item.Description | default: item.description | default: item.content | strip_html | strip_newlines | truncate: 220 | jsonify }},
        lolesxiUrl: {{ item.url | relative_url | jsonify }},
        topLevelTags: {{ item.Tags | default: item.tags | default: empty | jsonify }},
        topLevelResources: {{ item.Resources | default: item.resources | default: empty | jsonify }},
        topLevelDetections: {{ item.Detection | default: item.Detections | default: item.detection | default: item.detections | default: empty | jsonify }},

        commands: [
          {% for cmd in item.Commands %}
            {
              procedureName: {{ cmd.Name | default: cmd.name | default: cmd.Category | default: cmd.category | default: cmd.Function | default: cmd.function | default: cmd.Usecase | default: "Procedure" | jsonify }},
              command: {{ cmd.Command | default: cmd.command | default: "" | jsonify }},
              usecase: {{ cmd.Usecase | default: cmd.usecase | default: cmd.Description | default: cmd.description | default: "" | jsonify }},
              description: {{ cmd.Description | default: cmd.description | default: cmd.Usecase | default: cmd.usecase | default: "" | jsonify }},
              category: {{ cmd.Category | default: cmd.category | default: "" | jsonify }},
              privileges: {{ cmd.Privileges | default: cmd.privileges | default: cmd.Privilege | default: "" | jsonify }},
              operatingSystem: {{ cmd.OperatingSystem | default: cmd.OperatingSystems | default: cmd.operating_system | default: "ESXi" | jsonify }},
              mitreId: {{ cmd.MitreID | default: cmd.MitreId | default: cmd.MITREID | default: cmd.AttackID | default: cmd.attack_id | default: "" | jsonify }},
              mitreTechnique: {{ cmd.MitreTechnique | default: cmd.Technique | default: cmd.technique | default: "" | jsonify }},
              detections: {{ cmd.Detection | default: cmd.Detections | default: cmd.detections | default: empty | jsonify }},
              resources: {{ cmd.Resources | default: cmd.resources | default: empty | jsonify }},
              tags: {{ cmd.Tags | default: cmd.tags | default: empty | jsonify }},
              confidence: {{ cmd.Confidence | default: item.Confidence | default: "" | jsonify }},
              firstSeen: {{ cmd.FirstSeen | default: item.FirstSeen | default: "" | jsonify }},
              lastSeen: {{ cmd.LastSeen | default: item.LastSeen | default: "" | jsonify }},
              telemetry: {{ cmd.Telemetry | default: item.Telemetry | default: empty | jsonify }}
            }{% unless forloop.last %},{% endunless %}
          {% endfor %}
        ]
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];

  const DEFAULT_ACTOR = "Unattributed / Unknown";

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

  function normaliseArray(value) {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.flatMap(item => normaliseArray(item)).filter(Boolean);
    }

    if (typeof value === "object") {
      if (value.Link) return [String(value.Link)];
      if (value.link) return [String(value.link)];
      if (value.Path) return [String(value.Path)];
      if (value.path) return [String(value.path)];
      if (value.Name) return [String(value.Name)];
      if (value.name) return [String(value.name)];
      if (value.Value) return [String(value.Value)];
      if (value.value) return [String(value.value)];

      return Object.values(value).flatMap(item => normaliseArray(item)).filter(Boolean);
    }

    return String(value).split(/[,;\n]/).map(item => item.trim()).filter(Boolean);
  }

  function splitThreatActivityTag(tag) {
    const value = String(tag || "").trim();
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
    const parsedTags = normaliseArray(tags).map(splitThreatActivityTag).filter(Boolean);

    if (parsedTags.length === 0) {
      return [];
    }

    const seen = new Set();

    return parsedTags.filter(activity => {
      const key = `${activity.prefix.toLowerCase()}|${activity.name.toLowerCase()}`;
      if (seen.has(key)) return false;
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
    const category = String(command.category || "").trim();
    if (category) return titleCase(category).slice(0, 56);

    const explicit = String(command.procedureName || "").trim();
    if (explicit && explicit.toLowerCase() !== "procedure") return titleCase(explicit).slice(0, 56);

    const usecase = String(command.usecase || command.description || "").trim();
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
        const text = String(item).trim();
        if (/sigma/i.test(text)) return text.startsWith("Sigma") ? text : `Sigma: ${text}`;
        if (/elastic/i.test(text)) return text.startsWith("Elastic") ? text : `Elastic: ${text}`;
        if (/splunk/i.test(text)) return text.startsWith("Splunk") ? text : `Splunk: ${text}`;
        if (/sentinel|kql|microsoft/i.test(text)) return text;
        if (/yara/i.test(text)) return text;
        return text.length > 52 ? `${text.slice(0, 52)}...` : text;
      })
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }

  function sourceDisplayName(value) {
    const text = String(value || "").trim();
    if (!text) return "";

    try {
      const url = new URL(text);
      return url.hostname.replace(/^www\./, "");
    } catch (_) {
      return text.length > 52 ? `${text.slice(0, 52)}...` : text;
    }
  }

  function sourceUrl(value) {
    const text = String(value || "").trim();
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
        data: { ...nodes.get(id).data, ...removeEmptyValues(data) }
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
    if (!edges.has(id)) edges.set(id, { data: { id, source, target, relationship } });
  }

  function lanePosition(layer, index, count) {
    const layerX = {
      actor: 140,
      binary: 510,
      procedure: 880,
      technique: 1210,
      detection: 1510,
      source: 1510
    };

    const maxRows = layer === "actor" ? 12 : layer === "procedure" ? 14 : 10;
    const col = Math.floor(index / maxRows);
    const row = index % maxRows;
    const colOffset = col * (layer === "actor" ? 150 : 120);
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
      const binary = String(entry.binary || "").trim();
      if (!binary) return;

      const binaryId = safeId("binary", binary);
      if (!binaryIndex.has(binaryId)) binaryIndex.set(binaryId, binaryIndex.size);

      addNode(
        nodes,
        binaryId,
        {
          label: binary,
          type: "binary",
          binaryType: entry.binaryType || "Binaries",
          description: entry.binaryDescription || `LOLESXi entry for ${binary}.`,
          lolesxiUrl: entry.lolesxiUrl || ""
        },
        lanePosition("binary", binaryIndex.get(binaryId), binaryIndex.size)
      );

      const topLevelActivities = extractThreatActivityFromTags(entry.topLevelTags);

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
          lanePosition("actor", actorIndex.get(actorId), actorIndex.size)
        );

        addEdge(edges, actorId, binaryId, "tagged binary");
      });

      const commands = Array.isArray(entry.commands) && entry.commands.length > 0
        ? entry.commands
        : [{
            procedureName: binary,
            command: "",
            usecase: entry.binaryDescription || "",
            description: entry.binaryDescription || "",
            tags: []
          }];

      commands.forEach((command, commandIndex) => {
        const procedureName = procedureLabel(command, binary);
        const procedureId = safeId("procedure", `${binary}:${procedureName}:${commandIndex}`);

        if (!procedureIndex.has(procedureId)) procedureIndex.set(procedureId, procedureIndex.size);

        const commandActivities = extractThreatActivityFromTags(command.tags);

        addNode(
          nodes,
          procedureId,
          {
            label: procedureName,
            type: "procedure",
            command: command.command || "",
            description: command.description || command.usecase || "",
            usecase: command.usecase || "",
            category: command.category || "",
            confidence: command.confidence || "",
            firstSeen: command.firstSeen || "",
            lastSeen: command.lastSeen || "",
            privileges: command.privileges || "",
            operatingSystem: command.operatingSystem || "ESXi",
            telemetry: normaliseArray(command.telemetry).join(", "),
            sourceTags: normaliseArray(command.tags).filter(isThreatActivityTag).join(", "),
            isNew: normaliseArray(command.tags).some(tag => /^graph:new$/i.test(String(tag).trim())),
            lolesxi: entry.lolesxiUrl ? "Covered" : "",
            lolesxiUrl: entry.lolesxiUrl || ""
          },
          lanePosition("procedure", procedureIndex.get(procedureId), procedureIndex.size)
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
            lanePosition("actor", actorIndex.get(actorId), actorIndex.size)
          );

          addEdge(edges, actorId, procedureId, "uses procedure");
        });

        const mitreId = firstMitreId(command.mitreId);
        const techniqueLabel = command.mitreTechnique || mitreId;

        if (mitreId || techniqueLabel) {
          const techniqueName = techniqueLabel && techniqueLabel !== mitreId ? `${techniqueLabel} (${mitreId})` : mitreId;
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
            lanePosition("technique", techniqueIndex.get(techniqueId), techniqueIndex.size)
          );

          addEdge(edges, procedureId, techniqueId, "maps to");
        }

        detectionNames(command.detections).forEach(name => {
          const detectionId = safeId("detection", name);
          if (!detectionIndex.has(detectionId)) detectionIndex.set(detectionId, detectionIndex.size);

          addNode(nodes, detectionId, {
            label: name,
            type: "detection",
            description: `Detection reference linked to ${procedureName}.`
          }, lanePosition("detection", detectionIndex.get(detectionId), detectionIndex.size));

          addEdge(edges, procedureId, detectionId, "detected by");
        });

        const commandSources = [
          ...normaliseArray(command.resources),
          ...normaliseArray(entry.topLevelResources)
        ];

        commandSources.forEach(source => {
          const name = sourceDisplayName(source);
          if (!name) return;

          const sourceId = safeId("source", name);
          if (!sourceIndex.has(sourceId)) sourceIndex.set(sourceId, sourceIndex.size);

          addNode(nodes, sourceId, {
            label: name,
            type: "source",
            sourceUrl: sourceUrl(source),
            description: `Source reporting linked to ${procedureName}.`
          }, lanePosition("source", sourceIndex.get(sourceId), sourceIndex.size));

          addEdge(edges, procedureId, sourceId, "reported in");
        });
      });
    });

    return [...nodes.values(), ...edges.values()];
  }

  window.LOLESXI_THREAT_GRAPH_RAW = rawEntries;
  window.LOLESXI_THREAT_GRAPH_DATA = buildGraphElements(rawEntries);
})();

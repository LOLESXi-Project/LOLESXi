---
layout: null
---

/*
  LOLESXi Threat Procedure Graph Data
  ----------------------------------

  Source of truth for threat groups:
    LOLESXi Tags

  Recognised tag formats:
    APT: UNC3886
    E-Crime: Blackcat
    E-Crime: RansomHouse
    Ransomware: Akira
    Malware: ExampleFamily
    Actor: ExampleActor
    Threat Actor: ExampleActor
    Group: ExampleGroup

  Non-threat tags such as ESXi, Discovery, Impact, Persistence, etc. are ignored.
*/

(function () {
  const rawEntries = [
    {% assign lolesxi_entries = site.lolesxi | sort: "title" %}

    {% for item in lolesxi_entries %}
      {% assign binary_name = item.title | default: item.name | default: item.basename %}
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

        commands: [
          {% for cmd in item.Commands %}
            {
              procedureName: {{ cmd.Name | default: cmd.name | default: cmd.Function | default: cmd.function | default: cmd.Usecase | default: "Procedure" | jsonify }},
              command: {{ cmd.Command | default: cmd.command | default: "" | jsonify }},
              usecase: {{ cmd.Usecase | default: cmd.usecase | default: cmd.Description | default: cmd.description | default: "" | jsonify }},
              description: {{ cmd.Description | default: cmd.description | default: cmd.Usecase | default: cmd.usecase | default: "" | jsonify }},
              privileges: {{ cmd.Privileges | default: cmd.privileges | default: cmd.Privilege | default: "" | jsonify }},
              operatingSystem: {{ cmd.OperatingSystem | default: cmd.OperatingSystems | default: cmd.operating_system | default: "ESXi" | jsonify }},
              mitreId: {{ cmd.MitreID | default: cmd.MitreId | default: cmd.MITREID | default: cmd.AttackID | default: cmd.attack_id | default: "" | jsonify }},
              mitreTechnique: {{ cmd.MitreTechnique | default: cmd.Technique | default: cmd.technique | default: "" | jsonify }},
              detections: {{ cmd.Detection | default: cmd.Detections | default: cmd.detections | default: empty | jsonify }},
              resources: {{ cmd.Resources | default: cmd.resources | default: empty | jsonify }},
              tags: {{ cmd.Tags | default: cmd.tags | default: item.Tags | default: item.tags | default: empty | jsonify }},
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
    T1489: "Impact",
    T1490: "Impact",
    T1491: "Impact",
    T1486: "Impact",
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
      return value
        .flatMap(item => normaliseArray(item))
        .filter(Boolean);
    }

    if (typeof value === "object") {
      if (value.Name) return [String(value.Name)];
      if (value.name) return [String(value.name)];
      if (value.Title) return [String(value.Title)];
      if (value.title) return [String(value.title)];

      return Object.values(value)
        .flatMap(item => normaliseArray(item))
        .filter(Boolean);
    }

    return String(value)
      .split(/[,;\n]/)
      .map(item => item.trim())
      .filter(Boolean);
  }

  function splitThreatActivityTag(tag) {
    const value = String(tag || "").trim();

    if (!value) {
      return null;
    }

    const match = value.match(/^([^:]+)\s*:\s*(.+)$/);

    if (!match) {
      return null;
    }

    const prefix = match[1].trim();
    const name = match[2].trim();

    const isThreatPrefix = THREAT_ACTIVITY_TAG_PREFIXES.some(
      allowedPrefix => allowedPrefix.toLowerCase() === prefix.toLowerCase()
    );

    if (!isThreatPrefix || !name) {
      return null;
    }

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
      lowerName.includes("ransomware") ||
      lowerName.includes("raas")
    ) {
      return "malware";
    }

    if (lowerPrefix === "e-crime") {
      return "malware";
    }

    return "actor";
  }

  function extractThreatActivityFromTags(command, entry) {
    const tags = [
      ...normaliseArray(command.tags),
      ...normaliseArray(entry.topLevelTags)
    ];

    const parsedTags = tags
      .map(splitThreatActivityTag)
      .filter(Boolean);

    if (parsedTags.length === 0) {
      return [
        {
          name: DEFAULT_ACTOR,
          type: "actor",
          rawTag: DEFAULT_ACTOR,
          prefix: "Unknown"
        }
      ];
    }

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

    const matchingPrefix = Object.keys(tacticByTechniquePrefix)
      .find(prefix => id.startsWith(prefix));

    if (matchingPrefix) {
      return tacticByTechniquePrefix[matchingPrefix];
    }

    if (text.includes("discovery")) return "Discovery";
    if (text.includes("impair") || text.includes("defense")) return "Defense Evasion";
    if (text.includes("stop") || text.includes("impact") || text.includes("encrypt")) return "Impact";
    if (text.includes("persistence") || text.includes("vib")) return "Persistence";
    if (text.includes("command") || text.includes("cli") || text.includes("execution")) return "Execution";
    if (text.includes("proxy") || text.includes("tunnel")) return "Command and Control";

    return "";
  }

  function procedureLabel(command, binary) {
    const explicit = String(command.procedureName || "").trim();

    if (explicit && explicit.toLowerCase() !== "procedure") {
      return explicit;
    }

    const usecase = String(command.usecase || command.description || "").trim();

    if (usecase) {
      return titleCase(usecase)
        .replace(/\.$/, "")
        .slice(0, 70);
    }

    return `${binary} procedure`;
  }

  function titleCase(value) {
    return String(value || "")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\w\S*/g, word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
  }

  function detectionNames(value) {
    const detections = normaliseArray(value)
      .map(item => {
        const text = String(item).trim();

        if (/sigma/i.test(text)) return "Sigma";
        if (/elastic/i.test(text)) return "Elastic";
        if (/splunk/i.test(text)) return "Splunk";
        if (/sentinel|kql|microsoft/i.test(text)) return "Microsoft Sentinel";
        if (/yara/i.test(text)) return "YARA";
        if (/atomic/i.test(text)) return "Atomic Red Team";

        return text.length > 42 ? `${text.slice(0, 42)}...` : text;
      })
      .filter(Boolean);

    return unique(detections);
  }

  function sourceDisplayName(value) {
    const text = String(value || "").trim();

    if (!text) return "";

    try {
      const url = new URL(text);
      return url.hostname.replace(/^www\./, "");
    } catch (_) {
      return text.length > 48 ? `${text.slice(0, 48)}...` : text;
    }
  }

  function sourceUrl(value) {
    const text = String(value || "").trim();

    if (/^https?:\/\//i.test(text)) {
      return text;
    }

    return "";
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function safeId(prefix, value) {
    return `${prefix}:${String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 110)}`;
  }

  function addNode(nodes, id, data, position) {
    if (!nodes.has(id)) {
      nodes.set(id, {
        data: {
          id,
          ...data
        },
        position
      });
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

  function layerPosition(layer, index, count) {
    const layerX = {
      actor: 80,
      procedure: 390,
      binary: 710,
      technique: 1030,
      detection: 1350,
      source: 1350
    };

    const top = 80;
    const spacing = Math.max(95, Math.min(155, 760 / Math.max(count, 1)));

    return {
      x: layerX[layer] || 500,
      y: top + index * spacing
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
      binaryIndex.set(binaryId, binaryIndex.size);

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
        layerPosition("binary", binaryIndex.get(binaryId), binaryIndex.size + 1)
      );

      const commands = Array.isArray(entry.commands) && entry.commands.length > 0
        ? entry.commands
        : [{
            procedureName: binary,
            command: "",
            usecase: entry.binaryDescription || "",
            description: entry.binaryDescription || "",
            tags: entry.topLevelTags || [],
            resources: entry.topLevelResources || []
          }];

      commands.forEach((command, commandIndex) => {
        const procedureName = procedureLabel(command, binary);
        const procedureId = safeId("procedure", `${binary}:${procedureName}:${commandIndex}`);

        procedureIndex.set(procedureId, procedureIndex.size);

        const allTags = [
          ...normaliseArray(command.tags),
          ...normaliseArray(entry.topLevelTags)
        ];

        addNode(
          nodes,
          procedureId,
          {
            label: procedureName,
            type: "procedure",
            command: command.command || "",
            description: command.description || command.usecase || "",
            usecase: command.usecase || "",
            confidence: command.confidence || "",
            firstSeen: command.firstSeen || "",
            lastSeen: command.lastSeen || "",
            privileges: command.privileges || "",
            operatingSystem: command.operatingSystem || "ESXi",
            telemetry: normaliseArray(command.telemetry).join(", "),
            sourceTags: allTags.filter(isThreatActivityTag).join(", "),
            isNew: allTags.some(tag => /^graph:new$/i.test(String(tag).trim())),
            lolesxi: entry.lolesxiUrl ? "Covered" : "",
            lolesxiUrl: entry.lolesxiUrl || ""
          },
          layerPosition("procedure", procedureIndex.get(procedureId), procedureIndex.size + 1)
        );

        addEdge(edges, procedureId, binaryId, "uses binary");

        const activities = extractThreatActivityFromTags(command, entry);

        activities.forEach(activity => {
          const actorId = safeId("actor", `${activity.prefix}:${activity.name}`);

          actorIndex.set(actorId, actorIndex.size);

          addNode(
            nodes,
            actorId,
            {
              label: activity.name,
              type: activity.type,
              sourceTag: activity.rawTag,
              tagPrefix: activity.prefix,
              description: `${activity.name} activity linked to ESXi procedures via LOLESXi tag: ${activity.rawTag}.`
            },
            layerPosition("actor", actorIndex.get(actorId), actorIndex.size + 1)
          );

          addEdge(edges, actorId, procedureId, "uses");
        });

        const mitreId = firstMitreId(command.mitreId);
        const techniqueLabel = command.mitreTechnique || mitreId;

        if (mitreId || techniqueLabel) {
          const techniqueName = techniqueLabel && techniqueLabel !== mitreId
            ? `${techniqueLabel} (${mitreId})`
            : mitreId;

          const techniqueId = safeId("technique", techniqueName);
          techniqueIndex.set(techniqueId, techniqueIndex.size);

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
            layerPosition("technique", techniqueIndex.get(techniqueId), techniqueIndex.size + 1)
          );

          addEdge(edges, procedureId, techniqueId, "maps to");
        }

        detectionNames(command.detections).forEach(name => {
          const detectionId = safeId("detection", name);
          detectionIndex.set(detectionId, detectionIndex.size);

          addNode(
            nodes,
            detectionId,
            {
              label: name,
              type: "detection",
              description: `Detection reference linked to ${procedureName}.`
            },
            layerPosition("detection", detectionIndex.get(detectionId), detectionIndex.size + 1)
          );

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
          sourceIndex.set(sourceId, sourceIndex.size);

          addNode(
            nodes,
            sourceId,
            {
              label: name,
              type: "source",
              sourceUrl: sourceUrl(source),
              description: `Source reporting linked to ${procedureName}.`
            },
            layerPosition("source", sourceIndex.get(sourceId), sourceIndex.size + 1)
          );

          addEdge(edges, procedureId, sourceId, "reported in");
        });
      });
    });

    return [
      ...nodes.values(),
      ...edges.values()
    ];
  }

  window.LOLESXI_THREAT_GRAPH_RAW = rawEntries;
  window.LOLESXI_THREAT_GRAPH_DATA = buildGraphElements(rawEntries);
})();

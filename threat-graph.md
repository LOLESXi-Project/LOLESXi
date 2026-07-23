---
layout: default
title: Threat Graph
permalink: /threat-graph/
---

<link rel="stylesheet" href="{{ '/assets/css/threat-graph.css' | relative_url }}">

<div class="graph-page">
  <header class="graph-header">
    <div>
      <h1>LOLESXi Threat Procedure Graph</h1>
      <p>
        Relationship view connecting tag-derived threat groups, ESXi-native binaries,
        procedures, ATT&amp;CK techniques, detections, and source reporting.
      </p>
    </div>

    <div class="graph-status">
      <span class="pulse"></span>
      Custom palette threat group view
    </div>
  </header>

  <main class="graph-app">
    <aside class="graph-sidebar">
      <div class="metric-grid">
        <div class="metric"><strong id="metric-nodes">0</strong><span>nodes</span></div>
        <div class="metric"><strong id="metric-edges">0</strong><span>relationships</span></div>
        <div class="metric"><strong id="metric-procedures">0</strong><span>procedures</span></div>
        <div class="metric"><strong id="metric-binaries">0</strong><span>binaries/scripts</span></div>
      </div>

      <div class="filter-group">
        <p class="panel-title">Views</p>
        <button id="view-overview">Threat group overview<span>Threat groups connected to tagged LOLESXi binaries</span></button>
        <button id="view-procedure-map">Procedure map<span>Show procedures, ATT&amp;CK, detections and sources</span></button>
        <button id="view-esxcli">Focus: esxcli<span>Show relationships around esxcli</span></button>
        <button id="view-vim-cmd">Focus: vim-cmd<span>Show relationships around vim-cmd</span></button>
      </div>

      <div class="filter-group">
        <p class="panel-title">Threat Group</p>
        <div class="actor-filter-actions">
          <button id="select-all-actors">Select all</button>
          <button id="clear-all-actors">Clear all</button>
        </div>
        <div id="actor-filter-list" class="actor-filter-list"></div>
      </div>

      <div class="filter-group">
        <p class="panel-title">Node types</p>
        <label><input type="checkbox" checked data-type="actor"> Threat actors</label>
        <label><input type="checkbox" checked data-type="malware"> Malware / ransomware / e-crime</label>
        <label><input type="checkbox" checked data-type="binary"> Native binaries/scripts</label>
        <label><input type="checkbox" data-type="procedure"> ESXi procedures</label>
        <label><input type="checkbox" data-type="technique"> ATT&amp;CK techniques</label>
        <label><input type="checkbox" data-type="detection"> Detections</label>
        <label><input type="checkbox" data-type="source"> Sources</label>
      </div>

      <div class="filter-group">
        <p class="panel-title">Accepted tag prefixes</p>
        <div class="tag-prefix-list">
          <span>APT:</span>
          <span>E-Crime:</span>
          <span>Ransomware:</span>
          <span>Malware:</span>
          <span>Actor:</span>
          <span>Threat Actor:</span>
          <span>Group:</span>
        </div>
      </div>

      <div class="filter-group">
        <p class="panel-title">Legend</p>
        <div class="legend">
          <span><i class="dot actor"></i> Threat Group</span>
          <span><i class="dot malware"></i> E-crime / ransomware / malware</span>
          <span><i class="dot binary"></i> Native binary/script</span>
          <span><i class="dot procedure"></i> ESXi procedure</span>
          <span><i class="dot technique"></i> ATT&amp;CK technique</span>
          <span><i class="dot detection"></i> Detection</span>
          <span><i class="dot source"></i> Source</span>
        </div>
      </div>
    </aside>

    <section class="graph-canvas-wrap">
      <div id="lolesxi-threat-graph"></div>
      <div class="graph-caption">
        <div>Default flow: threat group tag → binary entry → procedures</div>
        <div>Use Procedure map to expand ATT&amp;CK, detections and sources</div>
      </div>
    </section>

    <section class="graph-details" id="graph-details">
      <div class="detail-card">
        <span class="node-type">Selected node</span>
        <h2>Click a node</h2>
        <p>
          Select a tag-derived threat group, LOLESXi binary, procedure, ATT&amp;CK
          technique, detection, or source to inspect relationships.
        </p>
      </div>
    </section>
  </main>
</div>

<script src="https://unpkg.com/cytoscape@3.28.1/dist/cytoscape.min.js"></script>
<script src="{{ '/assets/js/threat-graph-data.js' | relative_url }}"></script>
<script src="{{ '/assets/js/threat-graph.js' | relative_url }}"></script>

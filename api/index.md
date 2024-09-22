---
layout: page
title: APIs
---

<script async src=""></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-133649096-1');
</script>


Currently, data from the lolesxi Project can be accessed in the following ways:

## JSON
**Entry point**: <a href="{{'/api/lolesxi.json' | relative_url }}">{{'/api/lolesxi.json' | relative_url}}</a>

**Type**: Single file

This file contains every lolesxi entry in a single file, using the same structure as the underlying YAML files.

## CSV
**Entry point**: <a href="{{'/api/lolesxi.csv' | relative_url }}">{{'/api/lolesxi.csv' | relative_url}}</a>

**Type**: Single file

This file contains every lolesxi entry in a single file, broken down by lolesxi file and command.

## YAML
**Entry point**: <a href="https://raw.githubusercontent.com/lolesxi-Project/lolesxi/master/yml/">https://raw.githubusercontent.com/lolesxi-Project/lolesxi/master/yml/</a>

**Type**: File per entry

Finally, it is possible to access the raw YAML files via GitHub. The file structure can be found on <a href="https://github.com/lolesxi-Project/lolesxi/tree/master/yml">GitHub</a>.

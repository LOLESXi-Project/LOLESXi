---
Name: python
Description: Python interpreter.
Created: 2026-11-23
Commands:
  - Command: python vmfs_browser.py
    Description: Executes a Python script staged on the host.
    Usecase: Use the script to enumerate VMFS contents, inspect guest disks and collect selected files.
    Category: Execute Script
    MitreID: T1059.006
    ProceduralExamples:
      - 'python vmfs_browser.py -d "/dev/disks/vml.<REDACTED>:1" ls .'
    OperatingSystem: ESXi
    Tags:
      - APT: ARMORY CASTLE
Resources:
  - Link: https://cloud.google.com/blog/topics/threat-intelligence/armory-castle-exploits-vsphere
Acknowledgement:
  - Person: Jayson Frost
  - Person: Bryce Greathouse
  - Person: Dhanesh Kizhakkinan
  - Person: John Palmisano
  - Person: Steve Rasch
  - Person: Daniel Sislo
  - Person: John Wolfram
---

---
Name: rm
Description: Used to delete files or directories from an ESXi file system.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2025-11-16
Commands:
  - Command: rm -f "/path/to/directory/*"
    Description: Force deletes files from a directory.
    Usecase: An adversary deletes logs from an ESXi host to clear traces of their operations.
    Category: Delete file
    Privileges: Administrator
    MitreID: T1070.004
    OperatingSystem: ESXi
    ProceduralExamples: | 
     - rm -f "/var/logs/*"
	 - rm -f "/.ash_history"
Full_Path:
  - Path: /sbin/rm
  - Path: /bin/rm
Resources:
  - Link: https://blog.talosintelligence.com/kraken-ransomware-group/
Acknowledgement:
  - Person: Chetan Raghuprasad
  - Person: Michael Szeliga
---

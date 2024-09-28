---
Name: mv
Description: Used for moving or renaming files/folders within a file system.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: mv /etc/motd /etc/motd1
    Description: Renames the Message Of The Day file.
    Usecase: An adversary renames the current motd file on an ESXi host and copies a custom version to its location. This usually contain the ransom notification.
    ProcedureExamples: 
    - mv /etc/motd /etc/motd1 && cp $CLEAN_DIR/motd /etc/motd
    Category: Replace File
    Privileges: Administrator
    MitreID: T1491
    OperatingSystem: ESXi
    Tags:
     - E-Crime: Nevada
Full_Path:
  - Path: /usr/lib/vmware/busybox/bin/busybox mv
  - Path: /sbin/mv
  - Path: /bin/mv
Resources:
  - Link: https://www.varonis.com/blog/vmware-esxi-in-the-line-of-ransomware-fire
Acknowledgement:
  - Person: Jason Hill

---

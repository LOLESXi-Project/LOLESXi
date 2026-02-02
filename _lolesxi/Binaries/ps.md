---
Name: ps
Description: List process information from a ESXi host.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2026-02-02
Commands:
  - Command: ps | grep vmx | grep "%s"
    Description: Gets a list of VM guest processes.
    Usecase: An adversary obtains list of all running processes and filters it to only get those related to guest VMs.
    Category: Stop Service
    Privileges: Administrator
    MitreID: T1082
    OperatingSystem: ESXi
    Tags:
     - E-Crime:  Lockbit
Full_Path:
  - Path: /sbin/ps
  - Path: /bin/ps
Resources:
  - Link: https://www.levelblue.com/blogs/spiderlabs-blog/19-shades-of-lockbit5.0-inside-the-latest-cross-platform-ransomware-part-1
Acknowledgement:
  - Person: Mark Tsipershtein
  - Person: Evgeny Ananin
  - Person: Nikita Kazymirskyi
---

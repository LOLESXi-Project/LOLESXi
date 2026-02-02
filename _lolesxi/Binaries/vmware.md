---
Name: vmware
Description: Binary that provides system information related to an ESXi host.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2026-02-02
Commands:
  - Command: vmware -v 2> /dev/null
    Description: Gets the VMWARE ESXi host version information.
    Usecase: An adversary obtains system information such as the version of the ESXi host.
    Category: System Information
    Privileges: Administrator
    MitreID: T1082
    OperatingSystem: ESXi
    Tags:
     - E-Crime:  Lockbit
Full_Path:
  - Path: /sbin/vmware
  - Path: /bin/vmware
Resources:
  - Link: https://www.levelblue.com/blogs/spiderlabs-blog/19-shades-of-lockbit5.0-inside-the-latest-cross-platform-ransomware-part-1
Acknowledgement:
  - Person: Mark Tsipershtein
  - Person: Evgeny Ananin
  - Person: Nikita Kazymirskyi
---

---
Name:  vmkfstools
Description: A command-line utility in VMware ESXi used to manage and interact with VMFS (Virtual Machine File System) volumes.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: vmkfstools -c 10M -d eagerzeroedthick $I/eztDisk > /dev/null
    Description: Provides a CSV output of running Virtual Machines with its corresponding WorldID and DisplayName.
    Usecase: Provides a list of running Virtual Machines with their WorldID and Displayname in CSV format
    Category: Lists VMs
    Privileges: Administrator
    MitreID: T1082
    OperatingSystem: ESXi
Commands:
  - Command: vmkfstools -c 10M -d eagerzeroedthick $I/eztDisk > /dev/null
    Description: Provides a CSV output of running Virtual Machines with its corresponding WorldID and DisplayName.
    Usecase: Provides a list of running Virtual Machines with their WorldID and Displayname in CSV format
    Category: Lists VMs
    Privileges: Administrator
    MitreID: T1082
    OperatingSystem: ESXi  
    Tags:
     - E-Crime: Qilin
Full_Path:
  - Path: /sbin/vmkfstools
  - Path: /bin/vmkfstools
Resources:
  - Link: https://www.bleepingcomputer.com/news/security/linux-version-of-qilin-ransomware-focuses-on-vmware-esxi/
Acknowledgement:
  - Person: Lawrence Abrams
  - Person: MalwareHunterTeam
    Handle: '@malwarehunterteam'
---

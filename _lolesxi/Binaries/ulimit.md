---
Name:  ulimit
Description: A command line utility used to control the resource limits available to the shell and processes started by it. These limits are designed to prevent a single user or process from using high number of system resources, which could negatively impact the entire system.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: ulimit -p $(ulimit -Hp) ulimit -n $(ulimit -Hn)
    Description: Changes the open file descriptor and pseudoterminals to unlimited.
    Usecase: An adversary modifies the resource limit thresholds to unlimited. This allows a single process to utilise all the system resources.
    Category: Adjust Performance
    Privileges: User
    MitreID:  Not Mapped
    OperatingSystem: ESXi
    Tags:
     - E-Crime: Nevada
Detection:
  - Sigma: 
Resources:
  - Link: https://www.varonis.com/blog/vmware-esxi-in-the-line-of-ransomware-fire
Acknowledgement:
  - Person: Jason Hill
---

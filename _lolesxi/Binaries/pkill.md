---
Name: pkill
Description: Forcefully terminates processes by performing a full or partial match based on the process name. It is commonly exploited by adversaries to abruptly stop running Virtual Machine (VM) executable processes. This is usually performed prior to ransomware deployment.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: pkill -9 %s
    Description: Terminates all processes on the ESXi host that starts with vmx- prefix.
    Usecase: Forceful termination of Virtual Machines
    Category: terminate process
    Privileges: Administrator
    MitreID: T1489
    OperatingSystem: ESXi
    Tags:
     - E-Crime: Revil
    ProceduralExamples:
     - pkill -9 vmx-*
Full_Path:
  - Path: /bin/vmkvsitools pkill 
  - Path: /sbin/pkill
  - Path: /bin/pkill
Detection:
  - Sigma: 
Resources:
  - Link: https://www.crowdstrike.com/blog/hypervisor-jackpotting-ecrime-actors-increase-targeting-of-esxi-servers/
  - Link: https://www.forescout.com/resources/rise-in-linux-ransomware/
  - Link: https://www.hybrid-analysis.com/sample/ea1872b2835128e3cb49a0bc27e4727ca33c4e6eba1e80422db19b505f965bc4/60db1f3adc8afe020254a5f3
Acknowledgement:
  - Person: Michael Dawson
---

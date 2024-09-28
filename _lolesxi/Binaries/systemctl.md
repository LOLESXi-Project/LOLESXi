---
Name: systemctl
Description: Manages the status of system services
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: service $s stop
    Description: Stops all services on an ESXi host.
    Usecase: An adversary stops all services within the ESXi host to prevent any interference with ransomware encryption operations.
    Category: Stop Service
    Privileges: Administrator
    MitreID: T1529
    OperatingSystem: ESXi
    Tags:
     - E-Crime: GwisinLocker
    ProceduralExamples:
     - /usr/local/etc/r/etc/init.d/%s* systemctl stop %/sbin/service %s/bin/sh -c "for s in `service -l | grep %s`; do service $s stop;
Full_Path:
  - Path: /sbin/services.sh
Resources:
  - Link: https://www.hybrid-analysis.com/sample/7594bf1d87d35b489545e283ef1785bb2e04637cc1ff1aca9b666dde70528e2b/6310d9bdbde3430a5a65372f
  - Link: https://www.reversinglabs.com/blog/gwisinlocker-ransomware-targets-south-korean-industrial-and-pharmaceutical-companies
Acknowledgement:
  - Person: Joseph Edwards
---

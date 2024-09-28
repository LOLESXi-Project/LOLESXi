---
Name: vpxa
Description: Vpxa functions as an intermediary service that connects the vpxd service on the vCenter Server with the hostd service on an ESXi host. Stopping this service will cause management and monitoring functions to cease.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-31
Commands:
  - Command: /etc/init.d/vpxa stop
    Description: Stops the vpxa service on an ESXi host.
    Usecase: An adversay may stop the vpxa service to cease remote management by the VCenter server.
    Category: Stop Service
    Privileges: Administrator
    MitreID: T1489
    OperatingSystem: ESXi
    Tags:
     - E-Crime:  Nevada
Full_Path:
  - Path: /etc/init.d/vpxa
Resources:
  - Link: https://www.trellix.com/en-au/blogs/research/ransomhouse-am-see/
Acknowledgement:
  - Person: Pham Duy Phuc
  - Person: Max Kersten
  - Person: Noël Keijzer
  - Person: Michaël Schrijver
  - Person: Germán Fernández
    Handle: '@1ZRR4H'
  - Person: MalwareHunterTeam
    Handle: '@malwrhunterteam'
---

---
Name: esxcfg-advcfg
Description: A command-line utility used in VMware ESXi to manage advanced configuration settings on an ESXi host. It allows administrators to query, modify, and manage various advanced parameters that are not typically available through the standard vSphere Client or the ESXi host client interface.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-31
Commands:
  - Command: esxcfg-advcfg -s 32768 /BufferCache/MaxCapacity
    Description: Increases the number of buffers to increase VM performance over network.
    Usecase: An adversary may adjust the maximum capacity of buffer cache to increase performance of operations conducted over the network.
    Category: Adjust Performance
    Privileges: Administrator
    OperatingSystem: ESXi < 8.0
    Tags:
     - E-Crime: Qilin
  - Command: esxcfg-advcfg -s 20000 /BufferCache/FlushInterval
    Description: Reduces the Buffer Cache Flush interval to increase VM performance over network.
    Usecase: An adversary may adjust flush interval of buffer cache to increase performance of operations conducted over the network.
    Category: Adjust Performance
    Privileges: Administrator
    OperatingSystem: ESXi < 8.0
    Tags:
     - E-Crime: Qilin
Full_Path:
  - Path: /bin/esxcfg-advcfg
  - Path: /sbin/esxcfg-advcfg
Resources:
  - Link: https://www.bleepingcomputer.com/news/security/linux-version-of-qilin-ransomware-focuses-on-vmware-esxi/
  - Link: https://knowledge.broadcom.com/external/article?legacyId=2052302"
Acknowledgement:
  - Person: Lawrence Abrams
  - Person: MalwareHunterTeam
    Handle: '@malwarehunterteam'
 ---

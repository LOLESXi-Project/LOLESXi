---
Name: esxcfg-advcfg
Description: A command-line utility available in VMware ESXi to manage advanced configuration settings. It allows administrators to query, modify, and manage various advanced parameters that are not typically available through the standard vSphere Client or the ESXi host client interface.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-31
Commands:
  - Command: esxcfg-advcfg -s 32768 /BufferCache/MaxCapacity
    Description: Increases the number of buffers to increase VM performance over network.
    Usecase: An adversary may adjust the maximum capacity of buffer cache to increase performance of operations conducted over the network. This increases speed of encryption throughput.
    Category: Adjust Performance
    Privileges: Administrator
    OperatingSystem: ESXi < 8.0
    ProceduralExamples:
    - esxcfg-advcfg -s 32768 /BufferCache/MaxCapacity > /dev/null 2>&1   
    Tags:
    - E-Crime: Qilin
    - E-Crime: The Gentlemen
  - Command: esxcfg-advcfg -s 20000 /BufferCache/FlushInterval
    Description: Reduces the Buffer Cache Flush interval to increase VM performance over network.
    Usecase: An adversary may adjust flush interval of buffer cache to increase performance of operations conducted over the network. It forces faster disk writes.
    Category: Adjust Performance
    Privileges: Administrator
    OperatingSystem: ESXi < 8.0
    ProceduralExamples:
    - esxcfg-advcfg -s 20000 /BufferCache/FlushInterval > /dev/null 2>&1
    Tags:
    - E-Crime: Qilin
    - E-Crime: The Gentlemen
Full_Path:
  - Path: /bin/esxcfg-advcfg
  - Path: /sbin/esxcfg-advcfg
Resources:
  - Link: https://www.bleepingcomputer.com/news/security/linux-version-of-qilin-ransomware-focuses-on-vmware-esxi/
  - Link: https://knowledge.broadcom.com/external/article?legacyId=2052302
  - Link: https://research.checkpoint.com/2026/dfir-report-the-gentlemen/
Acknowledgement:
  - Person: Lawrence Abrams
  - Person: MalwareHunterTeam
    Handle: '@malwarehunterteam'
---

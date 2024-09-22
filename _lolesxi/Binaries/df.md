---
Name: df
Description: Provides information about disk utilisation statistics of attached volumes.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-31
Commands:
  - Command: df -h -P -x"squashfs" | awk '{print $1"\t"$2"\t"$3"\t"$4"\t"$5"\t"$6}'
    Description: Displays information regarding available storage on a ESXi host
    Usecase: An adversary may obtain information about existing storage availability to plan subsequent operations. Above provides outputs available disk space in human readable format in POSIX format. It excludes the squashfs and then prints the first 6 columns from the output. Note that the -P and -x switches do not exist in ESXi so the exact command may not get executed successfully.
    Category: System Information
    Privileges: Administrator
    MitreID:  T1082
    OperatingSystem: ESXi
    Tags:
     - E-Crime: RansomHouse
Full_Path:
  - Path: /bin/df
  - Path: /sbin/df
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

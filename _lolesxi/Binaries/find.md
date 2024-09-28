---
Name: find
Description: A commandline utility that can be used to locate files and directories based on various criteria, such as name, type, size, modification date, etc.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: find /vmfs/volumes/ -type f -name "*.vmdk"
    Description: Locates files with extensions commonly associated with Virtual Machines, such as .vmdk and .vmx within /vmfs/volumes folder path. This may be performed programmatically and additional switches can be used to exclude specific folders from the search.
    Usecase: Locate virtual machine disks in preparation for encryption operations or for exfiltration.
    Category: Find Files
    Privileges: Administrator
    MitreID: T1083
    OperatingSystem: ESXi
    ProceduralExamples: | 
     - find "/vmfs/volumes/$volume/" -type f -name "*.vmdk" -o -name "*.vmx" -o -name "*.vmxf" -o -name "*.vmsd" -o -name "*.vmsn" -o -name "*.vswp" -o -name "*.vmss" -o -name "*.nvram" -o -name "*.vmem"
     - find /vmfs/volumes/ -type f -not \( -path /sys -prune \) -not \( -path /proc -prune \) 
      -not \( -path /run -prune \) -not \( -path /var/log -prune \) -name "*.vmdk*" -o -name "*.ovf*" -o -name "*.ova*" -o -name "*.vmem*" -o -name "*.vswp*" -o -name "*.vmsd*" -o -name "*.vmsn*" -o -name "*.vib*" -o -name "*.vbk*" -o -name "*.vbm*"
  - Command: /bin/find / -name *.log -exec /bin/rm -rf {} \;
    Description: Find and delete all files ending with .log extension
    Usecase: An adversary deletes all files ending with the .log file extension to clear evidence of their offensive operations.
    Category: Remove Evidence
    Privileges: User
    MitreID: T1070.004
    OperatingSystem: ESXi
    ProceduralExamples:
     - /bin/find / -name *.log -exec /bin/rm -rf {} \;
  - Command: find /usr/lib/vmware -type f -name index.html
    Description: Find and replace the ESXi web console homepage.
    Usecase: An adversary finds and replaces the ESXi web console homepage with a custom version. This often contains ransomware notification message.
    Category: Find and Replace
    Privileges: User
    MitreID: T1491.001
    OperatingSystem: ESXi
    Tags:
     - E-Crime: RansomHouse
     - E-Crime: Nevada
    ProceduralExamples: | 
     - find /usr/lib/vmware -type f -name index.html
     mv "$path_to_ui/index.html" "$path_to_ui/index1.html
     cp "$CLEAN_DIR/index.html" "$path_to_ui/index.html" 
Full_Path:
  - Path: /usr/lib/vmware/busybox/bin/busybox find
  - Path: /sbin/find
  - Path: /bin/find
Code_Sample:
  - Code:
Detection:
  - Elastic: https://github.com/elastic/detection-rules/blob/main/rules/linux/defense_evasion_rename_esxi_index_file.toml
AtomicTests:
  - https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1083/T1083.md#atomic-test-7---esxi---enumerate-vmdks-available-on-an-esxi-host
Resources:
  - Link: https://www.varonis.com/blog/vmware-esxi-in-the-line-of-ransomware-fire
  - Link: https://www.trellix.com/en-au/blogs/research/ransomhouse-am-see/
Acknowledgement:
  - Person: Jason Hill
  - Person: Pham Duy Phuc
  - Person: Max Kersten
  - Person: Noël Keijzer
  - Person: Michaël Schrijver
  - Person: Germán Fernández
    Handle: '@1ZRR4H'
  - Person: MalwareHunterTeam
    Handle: '@malwrhunterteam'
---

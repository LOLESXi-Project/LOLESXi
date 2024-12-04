---
Name: vim-cmd
Description: A command-line utility in VMware ESXi that provides an interface to interact with the VMware Infrastructure (VI) API, allowing users to manage and automate tasks on ESXi host and its virtual machines (VMs)
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: vim-cmd hostsvc/enable_ssh
    Description: Enables SSH services on the ESXi host
    Usecase: SSH service enables adversaries to laterally move to ESXi hosts and use as an alternative command execution interface.
    Category: Enable Service
    Privileges: Administrator
    MitreID: T1021.004
    OperatingSystem: ESXi
  - Command: vim-cmd hostsvc/autostartmanager/enable_autostart false
    Description: Disable autostart of Virtual Machines
    Usecase: Disabling autostart of Virtual Machines prevents them from starting post reboot of a ESXi host.
    Category: Disable Startup
    Privileges: Administrator
    MitreID: T1529
    OperatingSystem: ESXi
    ProceduralExamples: 
     - vim-cmd hostsvc/autostartmanager/enable_autostart 0
  - Command: vim-cmd hostsvc/hostsummary | grep cpuModel 
    Description: Displays summary of system information about the ESXi host
    Usecase: Shows the exact cpuModel from the hostsummary output
    Category: System Information
    Privileges: Administrator
    MitreID: T1082
    OperatingSystem: ESXi
  - Command: vim-cmd vmsvc/getallvms
    Description: Displays the list of VMs available on an ESXi host.
    Usecase: Shows running VMs on an ESXi Host. Adversaries were seen use this techinique to programatically enumerate VMs and powers them down using the Vmid.
    Category: System Information
    Privileges: Administrator
    MitreID: T1082 
    OperatingSystem: ESXi
    ProceduralExamples: 
    - /bin/sh -c “for vmid in $(vim-cmd vmsvc/getallvms | grep -v Vmid | awk '{print $1}'); do vim-cmd vmsvc/power.off $vmid; done"
    - for i in $(vim-cmd vmsvc/getallvms | awk '{print $1}' | grep -Eo '[0-9]{1,5}'); do vim-cmd vmsvc/power.off $i; vim-cmd vmsvc/snapshot.removeall $i; done;
    - vim-cmd vmsvc/getallvms | tail -n +2 | awk '{system("vim-cmd vmsvc/power.off " $1)}
  - Command: vim-cmd vmsvc/snapshot.removeall
    Description: Remove VM Snapshots
    Usecase: Deletes all snapshots of all Virtual Machines. This activity is usually observed near ransomware deployment and is often executed programatically.
    Category: Inhibit Recovery
    Privileges: Administrator
    MitreID: T1485
    OperatingSystem: ESXi
    ProceduralExamples:
     - for i in `vim-cmd vmsvc/getallvms| awk '{print$1}'`;do vim-cmd vmsvc/snapshot.removeall $i & done
     - vim-cmd vmsvc/snapshot.removeall %llu > /dev/null 2>&1  
  - Command: vim-cmd vmsvc/power.off
    Description: Power off VM
    Usecase: Powers off Virtual Machines. This activity is usually observed near ransomware deployment and is often executed programatically.
    Category: Power off VM
    Privileges: Administrator
    MitreID: T1529
    OperatingSystem: ESXi
    Tags:
     - E-Crime: Lockbit
     - E-Crime: Ransomhub
     - E-Crime: Blackcat
     - E-Crime: Qilin
     - E-Crime: Play
     - E-Crime: Lynx
     - E-Crime: Howling Scorpius
    ProceduralExamples:
    - vim-cmd vmsvc/getallvms | grep -o -E \'^[0-9]+\' | xargs -r -n 1 vim-cmd vmsvc/power.off
    - /bin/sh -c “for vmid in $(vim-cmd vmsvc/getallvms | grep -v Vmid | awk '{print $1}'); do vim-cmd vmsvc/power.off $vmid; done"
    - for i in $(vim-cmd vmsvc/getallvms | awk '{print $1}' | grep -Eo '[0-9]{1,5}'); do vim-cmd vmsvc/power.off $i; vim-cmd vmsvc/snapshot.removeall $i; done;
    - vim-cmd vmsvc/getallvms | tail -n +2 | awk '{system("vim-cmd vmsvc/power.off " $1)}
Full_Path:
  - Path: /sbin/vim-cmd
  - Path: /bin/vim-cmd
Resources:
  - Link: https://www.trendmicro.com/en_us/research/22/a/analysis-and-Impact-of-lockbit-ransomwares-first-linux-and-vmware-esxi-variant.html
  - Link: https://thedxt.ca/2023/12/esxi-autostart-vms-with-cli/
  - Link: https://www.bleepingcomputer.com/news/security/linux-version-of-ransomhub-ransomware-targets-vmware-esxi-vms/
  - Link: https://www.cybereason.com/blog/cybereason-vs.-blackcat-ransomware
  - Link: https://www.bleepingcomputer.com/news/security/linux-version-of-qilin-ransomware-focuses-on-vmware-esxi/
  - Link: https://www.trendmicro.com/en_us/research/24/g/new-play-ransomware-linux-variant-targets-esxi-shows-ties-with-p.html
  - Link: https://x.com/malwrhunterteam/status/1455628865229950979?lang=en
  - Link: https://www.hybrid-analysis.com/sample/a0ceb258924ef004fa4efeef4bc0a86012afdb858e855ed14f1bbd31ca2e42f5/661430861522cb62560ee827
  - Link: https://unit42.paloaltonetworks.com/inc-ransomware-rebrand-to-lynx/
  - Link: https://unit42.paloaltonetworks.com/threat-assessment-howling-scorpius-akira-ransomware/
  - Link: https://research.checkpoint.com/2024/inside-akira-ransomwares-rust-experiment/
Acknowledgement:
  - Person: Junestherry Dela Cruz
  - Person: Daniel Keer
    Handle: '@thedxt'
  - Person: Tom Fakterman
  - Person: Ohav Peri
  - Person: MalwareHunterTeam
    Handle: '@malwrhunterteam'
  - Person: Cj Arsley Mateo
  - Person: Darrel Tristan Virtusio
  - Person: Sarah Pearl Camiling
  - Person: Andrei Alimboyao
  - Person: Nathaniel Morales 
  - Person: Jacob Santos
  - Person: Earl John Bareng
  - Person: Pranay Kumar Chhaparwal
  - Person: Micah Yates
  - Person: Benjamin Chang
  - Person: Yoav Zemah
---

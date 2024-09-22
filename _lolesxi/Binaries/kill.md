---
Name: kill
Description: Allows manually termination of processes of interest.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: kill -9 {process}
    Description: Terminates processes in a ESXi Host
    Usecase: An adversary may list processes starting with vmx and then extracts the second column from the output and uses it to terminate the process. Further, research indicates that adversaries enumerate ssh sessions by non-root users and sends a kill signal 9 to terminate them. This ceases ssh sessions initiated by legitimate users and allows the adversary to operate further using root user account.
    Category: Terminate Process
    Privileges: Administrator
    MitreID: T1489
    OperatingSystem: ESXi
    Tags:
     - E-Crime: RansomHouse
     - E-Crime: Nevada
    ProceduralExamples: 
    - kill -9 $(ps | grep vmx | awk '{print $2}')
    - ps | grep sshd | grep -v -e grep -e root -e 12345 | awk {print "kill -9", $2} | sh
Full_Path:
  - Path: /usr/lib/vmware/busybox/bin/busybox kill
  - Path: /sbin/kill
  - Path: /bin/kill
Detection:
  - Sigma: https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_esxcli_vm_kill.yml
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

---
Name:  touch
Description: Primarily used to create an empty file or to update the timestamp (modification and access time) of an existing file without changing its content.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: /bin/touch -r /etc/vmware/rhttpproxy/config.xml /etc/rc.local.d/local.sh
    Description: Changes modification or access timestamps of a target file based on a reference file.
    Usecase: An adversary uses the modification and access timestamps of a references file and updates the same timestampts of a target file. This is to hinder analysis based on timestamps as the malicious file match the timestamps of a legitimate file.
    Category: Timestomp
    Privileges: User
    MitreID:  T1070.006
    OperatingSystem: ESXi
    Tags:
     - E-Crime: Nevada
    ProceduralExamples:
     - /bin/touch -r /etc/vmware/rhttpproxy/config.xml /etc/vmware/rhttpproxy/endpoints.conf
     - /bin/touch -r /usr/lib/vmware/busybox/bin/busybox /var/spool/cron/crontabs/root
     - /bin/touch -r /usr/lib/vmware/busybox/bin/busybox /bin/hostd-probe.sh
Full_Path:
  - Path: /sbin/touch
  - Path: /bin/touch
  - Path: /usr/lib/vmware/busybox/bin/busybox touch
Detection:
  - Sigma: 
Resources:
  - Link: https://www.reddit.com/r/esxi/comments/10txpje/i_was_attack_by_esxi_ransomware_and_the_attack/
  - Link: https://www.varonis.com/blog/vmware-esxi-in-the-line-of-ransomware-fire
Acknowledgement:
  - Person: Jason Hill
---

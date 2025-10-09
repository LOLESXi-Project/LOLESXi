---
Name: chmod
Description: An inbuilt utility that allows user's to change file and folder permissions.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: chmod a+x /tmp/<FILENAME>
    Description: Change Execution Permission of a file.
    Usecase: An adversary modifies permissions of a file. For e.g. The execution flag is set on a ransomware payload prior to deployment.
    Category: Change File Permission
    Privileges: User
    MitreID: T1222.002
    OperatingSystem: ESXi
    ProceduralExamples:
    - /bin/chmod a+w /usr/lib/vmware/hostd/docroot/index.html 2>1 >/dev/null
    - /bin/chmod a+w /usr/lib/vmware/hostd/docroot/ui/index.html 2>1 >/dev/null
    Tags:
     - E-Crime: Cyborg Spider
     - E-Crime: Pysa
  - Command: /bin/chmod +w /var/spool/cron/crontabs/root
    Description: Making a file writeable.
    Usecase: An adversary alters a file's permissions to allow write access. Once the file has been modified, they may revert it to more restrictive permissions to prevent it being edited by other users.
    Category: Change File Permission
    Privileges: User
    MitreID: T1222.002
    OperatingSystem: ESXi
    Tags:
     - E-Crime:  Nevada
    ProceduralExamples:
     - /bin/chmod -w /var/spool/cron/crontabs/root
     - chmod +x $CLEAN_DIR/encrypt
Full_Path:
  - Path: /bin/chmod
  - Path: /sbin/chmod  
Resources:
  - Link: https://www.crowdstrike.com/blog/hypervisor-jackpotting-ecrime-actors-increase-targeting-of-esxi-servers/
  - Link: https://www.reddit.com/r/esxi/comments/10txpje/i_was_attack_by_esxi_ransomware_and_the_attack/
  - Link: https://www.varonis.com/blog/vmware-esxi-in-the-line-of-ransomware-fire
  - Link: https://www.hybrid-analysis.com/sample/be5d2e94c2498ec052fb025e3348085e418c856dd43080501acfe2067ba54c41/6553b8f44c06e50d5408581f
Acknowledgement:
  - Person: Michael Dawson

---

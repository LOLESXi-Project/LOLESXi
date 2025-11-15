---
Name:  esxcli
Description: esxcli is a command-line interface (CLI) tool (which is a python script) used to manage VMware ESXi hosts. Using esxcli, administrators can perform various tasks related to ESXi host management, including network configuration, storage management, and VM operations.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2024-08-27
Commands:
  - Command: esxcli --formatter=csv --format-param=fields=="WorldID,DisplayName" vm process list
    Description: Provides a CSV output of running Virtual Machines with its corresponding WorldID and DisplayName.
    Usecase: Provides a list of running Virtual Machines with their WorldID and Displayname in CSV format
    Category: Lists VMs
    Privileges: Administrator
    MitreID: T1082
    OperatingSystem: ESXi
    ProceduralExamples:
    - esxcli --formatter=csv vm process list
    - /bin/sh -c esxcli vm process list > list
    - esxcli vm process list
  - Command: esxcli vm process kill --type=force --world-id=796791
    Description: Terminates a Virtual Machine using its World ID.
    Usecase: Force terminates a VM using the WorldID when Soft or Hard terminates options fail. Soft termination allows the guest OS to gracefully shut down.This is similar to kill-SIGTERM. Gard mode immediately terminates a Virtual Machine using its World ID. It kills the VMX process and is similar to a kill -9 command
    Category: terminate vm
    Privileges: Administrator
    MitreID: T1489
    OperatingSystem: ESXi
    ProceduralExamples:
    - esxcli vm process kill –type=hard –world-id=<ID>
    - esxcli vm process kill -w <WID> -t soft
    - esxcli --formatter=csv --format-param=fields=="WorldID,DisplayName" vm process list | awk -F "\"*,\"*" '{system("esxcli vm process kill --type=force --world-id=" $1)}'
    - "For i in ‘esxcli VM Process List | grep “World ID” | awk ‘{print $3}”; do esxcli vm process kill -t=force -w=$i;done;"
  - Command: esxcli system version get
    Description: Display the product name, version and build information.
    Usecase: An adversary may use this to obtain the exact build version information of the ESXi host to facilitate subsequent actions.
    Category: system information
    Privileges: Administrator
    MitreID: T1082
    OperatingSystem: ESXi
  - Command: esxcli system hostname get
    Description: Shows FQDN of the ESXi host.
    Usecase: FQDN of the host can be used as part of infrastructure information gathering operations.
    Category: system information
    Privileges: Administrator
    MitreID: T1082
    OperatingSystem: ESXi
  - Command: esxcli system account list
    Description: Displays a list of local accounts in the ESXi host.
    Usecase: An adversary may use the list of local accounts and use them for subsequent opeations. CSV output option was selected in certain operations.
    Category: account enumeration
    Privileges: Administrator
    MitreID: T1087.001
    OperatingSystem: ESXi
    ProceduralExamples:
     - esxcli --formatter=csv system account list
  - Command: esxcli storage filesystem list
    Description: Shows all the volumes available on the ESXi host.
    Usecase: An adversary may use this command to gain visibility of different volumes attached to the ESXi host. An adversary may use this command to gain visibility of different volumes attached to the ESXi host within /vmfs/volumes folder. This location usually holds data related to VMs.
    Category: discover storage
    Privileges: Administrator
    MitreID: T1082
    OperatingSystem: ESXi
    ProceduralExamples:
    - esxcli storage filesystem list | grep "/vmfs/volumes/" | awk -F'  ' '{print $2}'
  - Command: /bin/sh -c "esxcli system welcomemsg set -m=""
    Description: Changes the ESXi Welcome Message on the Direct Console User Interface (DCUI).
    Usecase: An adversary changes the welcome message on the DCUI with ransomware notification.
    Category: change display information
    Privileges: Administrator
    MitreID: T1491.001
    OperatingSystem: ESXi
  - Command: esxcli network firewall set --enabled false
    Description: Disables the ESXi firewall.
    Usecase: An adversary changes the ESXi host based firewall so it will cause minimum interference with their operations.
    Category: disable service
    Privileges: Administrator
    MitreID: T1562.004
    OperatingSystem: ESXi
  - Command: esxcli network firewall set --default-action true
    Description: Changes the ESXi firewall default action to PASS. Command is inferred based on vendor documentation, not available via CTI.
    Usecase: An adversary sets the default firewall action to allow all incoming and outgoing traffic.
    Category: modify service
    Privileges: Administrator
    MitreID: T1562.004
    OperatingSystem: ESXi
    ProceduralExamples:
      - esxcli network firewall set -d true
  - Command: esxcli vsan debug vmdk list
    Description: List the status of VMDKs in vSAN.
    Usecase: An adversary carries out enumeration of storage.
    Category: discover storage
    Privileges: Administrator
    MitreID:
    OperatingSystem: ESXi
  - Command: esxcli --format-param=fields=="Type,ObjectUUID,Configuration" vsan debug object list
    Description: List the UUID of the vSAN objects.
    Usecase: An adversary carries out enumeration of storage objects.
    Category: discover storage
    Privileges: Administrator
    MitreID:
    OperatingSystem: ESXi
  - Command: esxcli --formatter=csv --format-param=fields=="Device,DevfsPath" storage core device list
    Description: List the Devfs Path of the devices currently registered with the storage.
    Usecase: An adversary carries out enumeration of devices connected to storage.
    Category: discover storage
    Privileges: Administrator
    MitreID:
    OperatingSystem: ESXi
  - Command: esxcli --formatter=csv network ip interface ipv4 get
    Description: Displays network interface details.
    Usecase: An adversary may obtain information regarding network interfaces available in the ESXi host.
    Category: discover network info
    Privileges: Administrator
    MitreID:
    OperatingSystem: ESXi
    ProceduralExamples:
    - esxcli --formatter=csv network ip interface ipv4 get
  - Command: esxcli software vib install -f --no-sig-check
    Description: Install a VIB without checking the signature.
    Usecase: To bypass additional validation when installing malicious VIBs, an adversary uses the force and no signature checking switches. Malicious VIBs are used to maintain persistent and command execution capability with an ESXi host and its guest VMs.
    Category: software operation
    Privileges: Administrator
    MitreID:
    OperatingSystem: ESXi
  - Command: esxcli software acceptance set --level CommunitySupported
    Description: Changes the VIB acceptance level to CommunitySupported.
    Usecase: ESXi by default will require it to be signed and by default set to PartnerSupported level. An adversary may change the VIB acceptance level to CommunitySupported level prior to running VIB installation.
    Category: software operation
    Privileges: Administrator
    MitreID:
    OperatingSystem: ESXi
  - Command: esxcli system syslog config set --logdir=/tmp
    Description:  Changes the syslog directory using esxcli. This is followed by the command esxcli system syslog reload
    Usecase: An adversary may change the default directory where syslog log files are written to evade detection.
    Category: modify logging
    Privileges: Administrator
    MitreID: T1562.012
    OperatingSystem: ESXi
    ProceduralExamples:
      - /bin/sh -c 'esxcli system syslog config set --logdir=/tmp'
  - Command: esxcli system coredump file set --unconfigure
    Description:  Disable creation of coredumps in ESXi
    Usecase: An adversary may disable coredump creation to prevent diagnostic data from being generated. This is to prevent traces of their activity from being available for inspection during investigations.
    Category: modify service
    Privileges: Administrator
    MitreID: T1562.001
    OperatingSystem: ESXi
    ProceduralExamples:
      - /bin/sh -c 'esxcli system coredump file set --unconfigure' 
    Tags:
     - E-Crime: PINCHY SPIDER
     - E-Crime: REvix
     - E-Crime: Rhysida
     - E-Crime: VIKING SPIDER
     - E-Crime: Ragnar Locker
     - E-Crime: RansomHouse
     - E-Crime: Darkside
     - E-Crime: Qilin
     - E-Crime: Blacksuit
     - E-Crime: ESXiArgs
     - E-Crime: Nevada
     - E-Crime: Blackcat
     - E-Crime: Royal Ransomware
     - E-Crime: Lockbit
     - E-Crime: Revil
     - E-Crime: Howling Scorpius
     - E-Crime: Helldown
     - E-Crime: Kraken
     - APT: UNC3886
Full_Path:
  - Path: /bin/esxcli
  - Path: /sbin/esxcli
Detection:
  - Sigma: https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_esxcli_system_discovery.yml
  - Sigma: https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_esxcli_vm_kill.yml
  - Sigma: https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_esxcli_vsan_discovery.yml
  - Sigma: https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_esxcli_vm_discovery.yml
  - Sigma: https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_esxcli_storage_discovery.yml
  - Sigma: https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_esxcli_network_discovery.yml
  - Elastic: https://github.com/elastic/detection-rules/blob/main/rules/linux/impact_esxi_process_kill.toml
AtomicTests:
  - https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1082/T1082.md#atomic-test-31---esxi---vm-discovery-using-esxcli
  - https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1082/T1082.md#atomic-test-32---esxi---darkside-system-information-discovery
  - https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1129/T1129.md#atomic-test-1---esxi---install-a-custom-vib-on-an-esxi-host
  - https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1529/T1529.md#atomic-test-14---esxi---avoslocker-enumerates-vms-and-forcefully-kills-vms
  - https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1562.010/T1562.010.md#atomic-test-2---esxi---change-vib-acceptance-level-to-communitysupported-via-esxcli
  - https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1562.010/T1562.010.md#atomic-test-1---esxi---change-vib-acceptance-level-to-communitysupported-via-powercli
Resources:
  - Link: https://www.crowdstrike.com/blog/hypervisor-jackpotting-ecrime-actors-increase-targeting-of-esxi-servers/
  - Link: https://www.trendmicro.com/en_us/research/22/a/analysis-and-Impact-of-lockbit-ransomwares-first-linux-and-vmware-esxi-variant.html
  - Link: https://www.fortinet.com/blog/threat-research/royal-ransomware-targets-linux-esxi-servers
  - Link: https://www.cybereason.com/blog/cybereason-vs.-blackcat-ransomware
  - Link: https://www.varonis.com/blog/vmware-esxi-in-the-line-of-ransomware-fire
  - Link: https://cloudsek.com/blog/analysis-of-files-used-in-esxiargs-ransomware-attack-against-vmware-esxi-servers
  - Link: https://gist.githubusercontent.com/manualbashing/4955642aa81d74c3c5221a698abfe381/raw/2e7ad84449c875821b31455ae1f4193bfde8b05f/freqStunnedVMs.sh
  - Link: https://www.trendmicro.com/vinfo/au/threat-encyclopedia/malware/ransom.linux.blacksuit.theodbc
  - Link: https://vdc-repo.vmware.com/vmwb-repository/dcr-public/24be7af7-d9cd-48d9-bab8-8c91614be19d/0ca33108-8017-4b40-86b9-f066456894ea/doc/GUID-53C7D50E-1C8D-486D-89FF-E69B0A77E406.html
  - Link: https://www.bleepingcomputer.com/news/security/linux-version-of-qilin-ransomware-focuses-on-vmware-esxi/
  - Link: https://www.trellix.com/en-au/blogs/research/ransomhouse-am-see/
  - Link: https://www.trendmicro.com/en_us/research/21/e/darkside-linux-vms-targeted.html
  - Link: https://x.com/malwrhunterteam/status/1704974867542532286/photo/3
  - Link: https://cloud.google.com/blog/topics/threat-intelligence/vmware-esxi-zero-day-bypass
  - Link: https://cloud.google.com/blog/topics/threat-intelligence/esxi-hypervisors-malware-persistence
  - Link: https://blogs.vmware.com/vsphere/2011/09/whats-in-a-vib.html
  - Link: https://www.hybrid-analysis.com/sample/be5d2e94c2498ec052fb025e3348085e418c856dd43080501acfe2067ba54c41/6553b8f44c06e50d5408581f
  - Link: https://www.forescout.com/resources/rise-in-linux-ransomware/
  - Link: https://www.reversinglabs.com/blog/gwisinlocker-ransomware-targets-south-korean-industrial-and-pharmaceutical-companies
  - Link: https://developer.broadcom.com/xapis/esxcli-command-reference/7.0.0/
  - Link: https://cloud.google.com/blog/topics/threat-intelligence/vmware-detection-containment-hardening
  - Link: https://unit42.paloaltonetworks.com/threat-assessment-howling-scorpius-akira-ransomware/
  - Link: https://labs.yarix.com/2025/01/zyxel-vulnerability-exploited-by-helldown-ransomware-group/
  - Link: https://blog.talosintelligence.com/kraken-ransomware-group/
Acknowledgement:
  - Person: Michael Dawson
  - Person: Junestherry Dela Cruz
  - Person: Geri Revay
  - Person: Tom Fakterman
  - Person: Ohav Peri
  - Person: Jason Hill
  - Person: Mehardeep Singh Sawhney
  - Person: Lawrence Abrams
  - Person: MalwareHunterTeam
    Handle: '@malwarehunterteam'
  - Person: MalwareHunterTeam
  - Person: Pham Duy Phuc
  - Person: Max Kersten
  - Person: Noël Keijzer
  - Person: Michaël Schrijver
  - Person: Germán Fernández
    Handle: '@1ZRR4H'
  - Person: Mina Naiim
  - Person: Cj Arsley Mateo
  - Person: Darrel Tristan Virtusio
  - Person: Sarah Pearl Camiling
  - Person: Andrei Alimboyao
  - Person: Nathaniel Morales
  - Person: Jacob Santos
  - Person: Earl John Bareng
  - Person: Alexander Marvi
  - Person: Brad Slaybaugh
  - Person: Ron Craft
  - Person: Rufus Brown
  - Person: Alexander Marvi
  - Person: Jeremy Koppen
  - Person: Tufail Ahmed
  - Person: Jonathan Lepore
  - Person: Joseph Edwards
  - Person: Yoav Zemah
  - Person: Claudio Vozza
  - Person: Chetan Raghuprasad
  - Person: Michael Szeliga
---

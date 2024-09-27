## Structure

Each LOLESXi binary is defined in a file in the [`_lolesxi/Binaries`] folder named as `<binary name>.md`, such file consists only of a [YAML] front matter which describes the binary and its functions.

The full syntax is the following:
```
---
Name: 
Description: 
Author: 
Created: 
Commands:
  - Command:
    Description:
    Usecase:
    Category: 
    Privileges: 
    MitreID: 
    OperatingSystem: 
    Tags:
     - 
    ProceduralExamples: 
    - 
Full_Path:
  - Path:
Detection:
  - Sigma:
Resources:
  - Link:
Acknowledgement:
  - Person:
```

Where `FUNCTION` is one of the values described in the [`_data/functions.yml`] file.

Feel free to use any file in the [`_lolesxi/Binaries`] folder as an example.

## Pull request process

inaries and techniques that only works on certain verions of ESXi shall be noted in the `description` field.

Before sending a pull request of a new binary or function, ensure the following:

1. Verify the function works on at least one version of ESXi and specify the version where it was tested.
2. Include reference articles which were used to construct the contribution

Pull requests adding new functions in [`_data/functions.yml`] are allowed and subjected to project maintainers vetting.

[YAML]: https://yaml.org/
[`_gtfobins/`]: https://github.com/LOLESXi-Project/LOLESXi/tree/main/_lolesxi/Binaries
[`_data/functions.yml`]: https://github.com/LOLESXi-Project/LOLESXi/tree/main/_data/functions.yml
---
title: 'Azure - Introduction to ARM templates'
date: '2021-05-16'
tags: ['cloud', 'azure']
draft: false
summary: 'Learn how to use ARM templates to perform consistent resource deployments on Azure'
image: '/static/images/article-images/java-records.jpg'
---

While working in a cloud-based environment, we are rapidly creating and deploying new resources. Azure provides few different ways to deploy new resources. Let's have a quick look:
**Portal** - GUI-based. Select the type of resource and set its properties. Azure will validate the settings provided by you and deploy the resource. 2. **Azure CLI(Bash)/Powershell/Cloudshell** - Create resources using a command-line interface. Settings are provided as options while running commands. Can perform the same tasks as portal and some additional tasks like running powershell or bash scripts after resources are created. Scripts can also be used to group multiple tasks which should be performed together. 3. **Azure Resource Manager** - Uses a template that contains the same information as we were providing in other tools. Main advantage over other tools is that the template can be shared across the team and can serve as the single source of truth regarding resource configurations. No developer or admin needs to remember the configurations to be used.

![](https://res.cloudinary.com/practicaldev/image/fetch/s--lSDx_4mt--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i1ldab6lmtm0fv63l1a9.png)

### Features of ARM templates

1. **Declarative Syntax** - Uses a JSON to describe properties
2. **Repeatable results** - Multiple deployments of the template lead to exact same results.
3. **Can run external scripts** - It can include additional scripts to be run after resources are created.
4. **Validation** - The template is validated before creating any resources. For e.g. if multiple resources are declared to be created and one of them has a wrong configuration, the entire creation will not execute. This is useful for resources that are always created together. For e.g. VMs and Vnets.
5. **Integrates with CI/CD** - Can be part of deployment pipeline where resources need to be created before deploying code. One common use is for Dev/Test environments.

Let's have a look at a sample template and identify its different components
https://raw.githubusercontent.com/Abh1navv/azure-quickstart-templates/master/101-vm-simple-linux/azuredeploy.json

This template is used to create a Linux VM on Azure. You can find details of the template at its [github repo](https://github.com/Abh1navv/azure-quickstart-templates/tree/master/101-vm-simple-linux).

**Note:** We usually do not create templates from scratch. There are easy ways to extract template from a running resource and modify/reuse it as per our need. Check [this blog](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/export-template-portal) for steps to extract a template using Portal.

Let's look at a few important details from this sample.

### Components of an ARM template

- **Parameters** - Parameters which can be accepted while deploying the template. Example from above

```json
"parameters": {
    "vmName": {
      "type": "string",
      "defaultValue": "simpleLinuxVM",
      "metadata": {
        "description": "The name of you Virtual Machine."
      }
    },
"authenticationType": {
      "type": "string",
      "defaultValue": "password",
      "allowedValues": [
        "sshPublicKey",
        "password"
      ],
      "metadata": {
        "description": "Type of authentication to use on the Virtual Machine. SSH key is recommended."
      }
    }
}
```

_vmName_ is the variable that the user can use to set name for the new VM. Optionally user can keep it empty and a _defaultValue_ will be used. You can also specify limits on user inputs - In the second parameter _authenticationType_, we are specifying that only _allowedValues_ are "sshPublicKey" and "password".

- **Variables and Functions**- Same as in any programming language, additional variables and functions can be defined for re-use while setting other properties.
  Variables example:

```json
"osDiskType": "Standard_LRS",
"subnetAddressPrefix": "10.1.0.0/24",
"addressPrefix": "10.1.0.0/16",
```

Function example:

```json

      "namespace": "quickstart",
      "members": {
        "uniqueName": {
          "parameters": [
            {
              "name": "namePrefix",
              "type": "string"
            }
          ],
          "output": {
            "type": "string",
            "value": "[concat(toLower(parameters('namePrefix')), uniqueString(resourceGroup().id))]"
          }
        }
      }
    }
```

Checks that the provided parameter _namePrefix_ is unique. It is then used when we are setting our VM name.

- **Resources** - Define resources to create and their properties based on parameters provided and default values.

```json
{
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2020-06-01",
  "name": "[quickstart.uniqueName(parameters('vmName'))]",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[resourceId('Microsoft.Network/networkInterfaces/', variables('networkInterfaceName'))]"
  ],
  "properties": {
    "hardwareProfile": {
      "vmSize": "[parameters('VmSize')]"
    },
    "storageProfile": {
      "osDisk": {
        "createOption": "fromImage",
        "managedDisk": {
          "storageAccountType": "[variables('osDiskType')]"
        }
      },
      "imageReference": {
        "publisher": "Canonical",
        "offer": "UbuntuServer",
        "sku": "[parameters('ubuntuOSVersion')]",
        "version": "latest"
      }
    },
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "[resourceId('Microsoft.Network/networkInterfaces', variables('networkInterfaceName'))]"
        }
      ]
    },
    "osProfile": {
      "computerName": "[parameters('vmName')]",
      "adminUsername": "[parameters('adminUsername')]",
      "adminPassword": "[parameters('adminPasswordOrKey')]",
      "linuxConfiguration": "[if(equals(parameters('authenticationType'), 'password'), json('null'), variables('linuxConfiguration'))]"
    }
  }
}
```

Have a look at how the syntax uses parameters, functions and variables:
_name_ - we are using parameter _vmName_ which we talked about earlier and checking if its unique with function defined above.
_dependsOn_ - defines the resources that should be available before creating the VM. It also makes use of variable _networkInterfaceName_ to specify the network interface dependency.

- **Outputs** - Details about created resources. The template deployment will return an object corresponding to each created resource. We can use the resource name to further read details of created resource.
  Example

```json
"hostname": {
      "type": "string",
      "value": "[reference(variables('publicIPAddressName')).dnsSettings.fqdn]"
    }
```

This code will look for _publicIPAddressName_ object and read its dnsSettings.fqdn field to return its fully qualified domain name and return it with the output variable _hostname_. This is very useful in CI/CD workflows where we need resource details to immediately interact with it.

### Deploy resources using the template

So we have now looked at the basic building blocks. Let's go ahead and see how to deploy the template using CLI.

Before deploying the template, make sure you are logged in to the CLI client -> select a subscription -> create resource group if it doesn't already exist.

Once we are ready, we can run the below command to deploy our templates.

```bash
az group deployment create --name "name of your deployment" --resource-group "resource-group" --template-file "./azuredeploy.json"
```

CLI will ask for required parameter upon execution. It will use default values wherever you do not provide values.
![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lc7fwsw90uefsa3pfz09.png)
An alternate way is to use parameter files in which case we modify our command to point to a JSON to pick the parameters from. This also works great in automation workflows. The syntax is as below:

```bash
az group deployment create --name "name of your deployment" --resource-group "resource-group" --template-file "./azuredeploy.json" --parameters @azure.parameters.json
```

Note: There are multiple ways to deploy templates. CLI is just an example. For more examples, check [microsoft blogs](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-portal)

Once all values are provided, the deployment will be created -> accepted or rejected -> deployed if valid.

Thanks for reading! Stay tuned for more on Azure.

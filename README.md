# Virtual Screening Tool (ViSeT)
ViSeT is designed to provide easy to use tool for virtual screening with 
focus on the methods of ligand/based virtual screening.

### Requirements and dependencies
* Python 3.5
* Node.js
* RDKit (optional - required by core plugins)

## Installation 
As of now there is installation process, instead the ViSet can be used directly 
from the project directory.

Before you continue please make sure that all the dependencies have been
installed and that `python`, `npm` and `node` command are in the system
path (can be started from the terminal).

Before ViSet can be started it is necessary to install NodeJs libraries,
using commands:
```
cd web_server
npm install
cd ..
```

Once the libraries are installed the ViSeT can be started using:
```
cd web_server
node server.js
```

Now you can access the frontend on address `http://localhost:8050`. 

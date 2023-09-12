export const copyKubeConfigDotSh = `#!/bin/bash -i

# Copies localhost's ~/.kube/config file into the container and swap out localhost
# for host.docker.internal whenever a new shell starts to keep them in sync.
if [ "$SYNC_LOCALHOST_KUBECONFIG" = "true" ] && [ -d "/usr/local/share/kube-localhost" ]; then
    mkdir -p $HOME/.kube
    sudo cp -r /usr/local/share/kube-localhost/* $HOME/.kube
    sudo chown -R $(id -u) $HOME/.kube
    sed -i -e "s/localhost/host.docker.internal/g" $HOME/.kube/config
    sed -i -e "s/127.0.0.1/host.docker.internal/g" $HOME/.kube/config

    # If .minikube was mounted, set up client cert/key
    if [ -d "/usr/local/share/minikube-localhost" ]; then
        mkdir -p $HOME/.minikube
        sudo cp -r /usr/local/share/minikube-localhost/ca.crt $HOME/.minikube
        # Location varies between versions of minikube
        if [ -f "/usr/local/share/minikube-localhost/client.crt" ]; then
            sudo cp -r /usr/local/share/minikube-localhost/client.crt $HOME/.minikube
            sudo cp -r /usr/local/share/minikube-localhost/client.key $HOME/.minikube
        elif [ -f "/usr/local/share/minikube-localhost/profiles/minikube/client.crt" ]; then
            sudo cp -r /usr/local/share/minikube-localhost/profiles/minikube/client.crt $HOME/.minikube
            sudo cp -r /usr/local/share/minikube-localhost/profiles/minikube/client.key $HOME/.minikube
        fi
        sudo chown -R $(id -u) $HOME/.minikube

        # Point .kube/config to the correct locaiton of the certs
        sed -i -r "s|(\s*certificate-authority:\s).*|\\1$HOME\/.minikube\/ca.crt|g" $HOME/.kube/config
        sed -i -r "s|(\s*client-certificate:\s).*|\\1$HOME\/.minikube\/client.crt|g" $HOME/.kube/config
        sed -i -r "s|(\s*client-key:\s).*|\\1$HOME\/.minikube\/client.key|g" $HOME/.kube/config
    fi

    # Disable TLS checks (otherwise the server's certificate hostname verification may fail)
    # TODO: Make this optional
    sed -i -r "s|(\s*)(certificate-authority:\s).*|\\1insecure-skip-tls-verify: true|g" $HOME/.kube/config
    sed -i -r "s|(\s*)(certificate-authority-data:\s.*)|\\1insecure-skip-tls-verify: true|g" $HOME/.kube/config
fi
`;

export const devContainerDotJson = `// For format details, see https://aka.ms/devcontainer.json. For config options, see the README at:
// https://github.com/microsoft/vscode-dev-containers/tree/v0.166.1/containers/typescript-node
{
	"name": "Polaris Development Environment (Based on Node.js & TypeScript)",
	"build": {
		"dockerfile": "Dockerfile",
		// Update 'VARIANT' to pick a Node version: 10, 12, 14
		"args": {
			"VARIANT": "18"
		}
	},
	"remoteEnv": {
		"SYNC_LOCALHOST_KUBECONFIG": "true"
	},

	"mounts": [
		"source=/var/run/docker.sock,target=/var/run/docker-host.sock,type=bind",
		"source=\${env:HOME}\${env:USERPROFILE}/.kube,target=/usr/local/share/kube-localhost,type=bind",
		// Uncomment the next line to also sync certs in your .minikube folder
		"source=\${env:HOME}\${env:USERPROFILE}/.minikube,target=/usr/local/share/minikube-localhost,type=bind"
	],
	// Set *default* container specific settings.json values on container create.
	"settings": {
		"terminal.integrated.shell.linux": "/bin/bash"
	},

	// Add the IDs of extensions you want installed when the container is created.
	"extensions": [
		"dbaeumer.vscode-eslint"
	],

	// Use 'forwardPorts' to make a list of ports inside the container available locally.
	"forwardPorts": [],

	// Use 'postCreateCommand' to run commands after the container is created.
	"postCreateCommand": "cd ./ts && npm --silent install",

	// throws error code or code-insiders is not installed
	//"postStartCommand": "cd ./ts && code .",
	// Debug info
	//"postStartCommand": "whoami && pwd && . /usr/local/share/copy-kube-config.sh && kubectl config view && kubectl cluster-info",
	// Register CRDs - TODO remove this once CLI implements this
	"postStartCommand": ". /usr/local/share/copy-kube-config.sh && kubectl apply -f ./ts/crds/kubernetes",


	// Comment out connect as root instead. More info: https://aka.ms/vscode-remote/containers/non-root.
	"remoteUser": "node"
}
`

export const dockerfile = `# See here for image contents: \
https://github.com/microsoft/vscode-dev-containers/tree/v0.166.1/containers/typescript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 14, 12, 10
ARG VARIANT="18-buster"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-\${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \\
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install \${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"

# Install kubectl
RUN curl -sSL -o /usr/local/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/$(curl \
 -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl \\
    && chmod +x /usr/local/bin/kubectl

COPY copy-kube-config.sh /usr/local/share/
# FIXME username 'node'
RUN chown node:root /usr/local/share/copy-kube-config.sh \\
    && echo "source /usr/local/share/copy-kube-config.sh" | tee -a /root/.bashrc /root/.zshrc /home/node/.bashrc >> /home/node/.zshrc`;

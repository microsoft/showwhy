# This is an example of getting the ShowWhy GUI working from an Azure Ubuntu VM

## Please perform manually each step as there will be prompt and decisions to make if not tweaks for your version of the environment

1. Create an Ubuntu VM (this was tested with ubuntu 20.04 LTS Gen2, X64, Standard_E2sV3)
	a.	Allow HTTP (80)
	b.	Ensure port 3000 is opened (After setting the VM up, go to Networking and add an inbound port rule, give it a high priority, say 100) - The Showwhy - container creates a web app that uses this port
2. Install Docker Desktop which includes both docker and docker-compose
    ```bash
	sudo apt install gnome-terminal
	sudo apt remove docker-desktop
	rm -r $HOME/.docker/desktop
	sudo rm /usr/local/bin/com.docker.cli
	sudo apt purge docker-desktop
	
	sudo apt-get update
	sudo apt-get install ca-certificates curl gnupg lsb-release
	sudo mkdir -p /etc/apt/keyrings
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
	echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu   $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
	sudo apt-get update
	sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
	```

3. Get the showwhy repo - remember to change directory to where you want it to land
	```bash
    cd <where you want the repo>
	git clone "https://github.com/microsoft/showwhy"
	chmod -R 777 showwhy
	```

4. Now we are ready to do the magic - duplicate the container and envoke it - this will create a the web-app
	```bash
    cd showwhy
	sudo docker compose --profile all up
	```
	### this will take awhile, lets hope your session does not time out. In the meantime I'll have my coffee straight no sugar thanks.
	### When it gets to "... Webpack built preview ..." - the webapp is waiting for you.

5. In a new web browser tab go to *http://<your vm ip address>:3000*  - the GUI should appear
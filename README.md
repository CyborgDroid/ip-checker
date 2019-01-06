Most internet providers charge extra for static IPs. This keeps track of the IP address on the machine and sends you an email when it changes. 

To use:

```
git clone https://github.com/CyborgDroid/ip-checker.git
cd ip-checker
npm install
```

Edit the credentials-sample.json and save as credentials.json

```
node public_ip_check.js
```

Optional auto-run when computer boots up (UBUNTU instructions):

```
sudo npm install pm2@latest -g
pm2 start public_ip_check.js
pm2 save
pm2 startup
```

copy and paste what pm2 tells you to

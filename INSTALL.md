## Instructions for your own local instance of UPDB

Install Debian 11 onto VM

```bash
sudo apt update && apt-upgrade
sudo apt install -y ufw nginx wget gnupg2 xz-utils curl gnupg2 ca-certificates lsb-release rsync

# ssh
sudo sed -i 's/#Port 22/Port 22000/g' /etc/ssh/sshd_config
service ssh restart

# firewall
sudo ufw default allow outgoing
sudo ufw default deny incoming
sudo ufw allow 22000
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# postgres 14 - needed for newest FTS parsing
sudo sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt -y update
sudo apt -y install postgresql-14

# postgREST API server
wget https://github.com/PostgREST/postgrest/releases/download/v9.0.0/postgrest-v9.0.0-linux-static-x64.tar.xz
tar -xf postgrest-v9.0.0-linux-static-x64.tar.xz
chmod +x ./postgrest
./postgrest -e > /etc/postgrest.conf
mv ./postgrest /usr/local/bin
sudo sed -i 's/user:pass@/authenticator:mysecretpassword@/g' /etc/postgrest.conf
sudo sed -i 's/dbname/phenomenon/g' /etc/postgrest.conf
sudo sed -i 's/db-schema = "public"/db-schema = "api"/g' /etc/postgrest.conf
sudo sed -i 's/db-anon-role = "postgres"/db-anon-role = "web_anon"/g' /etc/postgrest.conf
sudo sed -i 's/# db-max-rows = 1000/db-max-rows = 10000/g' /etc/postgrest.conf
# scp postgrest.service to /etc/systemd/system/postgrest.service
systemctl enable postgrest
systemctl start postgrest

# nginx to serve html/js + proxy postgrest api
sudo sed -i 's/server_tokens on/server_tokens off/g' /etc/nginx/nginx.conf
mkdir -p /var/www/updb.app/{html,logs}
touch /var/www/updb.app/html/index.html
touch /var/www/updb.app/logs/{access,error}.log
chown -R www-data:www-data /var/www/updb.app
# scp updb.app to /etc/nginx/sites-available/updb.app
ln -s /etc/nginx/sites-available/updb.app /etc/nginx/sites-enabled/
service nginx restart

# set up DNS A records now to point updb.app to public IP of VM

# https cert - needed for serving to public
# apt -y install certbot python3-certbot-nginx
# certbot --nginx

# add data
createdb phenomenon
# scp the backup to /tmp/, then...
gunzip -c /tmp/phenomenon.sql.gz | psql -v ON_ERROR_STOP=1 phenomenon


# test that everything automatically comes back up
# reboot
```

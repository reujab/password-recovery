#!/usr/bin/bash -e

cd /opt/recovery

# enables wired internet
systemctl start dhcpcd

# waits for internet connection
while ! ping -c 1 1.1.1.1; do true; done

# installs required packages
pacman -Sy --needed --noconfirm \
	chntpw \
	dialog \
	nodejs \
	npm \
	vim \
	wpa_supplicant \
	xorg \
	xorg-twm \
	xorg-xclock \
	xterm

# adds recovery user
if ! id recovery; then
	useradd -m recovery
fi

cp bash_profile /home/recovery/.bash_profile
cp xinitrc /home/recovery/.xinitrc

# blanks passwords
password=$(openssl passwd -1 -salt blank '')
sed -i "s/^root:.*/root:$password:17852::::::/" /etc/shadow
sed -i "s/^recovery:.*/recovery:$password:17852:0:99999:7:::/" /etc/shadow

#!/usr/bin/bash -e

cd /opt/recovery/init

# enables wired internet
systemctl start dhcpcd

# waits for internet connection
while ! ping -c 1 1.1.1.1; do true; done

# installs required packages
pacman -Sy --needed --noconfirm \
	cantarell-fonts \
	chntpw \
	compton \
	dialog \
	gtk3 \
	libxss \
	nodejs \
	npm \
	nss \
	openbox \
	sudo \
	vim \
	wpa_supplicant \
	xorg \
	xorg-twm \
	xorg-xclock \
	xterm

# hides grub
grep GRUB_TIMEOUT=0 /etc/default/grub || {
	echo GRUB_TIMEOUT=0 >> /etc/default/grub
	grub-mkconfig -o /boot/grub/grub.cfg
}

# adds recovery user
if ! id recovery; then
	useradd -m recovery
fi

cp bash_profile /home/recovery/.bash_profile
cp xinitrc /home/recovery/.xinitrc

# enables autologin
mkdir -p "/etc/systemd/system/getty@tty1.service.d"
cp override.conf "/etc/systemd/system/getty@tty1.service.d"

# blanks passwords
password=$(openssl passwd -1 -salt blank "")
sed -i "s/^root:.*/root:$password:17852::::::/" /etc/shadow
sed -i "s/^recovery:.*/recovery:$password:17852:0:99999:7:::/" /etc/shadow

# enables sudo without password for every user
grep "ALL ALL=(ALL) NOPASSWD: ALL" /etc/sudoers || {
	echo "ALL ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
}

# hides this file system from list
touch /.ignore

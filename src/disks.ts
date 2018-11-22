import * as child_process from "child_process"
import * as fs from "fs"
import * as ini from "ini"

export class CDisk {
	id: string
	name: string
	operatingSystems: COperatingSystem[]

	constructor(id: string, name: string) {
		this.id = id
		this.name = name
		this.operatingSystems = []
	}
}

export class COperatingSystem {
	id: string
	mountPoint: string
	name: string
	type: EOperatingSystem
	hostname: string
	users: CUser[]

	constructor(id: string) {
		this.id = id
	}
}

export enum EOperatingSystem {
	Windows,
	Linux,
}

export class CUser {
	os: COperatingSystem
	id: string
	name: string
	locked: boolean

	constructor(os: COperatingSystem, id: string) {
		this.os = os
		this.id = id
	}

	blankPassword() {
		switch (this.os.type) {
			case EOperatingSystem.Windows:
				try {
					child_process.execSync(String.raw`chntpw -i /mnt/${this.os.id}/Windows/System32/config/SAM <<< $'1\n${this.id}\n1\nq\nq\ny'`)
				} catch (err) {
					if (err.status !== 2) {
						throw err
					}
				}

				break
			case EOperatingSystem.Linux:
				// TODO
				break
		}
	}
}

export default function getDisks(): CDisk[] {
	const devices = fs.readdirSync("/dev")

	return devices.
		// Filters out every nonstorage device
		filter((device) => /^sd[a-z]+$/.test(device)).
		map((storageDevice) => {
			const disk = new CDisk(storageDevice, storageDevice)

			// Scans every partition on the disk for an operating system
			disk.operatingSystems = devices.
				filter((device) => device.startsWith(disk.id) && /^sd[a-z]+\d+$/.test(device)).
				filter((partition) => {
					const device = `/dev/${partition}`
					const mountPoint = `/mnt/${partition}`

					fs.mkdirSync(mountPoint)

					const status = child_process.spawnSync("mount", [
						device,
						mountPoint,
					]).status
					if (status !== 0) {
						fs.rmdirSync(mountPoint)
						return false
					}

					// The `.ignore` file is on the bootable media, so the user won't try to modify
					// the bootable media itself.
					const containsOS = !fs.existsSync(`${mountPoint}/.ignore`) && (fs.existsSync(`${mountPoint}/Windows/System32/config/SAM`) || fs.existsSync(`${mountPoint}/etc/shadow`))

					if (!containsOS) {
						child_process.spawnSync("umount", [mountPoint])
						fs.rmdirSync(mountPoint)
					}

					return containsOS
				}).
				map((partition) => {
					const os = new COperatingSystem(partition)
					os.mountPoint = `/mnt/${partition}`

					if (fs.existsSync(`${os.mountPoint}/Windows/System32/config/SAM`)) {
						os.type = EOperatingSystem.Windows

						// Operating system name
						// FIXME:
						try {
							os.name = child_process.execSync(String.raw`chntpw -e ${os.mountPoint}/Windows/System32/config/SOFTWARE <<< $'cat \Microsoft\Windows NT\CurrentVersion\ProductName\nq\n' | grep -E '^Windows'`).toString()
						} catch (err) {
							// Windows is probably hibernating.
							console.error(err)
							// TODO: display warning message
							os.name = "Hibernating Windows"
						}
						if (!os.name) {
							os.name = "Windows"
						}

						// Operating system hostname
						// FIXME:
						try {
							os.hostname = child_process.execSync(String.raw`chntpw -e ${os.mountPoint}/Windows/System32/config/SYSTEM <<< $'cat \ControlSet001\Control\ComputerName\ComputerName\ComputerName\nq' | sed '10q;d'`).toString()
						} catch (err) {
							console.error(err)
						}


						// Users
						// FIXME:
						try {
							os.users = child_process.
								execSync(String.raw`chntpw -l ${os.mountPoint}/Windows/System32/config/SAM`).
								toString().
								split("\n").
								filter((line) => /^\| [0-9a-f]/.test(line)).
								map((line) => {
									const fields = line.split("|")
									const user = new CUser(os, fields[1].trim())
									user.name = fields[2].trim()
									user.locked = fields[4].trim() === "dis/lock"
									return user
								})
						} catch (err) {
							console.error(err)
						}
					} else {
						os.type = EOperatingSystem.Linux

						// Operating system name
						try {
							os.name = ini.parse(`${fs.readFileSync(`${os.mountPoint}/etc/os-release`)}`).NAME
						} catch (err) {
							console.error(err)
						}
						if (!os.name) {
							os.name = "Linux"
						}

						// Operating system hostname
						try {
							os.hostname = `${fs.readFileSync(`${os.mountPoint}/etc/hostname`)}`
						} catch (err) {
							console.error(err)
						}

						// Users
						try {
							os.users = fs.
								readFileSync(`${os.mountPoint}/etc/passwd`).
								toString().
								split("\n").
								filter((line) => line).
								map((line) => {
									const fields = line.split(":")
									const user = new CUser(os, fields[2])
									user.name = fields[4] || fields[0]
									user.locked = fields[6].includes("nologin")
									return user
								})
						} catch (err) {
							console.error(err)
						}
					}

					return os
				})

			return disk
		}).
		// Filters out operating systems without operating systems
		filter((disk) => disk.operatingSystems.length)
}

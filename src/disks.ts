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
	const disks: CDisk[] = devices.
		filter((device) => /^sd[a-z]+$/.test(device)).
		map((disk) => new CDisk(disk, disk))

	for (const disk of disks) {
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

				const containsOS = !fs.existsSync(`${mountPoint}/.ignore`) && (fs.existsSync(`${mountPoint}/Windows/System32/config/SAM`) || fs.existsSync(`${mountPoint}/etc/shadow`))

				if (!containsOS) {
					child_process.spawnSync("umount", [mountPoint])
					fs.rmdirSync(mountPoint)
				}

				return containsOS
			}).
			map((partition) => {
				const mountPoint = `/mnt/${partition}`
				const os = new COperatingSystem(partition)

				if (fs.existsSync(`${mountPoint}/Windows/System32/config/SAM`)) {
					os.type = EOperatingSystem.Windows
				} else {
					os.type = EOperatingSystem.Linux
				}

				switch (os.type) {
					case EOperatingSystem.Windows:
						// operating system name
						// FIXME:
						try {
							os.name = child_process.execSync(String.raw`chntpw -e ${mountPoint}/Windows/System32/config/SOFTWARE <<< $'cat \Microsoft\Windows NT\CurrentVersion\ProductName\nq\n' | grep -E '^Windows'`).toString()
						} catch (err) {
							console.error(err)
							// TODO: display warning message
							os.name = "Hibernating Windows"
						}
						if (!os.name) {
							os.name = "Windows"
						}

						// operating system hostname
						// FIXME:
						try {
							os.hostname = child_process.execSync(String.raw`chntpw -e ${mountPoint}/Windows/System32/config/SYSTEM <<< $'cat \ControlSet001\Control\ComputerName\ComputerName\ComputerName\nq' | sed '10q;d'`).toString()
						} catch (err) {
							console.error(err)
						}


						// users
						// FIXME:
						try {
							os.users = child_process.
								execSync(String.raw`chntpw -l ${mountPoint}/Windows/System32/config/SAM`).
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

						break
					case EOperatingSystem.Linux:
						// operating system name
						try {
							// FIXME: potential security risk by buffering the entire file into memory
							os.name = ini.parse(`${fs.readFileSync(`${mountPoint}/etc/os-release`)}`).NAME
						} catch (err) {
							console.error(err)
						}
						if (!os.name) {
							os.name = "Linux"
						}

						// operating system hostname
						try {
							os.hostname = `${fs.readFileSync(`${mountPoint}/etc/hostname`)}`
						} catch (err) {
							console.error(err)
						}

						// users
						try {
							os.users = fs.
								readFileSync(`${mountPoint}/etc/passwd`).
								toString().
								split("\n").
								filter((line) => line).
								map((line) => {
									const fields = line.split(":")
									const user = new CUser(os, fields[2])
									user.name = fields[4] || fields[0]
									user.locked = /nologin/.test(fields[6])
									return user
								})
						} catch (err) {
							console.error(err)
						}

						break
				}

				return os
			})
	}

	// removes disks without operating systems
	return disks.filter((disk) => disk.operatingSystems.length)
}

import * as React from "react"
import Disk from "./Disk"
import OperatingSystem from "./Disk/OperatingSystem"
import { IPanelProps } from "@blueprintjs/core"
import { CDisk } from "../disks"
import Users from "./Disk/OperatingSystem/Users"

interface Props {
	disks: CDisk[]
}

export default class OperatingSystems extends React.Component<IPanelProps & Props> {
	render() {
		return this.props.disks.map((disk) => (
			<Disk
				key={disk.id}
				name={disk.name}
			>
				{disk.operatingSystems.map((os) => (
					<OperatingSystem
						key={os.id}
						onClick={() => this.props.openPanel({
							component: Users,
							props: {
								children: os.users,
							},
							title: os.name,
						})}
					>
						{os}
					</OperatingSystem>
				))}
			</Disk>
		))
	}
}

import * as React from "react"
import Disk from "./Disk"
import OperatingSystem from "./Disk/OperatingSystem"
import { IPanelProps } from "@blueprintjs/core"
import { CDisk } from "../disks"

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
					<OperatingSystem key={os.id}>{os}</OperatingSystem>
				))}
			</Disk>
		))
	}
}

import * as React from "react"
import Disk from "./Disk"
import { CDisk } from "../disks"
import { IPanelProps } from "@blueprintjs/core"

interface Props {
	children: CDisk[]
}

export default class Disks extends React.Component<IPanelProps & Props> {
	render() {
		return this.props.children.map((disk) => (
			<Disk
				key={disk.id}
				name={disk.name}
				openPanel={this.props.openPanel}
			>
				{disk.operatingSystems}
			</Disk>
		))
	}
}

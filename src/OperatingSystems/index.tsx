import * as React from "react"
import { IPanelProps } from "@blueprintjs/core"
import Disk from "./Disk"

export default class OperatingSystems extends React.Component<IPanelProps> {
	render() {
		return (
			<React.Fragment>
				<Disk name="Example Disk #1"></Disk>
				<Disk name="Example Disk #2"></Disk>
			</React.Fragment>
		)
	}
}

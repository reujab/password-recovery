import * as React from "react"
import Disk from "./Disk"
import OperatingSystem from "./Disk/OperatingSystem"
import { IPanelProps } from "@blueprintjs/core"
import { faLinux, faWindows } from "@fortawesome/free-brands-svg-icons"

export default class OperatingSystems extends React.Component<IPanelProps> {
	render() {
		return (
			<React.Fragment>
				<Disk name="Example Disk #1">
					{[
						<OperatingSystem
							key={Math.random()}
							icon={faWindows}
							title="Windows 7"
						/>,
						<OperatingSystem
							key={Math.random()}
							icon={faWindows}
							title="Windows 10"
						/>,
					]}
				</Disk>
				<Disk name="Example Disk #2">{[
					<OperatingSystem
						key={Math.random()}
						icon={faLinux}
						title="Ubuntu 16.04"
					/>,
				]}</Disk>
			</React.Fragment>
		)
	}
}

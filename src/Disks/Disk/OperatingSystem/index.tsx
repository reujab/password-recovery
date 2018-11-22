import * as React from "react"
import { COperatingSystem, EOperatingSystem } from "../../../disks";
import { Card } from "@blueprintjs/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLinux, faWindows } from "@fortawesome/free-brands-svg-icons"

interface Props {
	children: COperatingSystem
	onClick: () => void
}

export default class OperatingSystem extends React.Component<Props> {
	render() {
		return (
			<Card
				className="operating-system"
				elevation={1}
				interactive={true}
				onClick={this.props.onClick}
			>
				<FontAwesomeIcon icon={this.props.children.type === EOperatingSystem.Windows ? faWindows : faLinux} />
				<div className="description">
					<div className="title">{this.props.children.name}</div>
					<div className="hostname">{this.props.children.hostname}</div>
				</div>
			</Card>
		)
	}
}

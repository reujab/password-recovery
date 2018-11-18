import * as React from "react"
import { Card } from "@blueprintjs/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
	icon: any
	title: string
}

export default class OperatingSystem extends React.Component<Props> {
	render() {
		return (
			<Card className="operating-system" elevation={1} interactive={true}>
				<FontAwesomeIcon icon={this.props.icon} />
				<div className="description">
					<div className="title">{this.props.title}</div>
				</div>
			</Card>
		)
	}
}

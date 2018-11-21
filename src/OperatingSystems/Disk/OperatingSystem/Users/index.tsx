import * as React from "react"
import { CUser } from "../../../../disks"
import { Card, IPanelProps } from "@blueprintjs/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"

interface Props {
	children: CUser[]
}

export default class User extends React.Component<IPanelProps & Props> {
	render() {
		return this.props.children.map((user) => (
			<Card
				key={user.id}
				className="user"
				elevation={1}
				interactive={true}
				// TODO:
				onClick={() => console.log("TODO")}
			>
				<FontAwesomeIcon icon={faUser} />
				<div className="description">
					<div className="title">{user.name}</div>
				</div>
			</Card>
		))
	}
}

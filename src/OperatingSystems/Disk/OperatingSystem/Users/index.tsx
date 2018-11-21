import * as React from "react"
import { CUser } from "../../../../disks"
import { Card, IPanelProps } from "@blueprintjs/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import User from "./User"
import { faUser } from "@fortawesome/free-solid-svg-icons"

interface Props {
	children: CUser[]
}

export default class Users extends React.Component<IPanelProps & Props> {
	render() {
		return this.props.children.map((user) => (
			<Card
				key={user.id}
				className="user"
				elevation={1}
				interactive={true}
				// TODO:
				onClick={() => this.props.openPanel({
					component: User,
					props: {
						children: user,
					},
					title: user.name,
				})}
			>
				<FontAwesomeIcon icon={faUser} />
				<div className="description">
					<div className="title">{user.name}</div>
				</div>
			</Card>
		))
	}
}

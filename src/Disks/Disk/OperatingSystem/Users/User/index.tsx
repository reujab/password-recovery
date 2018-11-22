import * as React from "react"
import { CUser } from "../../../../../disks"
import { Button, Intent, IPanelProps, Toaster } from "@blueprintjs/core"

interface Props {
	children: CUser
}

export default class User extends React.Component<IPanelProps & Props> {
	render() {
		return (
			<div className="options">
				<Button
					className="option"
					fill={true}
					onClick={this.blankPassword.bind(this)}
				>
					Blank password
				</Button>
			</div>
		)
	}

	blankPassword() {
		const toast = Toaster.create({
			canEscapeKeyClear: false,
		})

		try {
			this.props.children.blankPassword()
			toast.show({
				intent: Intent.SUCCESS,
				message: `Successfully blanked ${this.props.children.name}'s password`,
			})
		} catch (err) {
			console.error(err)
			toast.show({
				intent: Intent.WARNING,
				message: "An unexpected error occurred",
			})
		}
	}
}

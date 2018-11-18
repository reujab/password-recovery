import * as React from "react"

interface Props {
	children: JSX.Element[]
	name: string
}

export default class Disk extends React.Component<Props> {
	render() {
		return !!this.props.children.length && (
			<fieldset className="disk">
				<legend>{this.props.name}</legend>

				{this.props.children}
			</fieldset>
		)
	}
}

import * as React from "react"

interface Props {
	// children: OperatingSystem[]
	name: string
}

export default class Disk extends React.Component<Props> {
	render() {
		return (
			<fieldset className="disk">
				<legend>{this.props.name}</legend>
			</fieldset>
		)
	}
}

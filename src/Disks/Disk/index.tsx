import * as React from "react"
import { COperatingSystem } from "../../disks"
import OperatingSystem from "../Disk/OperatingSystem"
import Users from "../Disk/OperatingSystem/Users"

interface Props {
	name: string
	children: COperatingSystem[]
	openPanel: ({ }) => void
}

export default class Disk extends React.Component<Props> {
	render() {
		return (
			<fieldset className="disk">
				<legend>{this.props.name}</legend>

				{this.props.children.map((os) => (
					<OperatingSystem
						key={os.id}
						onClick={() => this.props.openPanel({
							component: Users,
							props: {
								children: os.users,
							},
							title: os.name,
						})}
					>
						{os}
					</OperatingSystem>
				))}
			</fieldset>
		)
	}
}

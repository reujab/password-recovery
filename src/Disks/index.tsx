import * as React from "react"
import Disk from "./Disk"
import { Button, Intent, IPanelProps } from "@blueprintjs/core"
import { CDisk } from "../disks"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPowerOff } from "@fortawesome/free-solid-svg-icons"

interface Props {
	children: CDisk[]
}

export default class Disks extends React.Component<IPanelProps & Props> {
	render() {
		return (
			<div className="disks-wrapper">
				<div className="disks">
					{this.props.children.map((disk) => (
						<Disk
							key={disk.id}
							name={disk.name}
							openPanel={this.props.openPanel}
						>
							{disk.operatingSystems}
						</Disk>
					))}
				</div>
				<div className="shutdown-wrapper">
					<Button
						fill
						intent={Intent.DANGER}
						onClick={close}
						icon={<FontAwesomeIcon icon={faPowerOff} />}
					>
						Shutdown
					</Button>
				</div>
			</div>
		)
	}
}

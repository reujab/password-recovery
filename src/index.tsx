import * as React from "react"
import * as ReactDOM from "react-dom"
import * as child_process from "child_process"
import * as fs from "fs"
import Disks from "./Disks"
import Particles from "react-particles-js"
import getDisks, { CDisk } from "./disks"
import particles from "./particles"
import { Card, PanelStack } from "@blueprintjs/core"

interface State {
	showParticles: boolean
	disks: CDisk[]
}

class Index extends React.Component<{}, State> {
	constructor(props) {
		super(props)

		// This method must be bound here and not in `componentDidMount` because if it were bound in
		// `componentDidMount`, then `removeEventListener` would not remove the listener since
		// binding creates a new function.
		this.keyDown = this.keyDown.bind(this)
		this.state = {
			showParticles: true,
			disks: getDisks(),
		}
	}

	componentDidMount() {
		addEventListener("keydown", this.keyDown)
	}

	componentWillUnmount() {
		removeEventListener("keydown", this.keyDown)
	}

	keyDown(e) {
		if (e.key === "Escape") {
			this.setState({ showParticles: !this.state.showParticles })
		}
	}

	render() {
		return (
			<React.Fragment>
				{this.state.showParticles && <Particles
					className="particles"
					width={`${innerWidth}px`}
					height={`${innerHeight}px`}
					params={particles}
				/>}

				<Card className="main-card" elevation={4}>
					<PanelStack initialPanel={{
						component: Disks,
						props: {
							children: this.state.disks,
						},
						title: "Operating Systems",
					}} />
				</Card>
			</React.Fragment>
		)
	}
}

// Unmounts any potential mounts
for (const file of fs.readdirSync("/mnt")) {
	const mountPoint = `/mnt/${file}`
	child_process.spawnSync("umount", [mountPoint])
	fs.rmdirSync(mountPoint)
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Index />, document.getElementById("root"))
})

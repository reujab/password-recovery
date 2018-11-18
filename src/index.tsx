import * as React from "react"
import * as ReactDOM from "react-dom"
import OperatingSystems from "./OperatingSystems"
import Particles from "react-particles-js"
import getDisks, { CDisk } from "./disks"
import particles from "./particles"
import { Card, PanelStack } from "@blueprintjs/core"

interface State {
	showParticles: boolean
	disks: CDisk[]
}

class Index extends React.Component<any, State> {
	constructor(props) {
		super(props)

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

				<div className="content">
					<Card elevation={4}>
						<PanelStack initialPanel={{
							component: OperatingSystems,
							props: {
								disks: this.state.disks,
							},
							title: "Operating Systems",
						}} />
					</Card>
				</div>
			</React.Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Index />, document.getElementById("root"))
})

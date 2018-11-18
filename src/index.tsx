import * as React from "react"
import Particles from "react-particles-js"
import ReactDOM from "react-dom"
import particles from "./particles"

class Index extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Particles
					className="particles"
					width={`${innerWidth}px`}
					height={`${innerHeight}px`}
					params={particles}
				/>
			</React.Fragment>
		)
	}
}

addEventListener("DOMContentLoaded", () => {
	ReactDOM.render(<Index />, document.getElementById("root"))
})

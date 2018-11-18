const {app, BrowserWindow} = require("electron")

let window

app.on("ready", () => {
	window = new BrowserWindow({
		kiosk: true,
	})

	window.loadFile("dist/index.html")

	window.on("closed", function () {
		app.quit()
	})
})

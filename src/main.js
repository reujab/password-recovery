const {app, BrowserWindow} = require("electron")

let window

app.on("ready", () => {
	window = new BrowserWindow({
		kiosk: true,
	})

	window.loadURL("https://www.google.com/")

	window.on("closed", function () {
		app.quit()
	})
})

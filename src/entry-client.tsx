// @refresh reload
import { mount, StartClient } from "@solidjs/start/client"
import { track } from "@minimal-analytics/ga4"

mount(() => <StartClient />, document.getElementById("app")!)
track("G-WB2SQPS453", { type: "page_view", event: { app: "track-the-pros" } })

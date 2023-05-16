async function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    // await loadTool("AIScheduleTools")
    // 网页配置了权限不允许跨域加载 JavaScript
    let tab = dom.querySelector("div .bh-paper-pile-body")
    if (!tab) {
        // await AIScheduleAlert("请打开正确的网页")
        return "do not continue"
    }
    return tab.querySelector("table").innerHTML
}

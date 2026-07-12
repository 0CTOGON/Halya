document
    .getElementById("minimize")
    .onclick = () => {

        window.chrome.webview.postMessage("minimize");

    };


document
    .getElementById("close")
    .onclick = () => {

        window.chrome.webview.postMessage("close");

    };
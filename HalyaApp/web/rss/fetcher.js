export function fetchRSS(url) {

    return new Promise((resolve, reject) => {


        window.receiveRSS = (xml) => {

            resolve(xml);

        };


        if (
            window.chrome &&
            window.chrome.webview
        ) {

            window.chrome.webview.postMessage(
                "rss:" + url
            );

        } else {

            reject(
                new Error(
                    "Not running inside Halya WebView2"
                )
            );

        }


    });

}
export function fetchRSS(url) {


    return new Promise((resolve, reject) => {


        window.receiveRSS = (xml) => {

            resolve(xml);

        };



        window.chrome.webview.postMessage(
            "rss:" + url
        );


    });

}
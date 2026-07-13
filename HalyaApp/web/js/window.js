const minimize =
    document.getElementById("minimize");

const maximize =
    document.getElementById("maximize");

const close =
    document.getElementById("close");

const bar =
    document.getElementById("halyaBar");


minimize.onclick = () => {
    window.chrome.webview.postMessage("minimize");
};


maximize.onclick = () => {
    window.chrome.webview.postMessage("maximize");
};


close.onclick = () => {
    window.chrome.webview.postMessage("close");
};



let dragging = false;

let lastX = 0;

let lastY = 0;



bar.addEventListener(
    "mousedown",
    (event) => {

        // Don't drag when clicking buttons

        if (
            event.target.tagName === "BUTTON"
        ) {
            return;
        }


        dragging = true;


        lastX = event.screenX;

        lastY = event.screenY;


        event.preventDefault();

    }
);



document.addEventListener(
    "mouseup",
    () => {

        dragging = false;

    }
);



document.addEventListener(
    "mousemove",
    (event) => {

        if (!dragging)
            return;


        const dx =
            event.screenX - lastX;


        const dy =
            event.screenY - lastY;



        lastX = event.screenX;

        lastY = event.screenY;



        window.chrome.webview.postMessage(
            JSON.stringify({

                type: "drag",

                x: dx,

                y: dy

            })
        );

    }
);
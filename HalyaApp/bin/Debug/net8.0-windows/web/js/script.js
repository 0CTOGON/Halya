import { fetchRSS } from "../rss/fetcher.js";
import { parseFeed } from "../rss/parser.js";
import { normaliseItem } from "../rss/normalise.js";

import {
    showArticle
} from "./reader.js";

import {
    getFeeds,
    addFeed,
    removeFeed,
    markRead,
    isRead,
    getUnreadCount
} from "./feeds.js";


const feedContainer = document.getElementById("feed");
const feedList = document.getElementById("feedList");
const allFeedButton = document.getElementById("allFeed");

const addButton = document.getElementById("addFeed");
const input = document.getElementById("feedURL");

const articleCache = {};


function renderArticle(article) {

    const card = document.createElement("div");

    card.className = "article";

    if (!isRead(article.link)) {
        card.classList.add("unread");
    }

    card.innerHTML = `
        <h3>${article.title}</h3>
        <small>${article.source}</small>
    `;

    card.onclick = () => {

        markRead(article.link);

        card.classList.remove("unread");

        updateUnreadCounts();

        showArticle(article);

    };

    feedContainer.appendChild(card);
}


async function loadFeed(feed) {

    try {

        const xml = await fetchRSS(feed.url);

        console.log("RSS RESPONSE:", xml);

        const parsed = parseFeed(xml);

        const articles = parsed.items.map(normaliseItem);

        articles.forEach(article => {
            article.source = feed.name;
        });

        articleCache[feed.url] = articles;


        articles
            .slice(0, 10)
            .forEach(article => {
                renderArticle(article);
            });


    } catch (error) {

        console.error(error);

    }

    updateUnreadCounts();

}

function updateUnreadCounts() {

    document.querySelectorAll(".feed-item")
        .forEach(item => {

            const url = item.dataset.url;

            const articles = articleCache[url] || [];

            const count = getUnreadCount(articles);

            const badge =
                item.querySelector(".unread-count");

            if (count > 0) {

                if (badge) {
                    badge.textContent = count;
                } else {

                    const span =
                        document.createElement("span");

                    span.className = "unread-count";
                    span.textContent = count;

                    item.appendChild(span);
                }

            } else if (badge) {

                badge.remove();

            }

        });

}


function renderFeeds() {

    feedList.innerHTML = "";

    getFeeds().forEach(feed => {

        const container = document.createElement("div");

        container.className = "feed-item";
        container.dataset.url = feed.url;


        const button = document.createElement("button");
        button.textContent = feed.name;

        button.onclick = () => {
            feedContainer.innerHTML = "";
            loadFeed(feed);
        };

        button.innerHTML = `
            <span>${feed.name}</span>
        `;


        const remove = document.createElement("button");
        remove.textContent = "×";
        remove.className = "delete-feed";


        remove.onclick = () => {
        removeFeed(feed.url);
        renderFeeds();
    };


    container.append(
        button,
        remove
    );


    feedList.appendChild(container);

    });

}

allFeedButton.onclick = () => {

    feedContainer.innerHTML = "";

    const allArticles =
        Object.values(articleCache)
            .flat()
            .sort((a, b) =>
                new Date(b.published)
                -
                new Date(a.published)
            );


    allArticles
        .slice(0, 50)
        .forEach(article => {

            renderArticle(article);

        });

};

addButton.onclick = async () => {

    const url = input.value.trim();

    if (!url) return;

    const documentXML = await fetchRSS(url);

    const parsed = parseFeed(documentXML);

    addFeed({
        name: parsed.title,
        url
    });

    input.value = "";

    renderFeeds();

};

document
.getElementById("close")
.onclick = () => {

    window.chrome.webview.postMessage(
        "close"
    );

};



document
.getElementById("minimize")
.onclick = () => {

    window.chrome.webview.postMessage(
        "minimize"
    );

};



document
.getElementById("dragArea")
.onmousedown = () => {

    window.chrome.webview.postMessage(
        "drag"
    );

};

renderFeeds();
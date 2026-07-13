const STORAGE_KEY = "halya_feeds";

export function getFeeds() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveFeeds(feeds) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feeds));
}

export function addFeed(feed) {

    const feeds = getFeeds();

    feeds.push(feed);

    saveFeeds(feeds);

}

export function removeFeed(url) {

    const feeds = getFeeds()
        .filter(feed => feed.url !== url);

    saveFeeds(feeds);

}

export function markRead(link) {

    const read =
        JSON.parse(localStorage.getItem("halya-read") || "[]");

    if (!read.includes(link)) {
        read.push(link);
    }

    localStorage.setItem(
        "halya-read",
        JSON.stringify(read)
    );
}


export function isRead(link) {

    const read =
        JSON.parse(localStorage.getItem("halya-read") || "[]");

    return read.includes(link);
}

export function getUnreadCount(articles) {

    const read =
        JSON.parse(
            localStorage.getItem("halya-read") || "[]"
        );

    return articles.filter(
        article => !read.includes(article.link)
    ).length;

}
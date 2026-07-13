export function parseFeed(xmlString) {

    const parser = new DOMParser();

    const documentXML = parser.parseFromString(
    xmlString,
    "application/xml"
);

    // Check for XML parsing errors
    if (documentXML.querySelector("parsererror")) {
        throw new Error("Invalid XML");
    }

    // RSS feed?
    const channel = documentXML.querySelector("channel");
    if (channel) {
        return parseRSSChannel(channel);
    }

    // Atom feed?
    const feed = documentXML.querySelector("feed");
    if (feed) {
        return parseAtomFeed(feed);
    }

    throw new Error("Unsupported feed format");

}


function parseRSSChannel(channel) {

    return {

        title:
            channel.querySelector("title")
                ?.textContent
                ?.trim()
            || "Unnamed Feed",

        items:
            [...channel.querySelectorAll("item")]
                .map(item => {

                    const contentNode =
                        item.getElementsByTagNameNS(
                            "http://purl.org/rss/1.0/modules/content/",
                            "encoded"
                        )[0];

                    return {

                        title:
                            item.querySelector("title")
                                ?.textContent
                                ?.trim()
                            || "",

                        link:
                            item.querySelector("link")
                                ?.textContent
                                ?.trim()
                            || "",

                        description:
                            item.querySelector("description")
                                ?.textContent
                                ?.trim()
                            || "",

                        content:
                            contentNode?.textContent?.trim()
                            || "",

                        pubDate:
                            item.querySelector("pubDate")
                                ?.textContent
                                ?.trim()
                            || ""

                    };

                })

    };

}


function parseAtomFeed(feed) {

    return {

        title:
            feed.querySelector("title")
                ?.textContent
                ?.trim()
            || "Unnamed Feed",

        items:
            [...feed.querySelectorAll("entry")]
                .map(entry => {

                    const alternate =
                        entry.querySelector('link[rel="alternate"]');

                    const anyLink =
                        entry.querySelector("link");

                    return {

                        title:
                            entry.querySelector("title")
                                ?.textContent
                                ?.trim()
                            || "",

                        link:
                            alternate?.getAttribute("href")
                            || anyLink?.getAttribute("href")
                            || "",

                        description:
                            entry.querySelector("summary")
                                ?.textContent
                                ?.trim()
                            || "",

                        content:
                            entry.querySelector("content")
                                ?.textContent
                                ?.trim()
                            || "",

                        pubDate:
                            entry.querySelector("published")
                                ?.textContent
                                ?.trim()
                            || entry.querySelector("updated")
                                ?.textContent
                                ?.trim()
                            || ""

                    };

                })

    };

}
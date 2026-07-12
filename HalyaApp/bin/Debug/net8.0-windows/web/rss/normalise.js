export function normaliseItem(item) {

    return {

        title: item.title,

        link: item.link,

        source:
            item.source || "Unknown",

        content:
            item.content ||
            item.description ||
            "",

        description:
            item.description || "",

        published:
            item.pubDate

    };

}
export function showArticle(article) {

    const reader = document.getElementById("reader");

    reader.innerHTML = `
        <h1>${article.title}</h1>

        <small>${article.source}</small>

        <hr>

        <div class="article-content">
            ${
                article.content ||
                article.description ||
                "No preview available."
            }
        </div>

        <br>

        <a href="${article.link}" target="_blank">
            Open original article
        </a>
    `;

}
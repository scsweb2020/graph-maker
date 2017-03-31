
function authorDetails(authors) {

    var p = document.getElementById("tabs-2");
    p.innerHTML = "";
    authors.forEach(function(author) {
    p.appendChild(newAuthor(author));
    });
    var tabBadge = document.getElementById("tab-authors-badge");
    tabBadge.innerText = authors.length;
}
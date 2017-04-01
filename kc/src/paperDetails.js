
function paperDetails(nodes){
    var selectedPaperIDs = [];
    var authors=[];
    var authorNames = [];
    var p = document.getElementById("tabs-1");
    p.innerHTML = "";

    for(i=0; i<papers.length; i++) {
    if (findOne(papers[i].nodeIDs, nodes)) {
        selectedPaperIDs.push(papers[i].paperID);
        p.appendChild(newPaper(papers[i]));
        var paperAuthors = papers[i].author_arr
        for (j=0; j<paperAuthors.length; j++) {
        if (authorNames.indexOf(paperAuthors[j]) < 0) {
            authors.push(
            {
                'name': paperAuthors[j],
                'title': "CMU HCII Faculty",
                'url': ""
            }
            );
            authorNames.push(paperAuthors[j]);
        }
        }
    }
    }

    tabBadge = document.getElementById("tab-papers-badge");
    tabBadge.innerText = selectedPaperIDs.length;

    masterContextPaperIDs = selectedPaperIDs;

    return {'papers': selectedPaperIDs, 'authors': authors};

}
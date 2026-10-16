var subjectList = [];

function addSubjectActivity(subject, activity, time) {
    subjectList.push({
        subject: subject || "SUBJECT",
        activity: activity || "Activity",
        time: time || ""
    });
    renderSubjects();
}

function renderSubjects() {
    var box = document.getElementById("subjects-list");
    if (!box) return;

    box.innerHTML = "";
    for (var i = 0; i < subjectList.length; i++) {
        var item = subjectList[i];
        var card = document.createElement("div");
        card.className = "subject-card";
        card.innerHTML = 
            '<div class="subject-title">' + item.subject + '</div>' +
            '<div class="subject-details">' +
                '<span>' + item.activity + '</span>' +
                '<span>' + item.time + '</span>' +
            '</div>';
        box.appendChild(card);
    }
}
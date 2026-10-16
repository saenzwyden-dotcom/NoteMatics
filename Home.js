var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
var currentMonth = 0;
var assignments = {};
var defaultSubjects = ["DSAL", "INTROWEB", "CALCULUS", "OOP"];

function changeMonth(dir) {
    currentMonth = (currentMonth + dir + 12) % 12;
    document.getElementById("month-title").textContent = months[currentMonth];
    renderDays();
}

function renderDays() {
    var calendarBody = document.getElementById("calendar-body");
    if (!calendarBody) return;
    calendarBody.innerHTML = "";
    
    var daysInMonth = new Date(2026, currentMonth + 1, 0).getDate();
    var firstDay = new Date(2026, currentMonth, 1).getDay();
    
    var date = 1;
    for (var i = 0; i < 6; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < 7; j++) {
            var cell = document.createElement("td");
            
            if ((i === 0 && j >= firstDay) || (i > 0 && date <= daysInMonth)) {
                var key = months[currentMonth] + "-" + date;
                var eventList = assignments[key] || [];
                var eventsHTML = "";

                for (var k = 0; k < eventList.length; k++) {
                    var item = eventList[k];
                    eventsHTML += '<div class="event-item"><div>' + item.subject + '</div><div>' + item.activity + '</div><div>' + item.time + '</div></div>';
                }

                cell.innerHTML = '<div class="cell-header"><span>' + date + '</span>' + (eventList.length > 0 ? '<span class="red-dot"></span>' : '') + '</div><div class="event-details">' + eventsHTML + '</div>';
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
        if (date > daysInMonth) break;
    }
}

function addAssignment() {
    var m = document.getElementById("input-month").value.trim();
    var d = document.getElementById("input-day").value.trim();
    var rawTime = document.getElementById("input-time").value.trim();
    var ampm = document.getElementById("input-ampm").value;
    var a = document.getElementById("input-activity").value.trim();
    var s = document.getElementById("input-subject").value.trim();

    if (!m || !d) {
        alert("Enter Month and Day!");
        return;
    }

    var monthIndex = -1;
    for (var i = 0; i < months.length; i++) {
        if (months[i].toLowerCase().indexOf(m.toLowerCase().substring(0, 3)) === 0) {
            monthIndex = i;
            break;
        }
    }

    if (monthIndex === -1) {
        alert("Invalid month!");
        return;
    }

    var formattedTime = rawTime ? rawTime + " " + ampm : "";
    var key = months[monthIndex] + "-" + parseInt(d);

    if (!assignments[key]) assignments[key] = [];
    assignments[key].push({ subject: s, activity: a, time: formattedTime });

    if (typeof addSubjectActivity === "function") {
        addSubjectActivity(s, a, formattedTime);
    }

    currentMonth = monthIndex;
    document.getElementById("month-title").textContent = months[currentMonth];
    renderDays();
    clearForm();
}

function removeAssignment() {
    var m = document.getElementById("input-month").value.trim();
    var d = document.getElementById("input-day").value.trim();
    var a = document.getElementById("input-activity").value.trim();
    var s = document.getElementById("input-subject").value.trim();

    if (!m || !d || !a) {
        alert("Enter Month, Day, and Activity Name to remove!");
        return;
    }

    var monthIndex = -1;
    for (var i = 0; i < months.length; i++) {
        if (months[i].toLowerCase().indexOf(m.toLowerCase().substring(0, 3)) === 0) {
            monthIndex = i;
            break;
        }
    }

    if (monthIndex === -1) {
        alert("Invalid month!");
        return;
    }

    var key = months[monthIndex] + "-" + parseInt(d);

    if (assignments[key]) {
        assignments[key] = assignments[key].filter(function(item) {
            return item.activity.toLowerCase() !== a.toLowerCase();
        });
        if (assignments[key].length === 0) {
            delete assignments[key];
        }
    }

    if (typeof removeSubjectActivity === "function") {
        removeSubjectActivity(s, a);
    }

    currentMonth = monthIndex;
    document.getElementById("month-title").textContent = months[currentMonth];
    renderDays();
    clearForm();
}

function clearForm() {
    var ids = ["input-month", "input-day", "input-time", "input-activity", "input-subject"];
    for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        if (el) el.value = "";
    }
    document.getElementById("input-ampm").value = "AM";
}

function getSubjects() {
    var saved = sessionStorage.getItem("tempSubjects");
    return saved ? JSON.parse(saved) : defaultSubjects.slice();
}

function saveSubjects(list) {
    sessionStorage.setItem("tempSubjects", JSON.stringify(list));
}

function renderNoteButtons() {
    var container = document.getElementById("notes-list");
    if (!container) return;
    container.innerHTML = "";

    var subjectList = getSubjects();
    for (var i = 0; i < subjectList.length; i++) {
        var name = subjectList[i];
        var btn = document.createElement("button");
        btn.className = "note-btn";
        btn.textContent = name;
        
        (function(subName) {
            btn.addEventListener("click", function() {
                window.location.href = "Notes.html?subject=" + encodeURIComponent(subName);
            });
        })(name);

        container.appendChild(btn);
    }
}

function addNewSubject() {
    var input = document.getElementById("new-subject-input");
    var name = input.value.trim();
    if (!name) {
        alert("Please enter a subject name!");
        return;
    }

    var subjectList = getSubjects();
    subjectList.push(name);
    saveSubjects(subjectList);
    input.value = "";
    renderNoteButtons();
}

function removeSubject() {
    var input = document.getElementById("remove-subject-input");
    var name = input.value.trim();
    if (!name) {
        alert("Please enter a subject name to remove!");
        return;
    }

    var subjectList = getSubjects();
    var index = -1;
    for (var i = 0; i < subjectList.length; i++) {
        if (subjectList[i].toLowerCase() === name.toLowerCase()) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        alert("Subject not found!");
        return;
    }

    subjectList.splice(index, 1);
    saveSubjects(subjectList);
    input.value = "";
    renderNoteButtons();
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("prev-month-btn").addEventListener("click", function() { changeMonth(-1); });
    document.getElementById("next-month-btn").addEventListener("click", function() { changeMonth(1); });
    document.getElementById("cancel-btn").addEventListener("click", clearForm);
    document.getElementById("add-btn").addEventListener("click", addAssignment);
    document.getElementById("remove-activity-btn").addEventListener("click", removeAssignment);
    document.getElementById("add-subject-btn").addEventListener("click", addNewSubject);
    document.getElementById("remove-subject-btn").addEventListener("click", removeSubject);

    renderDays();
    renderNoteButtons();
});

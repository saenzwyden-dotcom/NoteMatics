document.addEventListener("DOMContentLoaded", function () {
    var urlParams = new URLSearchParams(window.location.search);
    var subject = urlParams.get("subject");

    var titleElement = document.getElementById("note-subject-title");
    var editorElement = document.getElementById("note-editor");
    var closeBtn = document.getElementById("close-btn");

    if (subject && subject.trim() !== "") {
        titleElement.textContent = subject;
    } else {
        titleElement.textContent = "NOTES";
    }

    var storageKey = "note_" + (subject || "default");
    var savedNote = localStorage.getItem(storageKey);
    if (savedNote) {
        editorElement.value = savedNote;
    }

    editorElement.addEventListener("input", function () {
        localStorage.setItem(storageKey, editorElement.value);
    });

    closeBtn.addEventListener("click", function () {
        window.location.href = "index.html";
    });
});

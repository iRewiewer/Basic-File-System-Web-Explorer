var ROOT_DIR = "E:/";

function GenerateFileTable(path) {
    $("#TBody").empty();

    $("#currentPath").text(path);

    // Get file information and populate the table
    $.ajax({
        url: "/get_files", // API endpoint
        data: { path: path }, // Send the current path to the server
        success: function (data) {
            data = JSON.parse(data);
            data.forEach(function (file) {
                // Download button exception
                var downloadSVG_name = "download_dark.svg";
                if (localStorage.getItem("mode") == "dark") {
                    downloadSVG_name = "download_light.svg";
                }

                file_download_path = $("#currentPath").text() + file.name;

                // Create a new row for each file
                var row = "<tr data-type=\"" + file.type + "\">" +
                    "<td>" + file.id + "</td>" +
                    "<td>" + file.name + "</td>" +
                    "<td>" + file.dateModified + "</td>" +
                    "<td>" + file.type + "</td>" +
                    "<td>" + file.size + "</td>" +
                    "<td>";
                
                if(file.type == "File")
                {
                    row += "<a href='/download?file=" + file_download_path + "'>" +
                    "<img class=\"downloadSVG\" src=\"./static/" + downloadSVG_name + "\"></img>" +
                    "</a>";
                }

                row += "</td>" +
                    "</tr>";
                $("#TBody").append(row);

                //$("#TBody tr:last .download-link").on('click', (event) => { Download(file.name); });

                // Add the click event listener to the newly created row
                var newRow = $("#TBody tr").last()[0];
                $(newRow).on('click', (event) => {
                    var targetRow = event.currentTarget;

                    if (localStorage.getItem("mode") == "light") {
                        $("#TBody tr").removeClass("table-light");

                        if ($(targetRow).hasClass("table-primary")) {
                            $(targetRow).removeClass('table-primary');
                        } else {
                            $("#TBody tr").removeClass("table-primary");
                            $(targetRow).addClass('table-primary');
                        }
                    }
                    else {
                        $("#TBody tr").removeClass("table-primary");

                        if ($(targetRow).hasClass("table-light")) {
                            $(targetRow).removeClass('table-light');
                        } else {
                            $("#TBody tr").removeClass("table-light");
                            $(targetRow).addClass('table-light');
                        }
                    }

                    if (targetRow.dataset.type === 'Folder') {
                        var folderName = $(targetRow).find("td:eq(1)").text();
                        var currentPath = $("#currentPath").text();
                        var newPath = currentPath + folderName + "/";
                        GenerateFileTable(newPath);
                    }
                });
            });
        }
    });

    // Update back button
    if ($(currentPath).text() == ROOT_DIR) {
        $("#backButton").removeClass("btn-primary");
        $("#backButton").addClass("btn-secondary");
        $("#backButton").addClass("disabled");
    }
    else {
        $("#backButton").addClass("btn-primary");
        $("#backButton").removeClass("btn-secondary");
        $("#backButton").removeClass("disabled");
    }
}

function Download(file_name) {
    file_download_path = $("#currentPath").text() + file_name;
    $.ajax({
        url: "/download",
        data: { file: file_download_path },
    });
}

function BackButtonListener() {
    $("#backButton").on('click', function () {
        var currentPath = $("#currentPath").text();
        var pathParts = currentPath.split('/');

        if (pathParts.length > 1) {
            pathParts.pop();
            pathParts.pop(); // last character is a '/' so it adds an extra space
        }

        var newPath = pathParts.join('/') + '/';
        $("#currentPath").text(newPath);

        GenerateFileTable(newPath);
    });
}

function ModeButtonListener() {
    $("#modeButton").on('click', function () {
        changeMode(false);
    });
}

function changeMode(isInit) {
    // First time website is accessed
    if (localStorage.getItem("mode") == null) {
        localStorage.setItem("mode", "light");
    }

    if (localStorage.getItem("mode") == "light") {
        if (isInit) {
            // On opening the site
            setLight();
            return;
        }

        localStorage.setItem("mode", "dark");
        setDark();
    }
    else {
        if (isInit) {
            // On opening the site
            setDark();
            return;
        }

        localStorage.setItem("mode", "light");
        setLight();
    }
}

function setLight() {
    $("#TBody tr").removeClass("table-light");
    $("#TBody tr").removeClass("table-primary");

    $("body").removeClass("dark");
    $("#fileTable").removeClass("table-dark");
    $("#modeButton").removeClass("btn-dark");

    $("#modeIcon").attr("src", "./static/moon.svg");
    $(".downloadSVG").attr("src", "./static/download_dark.svg");

    $("body").addClass("light");
    $("#fileTable").addClass("table-light");
    $("#modeButton").addClass("btn-light");
}

function setDark() {
    $("#TBody tr").removeClass("table-light");
    $("#TBody tr").removeClass("table-primary");

    $("body").removeClass("light");
    $("#fileTable").removeClass("table-light");
    $("#modeButton").removeClass("btn-light");

    $("#modeIcon").attr("src", "./static/sun.svg");
    $(".downloadSVG").attr("src", "./static/download_light.svg");

    $("body").addClass("dark");
    $("#fileTable").addClass("table-dark");
    $("#modeButton").addClass("btn-dark");
}

document.addEventListener('DOMContentLoaded', function () {
    if (ROOT_DIR.charAt(ROOT_DIR.length - 1) != "/") {
        ROOT_DIR += "/";
    }

    GenerateFileTable(ROOT_DIR);
    BackButtonListener();
    ModeButtonListener();
    changeMode(true);
});
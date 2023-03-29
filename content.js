let $table = $($("table")[4]);

$table.wrap("<div class='chartwrapper'></div>");

$table.parent().append("<div class='piewrapper'><table id='pietable'></table><div id='piechart' ></div><a class='freepik' href='https://www.flaticon.com/free-icons/pie' title='pie icons'>Pie icons created by Freepik - Flaticon</a></div>")

let $realTable = $("td:contains('Report Data')").last().parent().parent().parent();

let json = html2json($realTable);

const headerCols = json[1];
const indexOfProjectId = headerCols.indexOf("Project Id");
const indexOfProjectName = headerCols.indexOf("Project Name");
const $pieTable = $("#pietable");

let data = [];
let totalHours = 0;

for (let i = 2; i < json.length; i++) {
    const dataRow = json[i];
    const projectId = dataRow[indexOfProjectId]
    const projectName = dataRow[indexOfProjectName];
    const hours = parseInt(dataRow[dataRow.length - 1]);
    if (!projectName) {
        continue;
    }

    let point = findProjectId(projectId, data);
    if (!point) {
        point = {
            id: projectId,
            label: projectName,
            hours: 0,
            y: 0,
            checked: true
        };
        data.push(point);
    }
    point.hours += hours;
    totalHours += hours;

}

data = data.sort((a, b) => b.hours - a.hours);

$pieTable.append("<tr><th></th><th>Project name</th><th>Hours</th></tr>")
for (let i = 0; i < data.length; i++) {
    let d = data[i];
    $pieTable.append("<tr><td><input ind='" + i + "' class='check_project' type='checkbox' checked/></td><td>" + d.label + "</td><td>" + d.hours + "h</td></tr>")
}

console.log(totalHours);
console.log(data);



$(".check_all").change(() => {
    if ($(".check_all").is(":checked")) {
        $("#pietable input:checkbox").prop("checked", true);
    } else {
        $("#pietable input:checkbox").prop("checked", false);
    }
})

$(".check_project").change((e) => {
    let isChecked = $(e.target).is(":checked");
    let index = parseInt($(e.target).attr("ind"));

    data[index].checked = isChecked;
    if (isChecked) {
        totalHours += data[index].hours;
    } else {
        totalHours -= data[index].hours;
    }

    drawChart(data);
})


drawChart(data);

function drawChart(data) {
    data = data.filter(d => d.checked);
    data.map((d) => d.y = Math.round(d.hours / totalHours * 100));
    
    var options = {
        title: {
            text: "Project %"
        },
        data: [{
            type: "pie",
            startAngle: -90,
            showInLegend: "true",
            legendText: "{label} ({y}%)",
            indexLabel: "{label} ({y}%)",
            yValueFormatString: "#,##0.#" % "",
            dataPoints: data
        }]
    };

    $("#piechart").CanvasJSChart(options);
}



function html2json($table) {
    var json = '[';
    var otArr = [];
    var tbl2 = $table.find("tr").each(function (i) {
        x = $(this).children();
        var itArr = [];
        x.each(function () {
            itArr.push('"' + $(this).text().trim() + '"');
        });
        otArr.push('[' + itArr.join(',') + ']');
    })
    json += otArr.join(",") + ']'

    return JSON.parse(json);
}
function findProjectId(projectId, data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == projectId) {
            return data[i];
        }
    }
}

function checkAll() {

}
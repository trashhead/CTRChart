let $table = $($("table")[4]);

$table.wrap("<div class='chartwrapper'></div>");

$table.parent().append("<div class='piewrapper'><div id='piechart' ></div><a class='freepik' href='https://www.flaticon.com/free-icons/pie' title='pie icons'>Pie icons created by Freepik - Flaticon</a></div>")

let $realTable = $("td:contains('Report Data')").last().parent().parent().parent();

let json = html2json($realTable);

const headerCols = json[1];
const indexOfProjectId = headerCols.indexOf("Project Id");
const indexOfProjectName = headerCols.indexOf("Project Name");

let data = [];
let totalHours = parseInt(json.slice(-1)[0].slice(-1)[0]);

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
            y: 0
        };
        data.push(point);
    }
    point.y += hours;

}

data.map((d) => d.y = Math.round(d.y / totalHours * 100));
data = data.sort((a,b)=>b.y-a.y);

console.log(totalHours);
console.log(data);

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
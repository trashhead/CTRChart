let $table = $($("table")[4]);
fixDateButtons();
$table.wrap("<div class='chartwrapper'></div>");

$table.parent().append("<div class='piewrapper'><table id='pietable'></table><div id='piechart' ></div><a class='freepik' href='https://www.flaticon.com/free-icons/pie' title='pie icons'>Pie icons created by Freepik - Flaticon</a></div>")

let $realTable = $("td:contains('Report Data')").last().parent().parent().parent();

let json = html2json($realTable);

const headerCols = json[1];
const indexOfProjectId = headerCols.indexOf("Project Id");
const indexOfProjectName = headerCols.indexOf("Project Name");
const indexOfCustomerName = headerCols.indexOf("Customer Name");
const $pieTable = $("#pietable");


let data = [];
let totalHours = 0;

for (let i = 2; i < json.length; i++) {
    const dataRow = json[i];
    const projectId = dataRow[indexOfProjectId]
    const projectName = dataRow[indexOfProjectName];
    const customerName = dataRow[indexOfCustomerName];
    const hours = parseInt(dataRow[dataRow.length - 1]);
    if (!projectName || hours == 0) {
        continue;
    }

    let point = findProjectId(projectId, data);
    if (!point) {
        point = {
            id: projectId,
            label: projectName,
            customerName: customerName,
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

$pieTable.append("<tr><th>" + (indexOfCustomerName != -1 ? "Customer Name" : "") + "</th><th></th><th>Project name</th><th>Hours</th></tr>")
for (let i = 0; i < data.length; i++) {
    let d = data[i];
    $pieTable.append("<tr><td>" + (indexOfCustomerName != -1 ? d.customerName : "") + "</td><td><input ind='" + i + "' class='check_project' type='checkbox' checked/></td><td>" + d.label + "</td><td>" + d.hours + "h</td></tr>")
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

function fixDateButtons() {
    const firstClearDate = $("img[src='/layout/buttons/deleteDisabled.gif']")[0];
    const secondClearDate = $("img[src='/layout/buttons/deleteDisabled.gif']")[1];

    $(firstClearDate).attr("src", chrome.runtime.getURL("angles-left-solid.svg"));
    $(secondClearDate).attr("src", chrome.runtime.getURL("angles-right-solid.svg"));
    $(firstClearDate).parent().replaceWith($("<button type='button'></button>").append(firstClearDate));
    $(secondClearDate).parent().replaceWith($("<button type='button'></button>").append(secondClearDate));

    $(firstClearDate).parent().insertBefore($(secondClearDate).parent())


    $(firstClearDate).parent().click(() => {
        let startDate = $("input[name='DataFormStartDate']").val();
        let endDate = $("input[name='DataFormEndDate']").val();
        let newStartDate = moment(startDate, "DD-MM-YYYY").subtract(1, "month").startOf('month');
        let newEndDate = moment(endDate, "DD-MM-YYYY").subtract(1, "month").endOf('month');

        $("input[name='DataFormStartDate']").val(newStartDate.format('DD-MM-YYYY'));
        $("input[name='DataFormEndDate']").val(newEndDate.format('DD-MM-YYYY'));

        $("input[name='StartDate']").val(newStartDate.format('YYYY-MM-DD'));
        $("input[name='EndDate']").val(newEndDate.format('YYYY-MM-DD'));
    });
    $(secondClearDate).parent().click(() => {
        let startDate = $("input[name='DataFormStartDate']").val();
        let endDate = $("input[name='DataFormEndDate']").val();
        let newStartDate = moment(startDate, "DD-MM-YYYY").add(1, "month").startOf('month');
        let newEndDate = moment(endDate, "DD-MM-YYYY").add(1, "month").endOf('month');

        $("input[name='DataFormStartDate']").val(newStartDate.format('DD-MM-YYYY'));
        $("input[name='DataFormEndDate']").val(newEndDate.format('DD-MM-YYYY'));

        $("input[name='StartDate']").val(newStartDate.format('YYYY-MM-DD'));
        $("input[name='EndDate']").val(newEndDate.format('YYYY-MM-DD'));
    });
}
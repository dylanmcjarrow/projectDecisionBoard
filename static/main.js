const listItem_mentor = document.querySelector("#pMentorList");
const listItem_group = document.querySelector("#pGroupList");
const message_display = document.querySelector("#message");


let buttons_elements;


let mentorArr = [];
let groupArr = [];


init();

function init() {
    api_request_GET();

}


function api_request_GET() {
    const url = 'api?key=123';

    let request = new XMLHttpRequest();
// Open a new connection, using the GET request on the URL endpoint
    request.open('GET', url , true);

    request.onload = function () {

        let data = JSON.parse(request.response);

        // console.log(data)

        mentorArr = data["mentor_array"];
        groupArr = data["group_array"];

        populate_table();

    }

// Send request
    request.send()

}

function api_request_POST(listName, NewArr) {

    const post_body = {
        "listName": listName,
        "data": NewArr
    }
    const url = "api?key=123"
    let request = new XMLHttpRequest();
// Open a new connection, using the GET request on the URL endpoint

    request.open('POST', url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = function () {

        // console.log(request.response);

    }


    request.send(JSON.stringify(post_body));

}


function button_event(e) {
    const event_target_id = e.target.id;

    if (event_target_id === "addMentorBtn") {


    } else if (event_target_id !== "addGroupBtn") {
        const list_action = clicked_list_button(event_target_id);
        // console.log(`moved ${list_action.item_direction} in ${list_action.list_group} at ${list_action.item_number}`);
        MoveItem(list_action.item_direction, list_action.item_number, list_action.list_group);
    }


}

function MoveItem(direction, row_index, table) {
    let temp = "";
    const row = parseInt(row_index) - 1;
    // console.log(row);
    // console.log(mentorArr.length);
    // console.log(direction)

    switch (table) {
        case "G":
            const group_at_row = groupArr[row];
            if (direction === "up" && row >= 1) {
                temp = groupArr[row - 1];
                groupArr[row - 1] = groupArr[row];
                groupArr[row] = temp;
            } else if (direction === "down" && row + 1 < groupArr.length) {
                temp = groupArr[row + 1];
                groupArr[row + 1] = groupArr[row];
                groupArr[row] = temp;

            } else {

            }

            api_request_POST("group", groupArr);
            break;
        case "M":
            const member_at_row = mentorArr[row];
            if (direction === "up" && row >= 1) {
                temp = mentorArr[row - 1];
                mentorArr[row - 1] = mentorArr[row];
                mentorArr[row] = temp;
            } else if (direction === "down" && row + 1 < mentorArr.length) {
                temp = mentorArr[row + 1];
                mentorArr[row + 1] = mentorArr[row];
                mentorArr[row] = temp;

            } else {

            }

            api_request_POST("mentor", mentorArr)

            break;
        default:
            console.log("Error With Up And group");
    }

    resetLists();
}

function resetLists() {


    button_events_remove();
    populate_table();
    button_events_add();
}

function button_events_add() {
    buttons_elements = document.querySelectorAll(".btn");
    buttons_elements.forEach(button => button.addEventListener("click", button_event));

}

function button_events_remove() {
    buttons_elements = document.querySelectorAll(".btn");
    buttons_elements.forEach(button => button.removeEventListener("click", button_event));

}

function clicked_list_button(event_target_id) {
    let temp = event_target_id.split("_btn_");
    const item_direction = temp[0];
    temp = temp[temp.length - 1];
    const list_group = temp.toString().charAt(0);
    const item_number = temp.toString().substring(1);

    return {
        "item_direction": item_direction,
        "list_group": list_group,
        "item_number": item_number
    }

}

function populate_table() {


    let row_counter = 0;
    let HTML_to_add = "<li class=\"list-group-item active\">Mentors</li>";
    mentorArr.forEach(value => {
        row_counter++;
        HTML_to_add = HTML_to_add + `

        <li class="list-group-item " >
            ${value}
            <button id="up_btn_M ${row_counter}"  class="btn btn-sm btn-outline-dark up-btn float-sm-left">up</button>
            <button id="down_btn_M${row_counter}" class="btn btn-sm btn-outline-dark down-btn float-sm-right">down</button>
            <span class="clearfix"></span>
        </li>
`;

    });
    listItem_mentor.innerHTML = HTML_to_add;

    row_counter = 0;
    HTML_to_add = "<li class=\"list-group-item active\">Groups</li>";
    groupArr.forEach(value => {
        row_counter++;
        HTML_to_add = HTML_to_add + `

        <li class="list-group-item " >
            ${value}
            <button id="up_btn_G${row_counter}"  class="btn btn-sm btn-outline-dark up-btn float-sm-left">up</button>
            <button id="down_btn_G${row_counter}" class="btn btn-sm btn-outline-dark down-btn float-sm-right">down</button>
            <span class="clearfix"></span>
        </li>`;

    });
    listItem_group.innerHTML = HTML_to_add;


    button_events_add();

}






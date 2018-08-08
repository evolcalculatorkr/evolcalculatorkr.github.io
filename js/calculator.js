var w_decision = 0, w_creativity = 0, w_appetency = 0, w_action = 0;
var tmp_character = "이택언";
var star_num = 3;
// var tmp_category = 0, category_dict = {"normal": 1, "hard": 2, "instance": 3, "arena": 4};
var tmp_category = "normal";
var tmp_name = "";
var score_list = [];

function loadName(category) {
    $('#stage-name').empty();
    var str = "";
    var prename = "";
    if (category == 'instance') 
        prename = "촬영장";
    if (category == 'hard')
        prename = "특집";
    for (var i in weights[category]) {
        str += "<option value =\""+weights[category][i]["name"]+"\">"+prename+weights[category][i]["name"]+"</option>";
    }
    $('#stage-name').append(str);

    $('#div-star').remove();
    if (category == 'arena') {
        $('#div-character').attr("colspan", 1);
        $('#div-character').after("<td id=\"div-star\"><select id=\"stage-star\"><option value=\"3\">3성</option><option value=\"4\">4성</option><option value=\"5\">5성</option></select></td>");
    }
    else {
        $('#div-character').attr("colspan", 2);
    }

    $('#stage-character').empty();
    if (category == 'instance' || category == 'arena') {
        $('#stage-character').append("<option value=\"허묵\">허묵</option><option value=\"백기\">백기</option><option value=\"이택언\">이택언</option><option value=\"주기락\">주기락</option>");
        tmp_character = "허묵";
    }
    else {
        $('#stage-character').append("<option value=\"허묵\">无</option>");
        tmp_character = "허묵";
    }

}

function loadWeight(category, name) {
    for (var i in weights[category]) {
        if (weights[category][i]["name"] == name) {
            // w_decision = parseFloat(weights[category][i]["decision"]);
            // w_creativity = parseFloat(weights[category][i]["creativity"]);
            // w_appetency = parseFloat(weights[category][i]["appetency"]);
            // w_action = parseFloat(weights[category][i]["action"]);
            // $('#stage-decision').text(weights[category][i]["decision"]);
            // $('#stage-creativity').text(weights[category][i]["creativity"]);
            // $('#stage-appetency').text(weights[category][i]["appetency"]);
            // $('#stage-action').text(weights[category][i]["action"]);
            goods = weights[category][i]["goods"];
            $('#stage-goods').text(weights[category][i]["goods"]);
            break;
        }
    }
    // calScore();
}

function sortNumber(a, b) {
    return b["score"] - a["score"];
}

function calScore() {
    var card_list = new Array();
    for (var i in mycards["user-defined"]) {
        card_list[i] = mycards["user-defined"][i];
        card_list[i]["score"] = w_decision*card_list[i]["decision"]+w_creativity*card_list[i]["creativity"]+w_appetency*card_list[i]["appetency"]+w_action*card_list[i]["action"];
        if (tmp_category == "arena" && card_list[i]["character"] == tmp_character) {
            card_list[i]["score"] *= 1 + (star_num - 2) * 0.1;
        }
        if (tmp_category == "instance" && card_list[i]["character"] != tmp_character){
            card_list[i]["score"] = 0;
        }
    }
    for (var i in bonds) {
        if (isInArray(mycards["pre-defined"], bonds[i]["name"])) {
            var temp = new Object();
            temp["name"] = bonds[i]["name"];
            temp["character"] = bonds[i]["character"];
            temp["rarity"] = bonds[i]["rarity"];
            temp["way"] = bonds[i]["way"];
            temp["id"] = bonds[i]["name"];
            temp["score"] = w_decision*bonds[i]["decision"]+w_creativity*bonds[i]["creativity"]+w_appetency*bonds[i]["appetency"]+w_action*bonds[i]["action"];
            if (tmp_category == "arena" && bonds[i]["character"] == tmp_character){
                temp["score"] *= 1 + (star_num - 2) * 0.1;
            }
            if (tmp_category == "instance" && bonds[i]["character"] != tmp_character){
                temp["score"] = 0;
            }
            card_list.push(temp);
        }
    }
    card_list.sort(sortNumber);
    score_list = card_list;
    showScore();
    // for (var i in card_list) {
    //     if (max_cards == -1 || i < max_cards) {
    //         str += "<tr id=\""+card_list[i]["id"]+"\"><td>"+card_list[i]["name"]+"</td><td>"+card_list[i]["rarity"]+"</td><td>"+card_list[i]["character"]+"</td><td>"+card_list[i]["way"]+"</td><td><b>"+Math.round(card_list[i]["score"])+"</b></td></tr>";
    //     }
    // }
    // $('#recommendation').append(str);
}

function requestData() {
    var data;
    // alert(tmp_category + ", " + tmp_name + ", " + tmp_character);
    for (var i in weights[tmp_category]) {
        if (tmp_name == weights[tmp_category][i]["name"]) {
            w_decision = weights[tmp_category][i]["decision"];
            w_creativity = weights[tmp_category][i]["creativity"];
            w_appetency = weights[tmp_category][i]["appetency"];
            w_action = weights[tmp_category][i]["action"];
            if (tmp_category == "instance"){
                data = weights[tmp_category][i]["list"][tmp_character];
            }
            else {
                data = weights[tmp_category][i];
            }
            break;
        }
    }
    $('#stage-goods').empty();
    $('#stage-goods').append(data["goods"]);
    $('#div-request').empty();
    var str2 = "";
    for (var i in data["requests"]) {
        str2 += "<tr><td>"+data["requests"][i]["request"]+"</td><td>"+data["requests"][i]["content"]+"</td></tr>"
    }
    $('#div-request').append(str2);
    calScore();
}

// function requestData(){
//     $.ajax({
//         type: "GET",
//         url: "https://39.107.72.254:8443/lyzz/card/sort/",
//         data: {type: tmp_category, name: encodeURI(tmp_name), person: encodeURI(tmp_character), star: star_num},
//         dataType: "jsonp",
//         error: function () {
//             alert("抱歉！服务器出错了QAQ");
//             return;
//         },
//         success: function(data){
//             if (data == null || data.length == 0 || data == "" || data.length == 1) {
//                 alert("抱歉！服务器出错了QAQ");
//                 return;
//             }
//             w_decision = data["decision"];
//             w_creativity = data["creativity"];
//             w_appetency = data["affinity"];
//             w_action = data["proactiveness"];
//             $('#stage-goods').empty();
//             $('#stage-goods').append(data["goods"]);
//             $('#div-request').empty();
//             var str2 = "";
//             for (var i in data["requests"]) {
//                 str2 += "<tr><td>"+data["requests"][i]["request"]+"</td><td>"+data["requests"][i]["content"]+"</td></tr>"
//             }
//             $('#div-request').append(str2);
//             allcards = data["cards"];
//             calScore();
//         }
//     });
// }


// function setMaxNum(num) {
//     max_cards = parseInt(num);
//     showScore();
// }


$(document).ready(function(){

    chrome.storage.local.get(['color'], function(result) {
        console.log(result);
        if (result.color != undefined){
            $('html, body').css('background-color', result.color)
        }
    });

    /////////////// ~~~~~~~  ~~~~~~~  ///////////////

    const keyTaskList = 'keyTaskList';

    chrome.storage.local.get([keyTaskList], function(result) {
        if (result.keyTaskList != undefined){
            appendDataToHtml(result.keyTaskList);
        }
    });

    /////////////// ~~~~~~~ event ~~~~~~~  ///////////////

    // click btn-addTask
    $("#btn-addTask").click(function (){
        addTask();
    });

    // Press enter to add task
    $('#input-title').keyup(function(e){
        if(e.keyCode == 13)
            addTask();
    });

    //  click btn-completeTask
    $("#taskList, #taskListDangThucHien").on('click', '.btn-completeTask', function () {
        let currentRow = $(this).closest(".task");
        let id = currentRow.find('.id').val();

        chrome.storage.local.get([keyTaskList], function(result) {
            if (result.keyTaskList != undefined){
                result.keyTaskList.find(element => element.id == id).status = true;
                appendDataToHtml(result.keyTaskList);
                chrome.storage.local.set({keyTaskList: result.keyTaskList}, function(){
                    console.log("save data succsess!");
                });
            }
        });

    });

    //  click btn-removeTask
    $("#taskList, #taskListComplete, #taskListDangThucHien").on('click', '.btn-removeTask', function () {
        var currentRow = $(this).closest(".task");
        var id = currentRow.find('.id').val();

        chrome.storage.local.get([keyTaskList], function(result) {
            if (result.keyTaskList != undefined){
                result.keyTaskList = result.keyTaskList.filter(element => element.id != id);
                appendDataToHtml(result.keyTaskList);
                chrome.storage.local.set({keyTaskList: result.keyTaskList}, function(){
                    console.log("save data succsess!");
                });
            }
        });
        
    });

    $("#btn-tabAll").click(function (){
        $("#taskList").show();
        $("#taskListComplete, #taskListDangThucHien").hide();
        $(this).css({
            'background-color': 'gray',
            'color' : 'white'
        });
        $("#btn-tabComplete, #btn-tabDangThucHien").css({
            'background-color': 'rgb(239, 239, 239)',
            'color' : 'black'
        });
    });

    $("#btn-tabComplete").click(function (){
        $("#taskListComplete").show();
        $("#taskList, #taskListDangThucHien").hide();
        $(this).css({
            'background-color': 'gray',
            'color' : 'white'
        });
        $("#btn-tabAll, #btn-tabDangThucHien").css({
            'background-color': 'rgb(239, 239, 239)',
            'color' : 'black'
        });
    });

    $("#btn-tabDangThucHien").click(function (){
        $("#taskListDangThucHien").show();
        $("#taskList, #taskListComplete").hide();
        $(this).css({
            'background-color': 'gray',
            'color' : 'white'
        });
        $("#btn-tabAll, #btn-tabComplete").css({
            'background-color': 'rgb(239, 239, 239)',
            'color' : 'black'
        });
    });

    /////////////// ~~~~~~~ function ~~~~~~~  ///////////////

    function appendDataToHtml(listData){
        $("#taskList, #taskListComplete, #taskListDangThucHien").html('');
        let taskList = listData;
        let taskListComplete = listData.filter(element => element.status == true);
        let taskListDangThucHien = listData.filter(element => element.status == false);
        taskList.forEach((element, index) => {
            $("#taskList").append(`
                <div class="task">
                    <div class="stt">${index+1}</div>
                    <div class="content">${element.status == false ? element.content :  `<strike>${element.content}</strike>`}</div>
                    <div class="div-action">
                        ${element.status == false ? '<button class="btn-completeTask">Hoàn thành</button>' : ''}
                        <button class="btn-removeTask">xóa</button>
                        <input class="id" type="hidden" value="${element.id}">
                    </div>
                </div>
                <hr />
            `);
        });
        taskListComplete.forEach((element, index) => {
            $("#taskListComplete").append(`
                <div class="task">
                    <div class="stt">${index+1}</div>
                    <div class="content"><strike>${element.content}</strike></div>
                    <div class="div-action">
                        <button class="btn-removeTask">xóa</button>
                        <input class="id" type="hidden" value="${element.id}">
                    </div>
                </div>
                <hr />
            `);
        });
        taskListDangThucHien.forEach((element, index) => {
            $("#taskListDangThucHien").append(`
                <div class="task">
                    <div class="stt">${index+1}</div>
                    <div class="content">${element.content}</div>
                    <div class="div-action">
                        <button class="btn-completeTask">Hoàn thành</button>
                        <button class="btn-removeTask">xóa</button>
                        <input class="id" type="hidden" value="${element.id}">
                    </div>
                </div>
                <hr />
            `);
        });
    }

    function addTask() {
        var valueInput = $("#input-title").val();
        if (valueInput == ""){
            $("#input-title").css('border-color', 'red');
            return;
        }
        $("#input-title").css('border-color', '');
        $("#input-title").val('');
        
        chrome.storage.local.get([keyTaskList], function(result){
            let taskList = [];

            if (result.keyTaskList != undefined){
                taskList = result.keyTaskList;
            }
            var ids = taskList.map(element => element.id);
            var max = Math.max.apply(Math, ids);
            var json = {
                'id': ids.length == 0 ? ++ids.length : ++max,
                'content': valueInput,
                'status': false // false: not complete, true: complete
            };
            taskList.push(json);
            appendDataToHtml(taskList);

            // Save data on browser using storage
            chrome.storage.local.set({keyTaskList: taskList}, function(){
                console.log("save data succsess!");
            });

        });
    }

});
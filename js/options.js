$(document).ready(function(){

    chrome.storage.local.get(['color'], function(result) {
        if (result.color != undefined){
            $('#color').val(result.color);
        }
    });

    /////////////// ~~~~~~~ event ~~~~~~~  ///////////////

    $("#btn-save").click(function (){
        var inputColor = $("#color").val();
        chrome.storage.local.set({"color": inputColor}, function(){
            console.log("save data succsess!");
        });
    });

    $("#btn-restore").click(function (){
        chrome.storage.local.set({"color": "#ffffff"}, function(){
            $('#color').val("#ffffff");
        });
    });
    
});
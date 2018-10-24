var postUrl = 'https://hooks.slack.com/services/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';

function fetchDelayInfo() {
 
  //電車遅延情報をJSON形式で取得
  var json = JSON.parse(UrlFetchApp.fetch("https://rti-giken.jp/fhc/api/train_tetsudo/delay.json").getContentText());
 
  //シートとその最終行数、シートのデータを取得
  var mySheet = SpreadsheetApp.openById('1umDwmfNGhXDl2u49GbUJ0HVPA3cKg1s7VFmoqX6FGv8');
  var maxRow = mySheet.getDataRange().getLastRow();
  var myVars = mySheet.getDataRange().getValues();
 
  var body = "■電車運行情報";
 
  for(var i=2;i<=maxRow;i++){ 
 
    var name = myVars[i-1][1-1];
    var company = myVars[i-1][2-1];
 
    for each(var obj in json){
      if(obj.name === name && obj.company === company){
        body = body + company + name + "が遅延しています(^^;)\n";
      }
    }
  }
 
  if(body === "■電車運行情報"){
    body = body + "\n本日の遅延情報はありません";
  } else{
 
    var jsonData =
    {
//       "username" : username,
//       "icon_emoji": icon,
         "text" : body
    };
     var payload = JSON.stringify(jsonData);

     var options =
     {
       "method" : "post",
       "contentType" : "application/json",
       "payload" : payload
     };

     UrlFetchApp.fetch(postUrl, options);
  }
}
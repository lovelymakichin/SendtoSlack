function fetchDelayInfo() {
    const userProperties = PropertiesService.getUserProperties();
    const postUrl = userProperties.getProperty('slackwftrain');
    const TrainSSID = userProperties.getProperty('TrainSSID');

 
  //電車遅延情報をJSON形式で取得
  const json = JSON.parse(UrlFetchApp.fetch("https://tetsudo.rti-giken.jp/free/delay.json").getContentText());
 
  //シートとその最終行数、シートのデータを取得
  const mySheet = SpreadsheetApp.openById(TrainSSID);
  const maxRow = mySheet.getDataRange().getLastRow();
  const myVars = mySheet.getDataRange().getValues();
 
  body = "■電車運行情報";
 
  for(i=2;i<=maxRow;i++){ 
 
    const name = myVars[i-1][1-1];
    const company = myVars[i-1][2-1];
 
    for (const obj of json){
      if(obj.name === name && obj.company === company){
        body = body + "\n" + company + " " + name + "が遅延しています(^^;)\n";
      }
    }
  }
 
  if(body === "■電車運行情報"){
    body = body + "\n本日の遅延情報はありません";
  } else{
 
    const jsonData =
    {
//       "username" : username,
//       "icon_emoji": icon,
         "text" : body
    };
     const payload = JSON.stringify(jsonData);

     const options =
     {
       "method" : "post",
       "contentType" : "application/json",
       "payload" : payload
     };

     UrlFetchApp.fetch(postUrl, options);
  }
}
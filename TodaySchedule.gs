var icon = ':computer:';  // 通知時に表示されるアイコン
var userProperties = PropertiesService.getUserProperties();
var postUrl = userProperties.getProperty('slackwfinfo');

/* 指定のカレンダーの本日の予定をslackに送る */
function slackSchedule() {
  var CalendarID = userProperties.getProperty('CalendarID');

  var myCals=CalendarApp.getCalendarById(CalendarID); //特定のIDのカレンダーを取得
  var myEvents=myCals.getEventsForDay(new Date());　//カレンダーの本日のイベントを取得

  var username = 'origin-schedule';  // 通知時に表示されるユーザー名

 
  /* イベントの数だけ繰り返し */
  for(var i=0;i<myEvents.length;i++){
    var strTitle=myEvents[i].getTitle(); //イベントのタイトル
    var strStart=_HHmm(myEvents[i].getStartTime()); //イベントの開始時刻
    var strEnd=_HHmm(myEvents[i].getEndTime()); //イベントの終了時刻
    /* slackに送る文字列のヘッダー */
    j = i + 1;
    var strBody = "\n■本日の予定"+ j +"\n"
    /* slackにメッセージを送る */
    strBody=strBody + strStart + ' - ' + strEnd + strTitle + '\n'; //slackに送る文字列にイベント内容を追加

    var jsonData =
     {
       "username" : username,
       "icon_emoji": icon,
       "text" : strBody
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

function slackNoodledayUpdate(){
   var NoodleDaySSID = userProperties.getProperty('NoodleDaySSID');
   var file = DriveApp.getFileById(NoodleDaySSID);
   var lastUpdated = file.getLastUpdated();
   var username = 'lunch-schedule';  // 通知時に表示されるユーザー名
   var tdate = new Date();
   if (Math.ceil((tdate - lastUpdated) / 86400000) == 1) {
     var strBody = "\n■麺類の日が確定しました"+ "\n"
     var jsonData =
      {
        "username" : username,
        "icon_emoji": icon,
        "text" : strBody
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
/* 時刻の表記をHH:mmに変更 */
function _HHmm(str){
 
  return Utilities.formatDate(str, 'JST', 'HH:mm');
 
}



var icon = ':computer:';  // 通知時に表示されるアイコン
var userProperties = PropertiesService.getUserProperties();
const TrainSSID = userProperties.getProperty('TrainSSID');
const CalendarID = userProperties.getProperty('CalendarID');
var tdate = new Date();
var ty=tdate.getFullYear();
var tm=tdate.getMonth()+1;
var td=tdate.getDate();
var dayOfWeek = tdate.getDay();	// 曜日(数値)


/* 指定のカレンダーの本日の予定をslackに送る */
function slackSchedule() {
  if(dayOfWeek === 0 || dayOfWeek === 7){    /*平日のみ実施*/
     return;
  }
  var postUrl = userProperties.getProperty('slackwfinfo');

  var myCals=CalendarApp.getCalendarById(CalendarID); //特定のIDのカレンダーを取得
  var myEvents=myCals.getEventsForDay(tdate);　//カレンダーの本日のイベントを取得

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
   var postUrl = userProperties.getProperty('slackwfinfo');
   var file = DriveApp.getFileById(NoodleDaySSID);
   var lastUpdated = file.getLastUpdated();
   var username = 'lunch-schedule';  // 通知時に表示されるユーザー名
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



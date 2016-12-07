let lat;
let lng;
$(function(){
  if (!navigator.geolocation){
    alert("navigator.geolocation sの対応しているブラウザを使用してください。");
  }else{
    navigator.geolocation.getCurrentPosition(mapsInit, errorFunc, optionObj);
    function mapsInit(position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      displayRestaurants(lat,lng);
    }
    function errorFunc(error) {
    }
    var optionObj = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 20000
    };        
  }

  $("#tweet").click(function(){
    var newWin=window.open("","child","width=600, height=300");
    var text="美味しいランチを食べました！";
    var url="http://solt9029.esy.es/GurunaviGmaps/";
    var hashtags="GurunaviGmaps";
    newWin.location.href=("https://twitter.com/share?url="+url+"&text="+text+"&hashtags="+hashtags+"&count=none&lang=ja");
  });

});

function initMap() {
  // マップの初期化
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 35.6669705, lng: 139.7139777}
  });
  // クリックイベントを追加
  map.addListener('click', function(e) {
    getClickLatLng(e.latLng, map);
  });
}

function displayRestaurants(lat,lng){
  const KEY_ID="a0564b85c4af79591a5e7953484dc08b";
  let url='http://api.gnavi.co.jp/RestSearchAPI/20150630/?callback=?';
  let params={
    keyid: KEY_ID,
    format: 'json',
    latitude:35.670083,
    longitude:139.763267,
    range:1 //300メートルの範囲で探す
  };
  params.latitude=parseFloat(lat);
  params.longitude=parseFloat(lng);
  $.getJSON(url,params,function(result){
    if(result.total_hit_count>0){
      let res="";
      res+="<table class='table'>";
      res+="<tr>";
      res+=wrapTH("ID");
      res+=wrapTH("NAME");
      res+=wrapTH("ACCESS_LINE");
      res+=wrapTH("ACCESS_STATION");
      res+=wrapTH("ACCESS_WALK");
      res+="</tr>";

      for(let i in result.rest){
        res+="<tr>";
        res+=wrapTD(result.rest[i].id);
        res+=wrapTD(result.rest[i].name);
        res+=wrapTD(result.rest[i].access.line);
        res+=wrapTD(result.rest[i].access.station);
        res+=wrapTD(result.rest[i].access.walk);
        res+="</tr>";
        //res+=result.rest[i].id + ' ' + result.rest[i].name + ' ' + result.rest[i].access.line + ' ' + result.rest[i].access.station + ' ' + result.rest[i].access.walk + '分<br>';
      }
      res+="</table>";
      $("#display").html(res);
    }else{
      //alert("検索結果が見つかりませんでした。");
      $("#display").html("not found");
    }
  });
} 

function wrapTH(html){
  return "<th>"+html+"</th>";
}

function wrapTD(html){
  return "<td>"+html+"</td>";
}

function getClickLatLng(lat_lng, map) {
  let lat=lat_lng.lat();
  let lng=lat_lng.lng();
  displayRestaurants(lat,lng);
  // 座標を表示
  //document.getElementById('lat').textContent = lat_lng.lat();
  //document.getElementById('lng').textContent = lat_lng.lng();
  let marker = new google.maps.Marker({
    position: lat_lng,
    map: map
  });
  // 座標の中心をずらす
  // http://syncer.jp/google-maps-javascript-api-matome/map/method/panTo/
  map.panTo(lat_lng);
}
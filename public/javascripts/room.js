var socket = io();
var userNo = 0;
var urlParam = window.location.href;
var roomId;
var p1HP = "3";
var p2HP = "3";
console.log(urlParam)
// URLにパラメータが存在する場合
if(urlParam) {
  roomId=urlParam.split('=')
  console.log("roomIDだよ"+roomId[1]);
}
//接続管理
$(function(){
  connection();
});

function connection(){
  $.post('/connect',{roomId:roomId[1]},function(room){
    userNo = room[0].roomSum;
    console.log(room);
    console.log(userNo);
    socket.emit('connected',{
      roomId:roomId[1]
    });
  });
}


socket.on('disconnected',function(){
  $.post('/disconnect',{roomId:roomId[1]},function(){
  });
});
// chatというイベントを受信したらHTML要素に追加する
socket.on('chat', function(chat) {
  var messages = document.getElementById('chats');
  // 新しいメッセージは既にある要素より上に表示させる
  var newMessage = document.createElement('li');
  newMessage.textContent = chat.name +'「' + chat.message + '」';
  messages.insertBefore(newMessage, messages.firstChild);
});

//送信ボタンにイベントを定義
var sendButton = document.getElementById('send');
sendButton.addEventListener('click', sendMessage);

// メッセージを送信する
function sendMessage() {
  // 名前と内容を取得する
  var messageElement = document.getElementById('text');
  var message = messageElement.value;
  var nameElement = document.getElementById('name');
  var name = nameElement.value;
  // chatイベントを送信する
  socket.emit('chat', {
    message:message,
    name:name,
    roomId:roomId[1]
  });

  // 内容をリセットする
  messageElement.value = '';
}

var charactert1_X = $('#p1').position().left;
var charactert2_X = $('#p2').position().left;
var screenLeft = 3;

var p1Attack = 0;
var attackX = $('#p1').position().left;
var attackY = $('#p1').position().top;
var hanteiP1 = $('#p1').position().top;

var p2Attack = 0;
var attack2X = $('#p2').position().left;
var attack2Y = $('#p2').position().top;
var hanteiP2 = $('#p2').position().top;

var audio = new Audio('../audio/slap1.mp3');

//moveRightを受信したら右に移動させる。
socket.on('moveRight',function(position){
  if(position.character=='p1'){
    console.log("moveRight"+position.position);
    document.getElementById('p1').style.left = position.position + 'px';
    charactert1_X = $('#p1').position().left;
  }else if(position.character=='p2'){
    console.log("moveRight"+position.position);
    document.getElementById('p2').style.left = position.position + 'px';
    charactert2_X = $('#p2').position().left;
  }
});


//moveLeftを受信したら左に移動させる。
socket.on('moveLeft',function(position){
  if(position.character=='p1'){
    console.log("moveRight"+position.position);
    document.getElementById('p1').style.left = position.position + 'px';
    charactert1_X = $('#p1').position().left;
  }else if(position.character=='p2'){
    console.log("moveRight"+position.position);
    document.getElementById('p2').style.left = position.position + 'px';
    charactert2_X = $('#p2').position().left;
  }
});

socket.on('attack',function(ball){
  console.log("攻撃してるよ"+ball.player);
  if(ball.player=='p1'){
    if(p1Attack == 0){
      audio.play();
      p1Attack = 1;
      attackY = $('#p1').position().top;
      attackX = $('#p1').position().left;
      $('#p1').after('<img src="/images/tama.png" id="tama1">');
      document.getElementById('tama1').style.left = attackX + 'px';
    }
    console.log("p1攻撃");
    document.getElementById('tama1').style.top = ball.ball + 'px';
    hantei();
    if(ball.ball == 500){
      $('#tama1').remove();
      p1Attack = 0;
      attackY = $('#p1').position().top;
      clearTimeout(timer1);
    }
  }else if(ball.player=='p2'){
    if(p2Attack == 0){
      audio.play();
      p2Attack = 1;
      attack2Y = $('#p2').position().top;
      attack2X = $('#p2').position().left;
      $('#p2').before('<img src="/images/tama.png" id="tama2">');
      document.getElementById('tama2').style.left = attack2X + 'px';
    }
    console.log("p2攻撃");
    document.getElementById('tama2').style.top = ball.ball + 'px';
    hantei();
    if(ball.ball == 0){
      $('#tama2').remove();
      p2Attack = 0;
      attack2Y = $('#p2').position().top;
      clearTimeout(timer2);
    }
  }
});

function move(){
  event.preventDefault();
  console.log("動いてる"+charactert1_X);
  console.log("keycode"+event.keyCode);
  if(event.keyCode == 39){
    if(userNo==0){
      charactert1_X = charactert1_X + 3;
      socket.emit('moveRight',{
        position:charactert1_X,
        character:"p1",
        roomId:roomId[1]
      });
    }else if(userNo==1){
      charactert2_X = charactert2_X + 3;
      socket.emit('moveRight',{
        position:charactert2_X,
        character:"p2",
        roomId:roomId[1]
      });
    }
  }else if(event.keyCode == 37){
    if(userNo==0){
      charactert1_X = charactert1_X - 3;
      socket.emit('moveLeft',{
        position:charactert1_X,
        character:"p1",
        roomId:roomId[1]
      });
    }else if(userNo==1){
      charactert2_X = charactert2_X - 3;
      socket.emit('moveLeft',{
        position:charactert2_X,
        character:"p2",
        roomId:roomId[1]
      });
    }
  }else if(event.keyCode == 32){
    //攻撃するプログラム
    console.log(p1Attack);
    attack1();
  }
}
//スペースを押されると↓が動く
var check = 1;
var timer1;
var timer2;
function attack1(){
  // document.getElementById('tama1').style.left = attackX + 'px';
  if(userNo==0){
    if(p1Attack == 0){
      socket.emit('attack',{
        ball:attackY,
        player:'p1',
        roomId:roomId[1]
      });
    }
    console.log("動いてる"+attackY);
    check++;
    if(attackY <= 500){
      attackY++;
      socket.emit('attack',{
        ball:attackY,
        player:'p1',
        roomId:roomId[1]
      });
      timer1 = setTimeout('attack1()',1);
    }
  }else if(userNo==1){
    if(p1Attack == 0){
      socket.emit('attack',{
        ball:attack2Y,
        player:'p2',
        roomId:roomId[1]
      });
    }
    console.log("動いてる"+attack2Y);
    check--;
    if(attack2Y >= 0){
      attack2Y--;
      socket.emit('attack',{
        ball:attack2Y,
        player:'p2',
        roomId:roomId[1]
      });
      timer2 = setTimeout('attack1()',1);
    }
  }
}
//当たり判定のプログラム
function hantei(){
  if(attackY==hanteiP2){
    p2HP--;
    $('#p2').fadeOut(500, function(){$(this).fadeIn(500)});;
    attackY = $('#p1').position().top;
    $('#tama1').remove();
    p1Attack = 0;
    clearTimeout(timer1);
  }else if(attack2Y==hanteiP1+100){
    p1HP--;
    $('#tama2').remove();
    $('#p1').fadeOut(500, function(){$(this).fadeIn(500)});
    attack2Y = $('#p2').position().top;
    p2Attack = 0;
    clearTimeout(timer2);
  }
  if(p1HP == 0){
    alert("player2の勝ち");
    p1HP = 3;
  }else if(p2HP == 0){
    alert("player1の勝ち");
    p2HP = 3;
  }
}

// var charactert1_X = $('#p1').position().left;
// var charactert2_X = $('#p2').position().left;
// var screenLeft = 3;
//
// var p1Attack = 0;
// var attackX = $('#p1').position().left;
// var attackY = $('#p1').position().top;
// var hanteiP1 = $('#p1').position().top;
//
// var p2Attack = 0;
// var attack2X = $('#p2').position().left;
// var attack2Y = $('#p2').position().top;
// var hanteiP2 = $('#p2').position().top;

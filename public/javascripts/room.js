var socket = io();
var userNo = 0;
var urlParam = window.location.href;
var roomId;
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
  });
}
// socket.on('connected',function(user){
//   userNo = user;
//   console.log(userNo);
// });

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

  // chatイベントを送信する
  socket.emit('chat', {
    message:message
  });

  // 内容をリセットする
  messageElement.value = '';
}

var charactert1_X = $('#p1').position().left;
var charactert2_X = $('#p2').position().left;
var screenLeft = 3;
var attackX = $('#p1').position().left;
var attackY = $('#p1').position().top;
var p1Attack = 0;
//moveRightを受信したら右に移動させる。
socket.on('moveRight',function(position){
  if(userNo==0){
    console.log("moveRight"+position.position);
    document.getElementById('p1').style.left = position.position + 'px';
    charactert1_X = $('#p1').position().left;
  }else if(userNo==1){
    console.log("moveRight"+position.position);
    document.getElementById('p2').style.left = position.position + 'px';
    charactert2_X = $('#p2').position().left;
  }
});


//moveLeftを受信したら左に移動させる。
socket.on('moveLeft',function(position){
  if(userNo==0){
    console.log("moveRight"+position.position);
    document.getElementById('p1').style.left = position.position + 'px';
    charactert1_X = $('#p1').position().left;
  }else if(userNo==1){
    console.log("moveRight"+position.position);
    document.getElementById('p2').style.left = position.position + 'px';
    charactert2_X = $('#p2').position().left;
  }
});

socket.on('attack',function(ball){
  if(p1Attack == 0){
    p1Attack = 1;
    attackY = $('#p1').position().top;
    attackX = $('#p1').position().left;
    $('#p1').after('<img src="/images/tama.png" id="tama1">');
    document.getElementById('tama1').style.left = attackX + 'px';
  }
  console.log("攻撃");
  document.getElementById('tama1').style.top = ball.ball + 'px';
  if(ball.ball == 500){
    $('#tama1').remove();
    p1Attack = 0;
    attackY = $('#p1').position().top;
    clearTimeout(timer1);
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
        position:charactert1_X
      });
    }else if(userNo==1){
      charactert2_X = charactert2_X + 3;
      socket.emit('moveRight',{
        position:charactert2_X
      });
    }
  }else if(event.keyCode == 37){
    if(userNo==0){
      charactert1_X = charactert1_X - 3;
      socket.emit('moveRight',{
        position:charactert1_X
      });
    }else if(userNo==1){
      charactert2_X = charactert2_X - 3;
      socket.emit('moveRight',{
        position:charactert2_X
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
function attack1(){
  // document.getElementById('tama1').style.left = attackX + 'px';
  if(p1Attack == 0){
    socket.emit('attack',{
      ball:attackY
    });
  }
  console.log("動いてる"+attackY);
  check++;
  if(attackY <= 500){
    attackY++;
    socket.emit('attack',{
      ball:attackY
    });
    timer1 = setTimeout('attack1()',1);
  }
}


// function test(){
//   attackY = $('#p1').position().top;
//   document.getElementById('tama1').style.left = attackX + 'px';
//   document.getElementById('tama1').style.top = attackY + 'px';
//   setTimeout('test()',1000);
// }

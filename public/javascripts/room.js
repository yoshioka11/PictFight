var socket = io();
var userSum = 0;


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
  console.log("moveRight"+position.position);
  document.getElementById('p1').style.left = position.position + 'px';
  charactert1_X = $('#p1').position().left;
});
//moveRightを受信したら左に移動させる。
socket.on('moveLeft',function(position){
  console.log("moveRight"+position.position);
  document.getElementById('p1').style.left = position.position + 'px';
  charactert1_X = $('#p1').position().left;
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
    charactert1_X = charactert1_X + 3;
    socket.emit('moveRight',{
      position:charactert1_X
    });
  }else if(event.keyCode == 37){
    if(charactert1_X >= screenLeft){
      charactert1_X = charactert1_X - 3;
    }
    socket.emit('moveLeft',{
        position:charactert1_X
    });
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

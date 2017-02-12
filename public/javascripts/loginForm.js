var character = ["images/dwarf.png","images/elf.png","images/man.png","images/woman.png"];
var passive = [0,1,2,3];
$(function(){
  firstLoad();
});

function firstLoad(){
    $('#dialog').dialog({
      title:"PictFightへようこそ",
      modal:true,
    });
    $('#dialog').append('<form id="loginForm"></form>');
    $('#loginForm').append('<input type="button" value="ログイン" id="signIn">');
    $('#loginForm').append('<input type="button" value="新規登録" id="signUp">');
    $('#loginForm').append('<input type="button" value="ゲストでログイン" id="guest">');
}

//ログインボタンを押すとdialogの中身がログイン用に変わる。
function signIn(){
  $('#loginForm').children().remove();
  $('#loginForm').append('<input type="text" name="userName" id="userId">');
  $('#loginForm').append('<input type="password" name="password" id="password">');
  $('#loginForm').append('<input type="button" value="ログイン" id="login">');

  $('#login').click(function(e){
    //ログインチェックpostでデータを渡しidとパスワードが一致していればtrueが返ってきてログイン。
    var userName = $('#userId').val();
    console.log(userName);
    var password = $('#password').val();
    $.post('/loginCheck',{userName:userName,password:password},function(check){
      if(check){
        console.log("ログインしました");
        $('#dialog').dialog('close');
        console.log(check);
        $('#userName').text(check[0].userName);
        $('#win').text(check[0].win);
        $('#lose').text(check[0].lose);
        $('#userDate').append('<img src="'+check[0].character+'">');
      }else{
        $('#loginForm').append("IDかパスワードが間違っています").css('color','red');
        console.log("ログインに失敗しました");
      }
    });
  });
}

function signUp(){
  $('#loginForm').children().remove();
  $('#loginForm').append('<input type="text" name="userName" id="userId">');
  $('#loginForm').append('<input type="password" name="password" id="password">');
  console.log(character.length);
    for(var i=0;i<character.length;i++){
      $('#loginForm').append('<img src="'+character[i]+'"><input type="radio" value="'+i+'" name="キャラクター">');
    }
  $('#loginForm').append('<input type="button" value="登録する" id="create">');
  $('#create').click(function(e){
  var userName = $('#userId').val();
  var password = $('#password').val();
  var pussive = $('[name=キャラクター]:checked').val();
  if(userName.length >= 3 && password.length >= 4){
    $.post('/createUser',{userName:userName,password:password,pussive:pussive,character:character[pussive]},function(res){
      if(res){
        console.log("動いてる");
        $('#loginForm').children().remove();
        $('#loginForm').append('<span>登録完了</span>');
        setTimeout("signIn()",3000);
      }else{
        $('#loginForm').append('<span>userNameが重複しております。</span>');
      }
    });
  }else{
    $('#loginForm').append('<span>IDを３文字以上,パスワードを４文字以上で入力してください。</span>');
  }
});
}

$(function(){
  $('#signIn').click(function(e){
    console.log("signIn");
    signIn();
  });
  $('#signUp').click(function(e){
    console.log("signUp");
    signUp();
  });
  $('#guest').click(function(e){
    console.log("guest");
  });
});

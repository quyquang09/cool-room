$('form').submit(async function(e) {
    e.preventDefault();
    var email = $('[name=email]').val();
    var password = $('[name=password]').val();
    console.log(email,password)
    $('.loader-container').removeClass('display-none')
    await $.post(BASE_URL +AUTHEN_LOGIN,
    {
        'email' :email,
        'password':password
    },function(data){
        $('.loader-container').addClass('display-none')
        $('.mess-error').html(data.message)
        if(data.errCode ===0 ){
            localStorage.setItem(
                'user',
                JSON.stringify({
                    isLoggedIn: true,
                    userInfo: data.user,
                }),
            );
            window.open('home.html','_self')
            alert("Logged in successfully")
        }
        else {
            return;
        }
    })
    return false;
})
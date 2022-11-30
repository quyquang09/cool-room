
function Validator(options) {
    function getParent(element,selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element =element.parentElement;
        }
    }

    var  selectorRules = {};

    //Hàm thực hiện validate
    Validate = function(inputElement,rule) {
        var errorMessage ;
        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];
        for(var i=0 ; i<rules.length ; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage= rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage= rules[i](inputElement.value);
            }

            if(errorMessage) break;
        }
        var errorElement =getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelcetor)
        if(errorMessage){
            errorElement.innerHTML =errorMessage;
            getParent(inputElement,options.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerHTML ='';
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage;
}
    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    if(formElement) {
        //Khi submit form
        $('form').submit(async function(e) {
            e.preventDefault();
            var isFormValid =true;
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = Validate(inputElement,rule);
                if(!isValid) {
                    isFormValid =false;
                }
            });
            if(isFormValid) {
            $('.loader-container').removeClass('display-none')
              await  $.post(BASE_URL +AUTHEN_REGISTER ,
                    {
                        'firstname' : $('[name=firstname]').val(),
                        'lastname' : $('[name=lastname]').val(),
                        'email' : $('[name=email]').val(),
                        'username' : $('[name=username]').val(),
                        'password' : $('[name=password]').val(),
                        'phonenumber' : $('[name=phonenumber]').val(),
                    },function(data){
                     $('.loader-container').addClass('display-none')
                        console.log(data)
                        if(data.errCode === 0){
                            alert(data.message)
                            window.open('login.html','_self')
                        }
                        else {
                            $('.mess-error').html(data.message)
                        }
                    })
              
            }
            
            return false;
        })
        //Lặp qua mỗi rules và xử lí
        options.rules.forEach(function(rule){
            //Lưu lại các rules cho mỗi input
           
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector]=[rule.test];
            }
            var inputElement = formElement.querySelectorAll(rule.selector)
            Array.from(inputElement).forEach(function (inputElement){
                //Xử lí trường hợp blur khỏi input
                inputElement.onblur =function() {
                    Validate(inputElement,rule);
                }
                //Xử lí mỗi khi người dùng nhập vào input
                inputElement.oninput =function () {
                    var errorElement =getParent(inputElement,options.formGroupSelector).querySelector('.form-message')
                    errorElement.innerHTML ='';
                    getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
                }
            })
           
        })
        
    }
}
//Nguyên tắc chung của các rules:
//1. Khi có lỗi => trả ra message lỗi
//2.Khi hợp lệ => Không trả ra gì cả (undefined)
Validator.isRequired =function(selector) {
    return {
        selector : selector,
        test: function(value) {
            return value ? undefined : "Trường này là bắt buộc"
        }
    }
}
Validator.isAccount = function(selector,message) {
    return {
        selector : selector,
        test: function(value) {
            var usernameRegex = /^[a-zA-Z0-9]+$/;
            return usernameRegex.test(value) ? undefined : message||'Vui lòng nhập đúng định dạng'
        }
    }
}
Validator.isEmail = function(selector,message) {
    return {
        selector : selector,
        test: function(value) {
            var regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined :message || 'Trường này phải là email '
        }
    }
}
Validator.minLength =function(selector,min,message) {
    return {
        selector:selector,
        test: function(value) {
            return value.length >=min ? undefined : message||`Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}

Validator.isConfirmPassword = function(selector,getConfirmValue,message) {
    return {
        selector:selector,
        test: function(value) {
            return getConfirmValue() ===value ? undefined :message|| "Vui lòng nhập giá trị chính xác"
        }
    }
}
Validator.isRequiredLowercase = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            regexLowercase = /^[a-z]+$/
            return regexLowercase.test(value) ? undefined: message || 'Vui lòng nhập chữ cái thường'
        }
    }
}
Validator.isRequiredCapitalize = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            regexCapitalize = /^[A-Z]+$/
            return regexCapitalize.test(value) ? undefined: message || 'Vui lòng nhập chữ cái hoa'
        }
    }
}
Validator.isRequiredNumber = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            regexNumber = /^[0-9]+$/
            return regexNumber.test(value) ? undefined: message || 'Vui lòng nhập số'
        }
    }
}
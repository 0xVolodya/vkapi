new Promise(function (resolve, reject) {

    document.addEventListener("DOMContentLoaded", function () {

        VK.init({
            apiId: 5757464
        });

        VK.Auth.getLoginStatus(function (response) {
            if (response.session) {

                let wrapperInfo = document.getElementById("wrapper-info").classList;
                wrapperInfo.add('active');
                if (wrapperInfo.contains("hide")) {
                    wrapperInfo.remove('hide');
                }

                let authButtonList = document.getElementById("auth-button").classList;
                authButtonList.add('hide');
                if (authButtonList.contains("active")) {
                    authButtonList.remove('active');
                }
                resolve();
            } else {
                let authButton = document.getElementById("auth-button");
                let authButtonList = authButton.classList;
                authButtonList.add('active');
                if (authButtonList.contains("hide")) {
                    authButtonList.remove('hide');
                }

                let wrapperInfoList = document.getElementById("wrapper-info").classList;
                wrapperInfoList.add('hide');
                if (wrapperInfoList.contains("active")) {
                    wrapperInfoList.remove('active');
                }

                authButton.addEventListener("click", () => {
                    new Promise(function (resolve, reject) {
                        VK.Auth.login(function (response) {
                            if (response.session) {
                                resolve();
                            } else {
                                reject(new Error('Не удалось авторизоваться'));
                            }
                        }, 2);
                    }).then(function () {
                        resolve();
                    });
                })
                ;
            }
        });
    });
}).then(function () {
    return new Promise(function (resolve, reject) {
        VK.api('users.get', {'name_case': 'gen'}, function (response) {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                headerInfo.textContent = `Друзья на странице - ${response.response[0].first_name} ${response.response[0].last_name}`;
                resolve();
            }
        });
    })
}).then(function () {
        return new Promise(function (resolve, reject) {
            VK.api('friends.get', {'count': 5, 'fields': 'photo_100'}, function (response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    let source = friendScript.innerHTML;
                    let template = Handlebars.compile(source);
                    let templateAfter = template({list: response.response});

                    results.innerHTML = templateAfter;

                    let wrapperInfo = document.getElementById("wrapper-info").classList;
                    wrapperInfo.add('active');
                    if (wrapperInfo.contains("hide")) {
                        wrapperInfo.remove('hide');
                    }

                    let authButtonList = document.getElementById("auth-button").classList;
                    authButtonList.add('hide');
                    if (authButtonList.contains("active")) {
                        authButtonList.remove('active');
                    }

                    resolve();
                }
            });
        });
    }
).catch(function (e) {
    alert(`Ошибка: ${e.message}`);
});

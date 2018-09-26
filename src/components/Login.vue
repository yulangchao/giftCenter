<template>
  <div class="login">
    <h3>手机验证</h3>
    <input type="text" v-model="phone" placeholder="Phone"><br>

    <input type="text" v-model="password" placeholder="Code"><br>
    <div id="recaptcha-container"></div>
    <button id="sign-in-button" :disabled="!show">
      <span v-show="show">获取验证码</span>
      <span v-show="!show" class="count">{{count}} s</span>
    </button>
    <button @click="SignIn">登录抽奖</button>

  </div>
</template>

<script>
import firebase from "firebase";

export default {
    name: "login",
    data: function() {
        return {
            phone: "",
            password: "",
            show: true,
            count: "",
            timer: null
        };
    },
    mounted() {
        // [START appVerifier]
        // [START appVerifier]
        let that = this;
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "sign-in-button",
            {
                size: "invisible",
                callback: function(response) {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    that.onSignInSubmit();
                }
            }
        );
        // [END appVerifier]
        recaptchaVerifier.render().then(function(widgetId) {
            window.recaptchaWidgetId = widgetId;
        });
    },
    methods: {
        onSignInSubmit: function() {
            var phoneNumber = this.phone;
            var pattern = /^\+[0-9\s\-\(\)]+$/;
            if (phoneNumber.search(pattern) == -1) {
                console.log("手机号码错误");
                return false;
            }

            var appVerifier = window.recaptchaVerifier;

            firebase
                .auth()
                .signInWithPhoneNumber(phoneNumber, appVerifier)
                .then(confirmationResult => {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    window.confirmationResult = confirmationResult;
                    alert(JSON.stringify(confirmationResult));
                    console.log(confirmationResult);
                    if (!this.timer) {
                        this.count = 60;
                        this.show = false;
                        this.timer = setInterval(() => {
                            if (this.count > 0 && this.count <= 60) {
                                this.count--;
                            } else {
                                this.show = true;
                                clearInterval(this.timer);
                                this.timer = null;
                            }
                        }, 1000);
                    }
                })
                .catch(error => {
                    alert(JSON.stringify(error));
                    console.log(error);
                    // Error; SMS not sent
                    // ...
                });
        },
        SignIn() {
            window.confirmationResult.confirm(this.password).then(
                result => {
                    console.log(result);
                    this.$router.replace("me");
                },
                error => {
                    console.log(error);
                }
            );
        }
    }
};
</script>

<style scoped>
/* "scoped" attribute limit the CSS to this component only */
.login {
    margin-top: 40px;
    padding: 10px;
}
input {
    margin: 10px 0;
    padding: 15px;
    max-width: 250px;
    width: 100%;
}
button {
    margin-top: 20px;
    cursor: pointer;
}
p {
    margin-top: 40px;
    font-size: 13px;
}
p a {
    text-decoration: underline;
    cursor: pointer;
}
</style>

<template>
    <div id="firebaseui-auth-container"></div>
</template>
<script>
import firebase, { auth } from "firebase";
import firebaseui from "firebaseui";
import axios from "axios";
export default {
    name: "auth",
    mounted() {
        var uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                    let data = {
                        uid: authResult.user.uid,
                        mobile: authResult.user.phoneNumber.slice(2)
                    };
                    this.$indicator.open("验证登录中...");
                    axios
                        .get(this.url + "user/googleMobileLogin", {
                            params: data
                        })
                        .then(response => {
                            this.$indicator.close();
                            if (response.data.code == 1) {
                                localStorage.setItem(
                                    "userInfo",
                                    JSON.stringify(response.data.data.userinfo)
                                );
                                this.$router.push(
                                    this.$route.query.redirect.replace("#", "") || "/"
                                );
                            } else {
                            }
                        })
                        .catch(error => {
                            this.$indicator.close();
                        });

                    // Do something with the returned AuthResult.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    return false;
                }
            },
            signInOptions: [
                {
                    provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                    recaptchaParameters: {
                        type: "image", // 'audio'
                        size: "normal", // 'invisible' or 'compact'
                        badge: "bottomleft" //' bottomright' or 'inline' applies to invisible.
                    },
                    defaultCountry: "CA",
                    whitelistedCountries: ["CA"]
                }
            ]
        };
        window.ui = new firebaseui.auth.AuthUI(firebase.auth());
        window.ui.start("#firebaseui-auth-container", uiConfig);
    },
    beforeDestroy() {
        window.ui.delete();
    }
};
</script>
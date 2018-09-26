<template>
    <div id="firebaseui-auth-container"></div>
</template>
<script>
import firebase from "firebase";
import firebaseui from "firebaseui";
export default {
    name: "auth",
    mounted() {
        var uiConfig = {
            signInSuccessUrl: "/",
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
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start("#firebaseui-auth-container", uiConfig);
    }
};
</script>
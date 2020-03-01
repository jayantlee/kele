import Vue from "vue";

import App from "./app.vue";
console.log(document.getElementById("app"));
console.log(6666);

new Vue({
  el: "#app",
  render(h) {
    return h(App);
  },
});

<template>
  <v-layout>
    <Login/>
    <Members id="memberWindow"/>

    <v-layout column align-end>
      <!-- <v-layout column> -->
      <Profile id="profile"/>
      <!-- </v-layout> -->
    </v-layout>
    <!-- </v-card> -->
  </v-layout>
</template>

<script>
import Login from "../components/Login";
import Profile from "../components/Profile";
import Members from "../components/Members";

export default {
  components: {
    Login,
    Profile,
    Members
  }
};
</script>

<style scoped>
#memberWindow {
  margin: 20px;
  width: 70%;
  box-shadow: 2px 2px 10px gray;
}
#profile {
  /* border: 2px outset gray; */
  /* height: 100px; */
  width: 300px;
}
</style>
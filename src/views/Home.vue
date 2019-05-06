<template>
  <v-layout row justify-end="true">
    <Login/>
    <Members/>

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
#profile {
  /* border: 2px outset gray; */
  /* height: 100px; */
  width: 300px;
}
</style>
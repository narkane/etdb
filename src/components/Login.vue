<template>
  <v-layout row justify-center>
    <v-dialog v-model="loginWindow" persistent max-width="300px">
      <v-card>
        <!-- <v-card-text> -->
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-model="user.name" label="Email *" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="user.pass" label="Password *" type="password" required></v-text-field>
            </v-flex>
            <!-- </v-card-text> -->
          </v-layout>
        </v-container>
        <v-card-actions>
          <!-- <v-layout id="logreg" row> -->
          <Register/>
          <v-spacer/>
          <v-btn color="blue darken-1" flat @click="loginAcct()">Login</v-btn>
          <!-- </v-layout> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from "axios";

import Register from "./Register";

export default {
  components: { Register },
  data() {
    return {
      loginWindow: true,
      user: {
        name: "",
        pass: ""
      }
    };
  },
  methods: {
    loginAcct: function() {
      // close modal

      axios
        .post("/login", {
          username: this.user.name,
          password: this.user.pass
        })
        .then(resp => {
          console.log(resp.data);
          if (resp.status === 200) {
            // console.log(true);
            //this.setState({ loggedIn: true });
            this.loginWindow = false;
            console.log("yup");
            // updateLoggedIn(true);
          } else {
            // console.log(resp.status);
            alert(
              resp.status + ": no match found for that (Username : Password)"
            );
            // updateLoggedIn(false);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style scoped>
input {
  font-size: 32pt;
}
#logreg {
  margin-bottom: 5%;
}
</style>
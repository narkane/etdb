<template>
  <v-layout row justify-left>
    <v-dialog v-model="registerWindow" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="pink darken-1" flat @click="registerWindow=true">Register</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Register</span>
          <v-spacer/>
          <span id="profile">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field disabled="true" label="Legal first name*" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  disabled="true"
                  label="Legal middle name"
                  hint="example of helper text only on focus"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  disabled="true"
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email*" v-model="user.name" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password*" v-model="user.pass" type="password" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  disabled="true"
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Age*"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete
                  disabled="true"
                  :items="['SandScan AR', 'Surrogate']"
                  label="Project Teams"
                  multiple
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="register()">Create</v-btn>
          <v-btn color="blue darken-1" flat @click="registerWindow = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    registerWindow: false,
    user: {
      name: "",
      pass: ""
    }
  }),
  methods: {
    register: function() {
      axios
        .post("http://sdc.thummel.site:3004/register", {
          username: this.user.name,
          password: this.user.pass
        })
        .then(resp => {
          this.registerWindow = false;
          console.log(resp);
        });
    }
  }
};
</script>

<style scoped>
#notready {
  text-decoration: line-through;
}
#profile {
  font-size: 12pt;
}
</style>

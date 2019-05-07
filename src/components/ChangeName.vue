<template>
  <v-layout row justify-left>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="pink darken-1" flat @click="dialog=true">Change Username</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Change Name</span>
          <v-spacer/>
          <span id="profile">
            <v-alert v-model="alert" :value="true" type="success">This is a success alert.</v-alert>
          </span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  append-icon="send"
                  class="changename"
                  color="red darken-1"
                  flat
                  label="New Username"
                  v-model="newName"
                />
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Username*" v-model="user.name" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password*" v-model="user.pass" type="password" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="changeName()">Change</v-btn>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script>
import axios from "axios";

export default {
  data: () => ({
    user: {
      name: "",
      pass: ""
    },
    newName: "",
    dialog: false,
    alert: false
  }),
  methods: {
    changeName: function() {
      axios
        .put("/change_name", {
          newName: this.newName,
          oldName: this.user.name,
          password: this.user.pass
        })
        .then(resp => {
          console.log(resp);
          if ((resp.status = 200)) {
            console.log("YAY new name!");
            this.alert = true;
          }
        });
      setTimeout(() => {
        //your code to be executed after 1 second
        this.dialog = false;
      }, 2500);
    }
  }
};
</script>

<style scoped>
.changename {
  max-width: 200px;
}
</style>
<template>
    <!-- <template v-slot:activator="{ on }"> -->
    <v-btn color="red darken-1" @click="deleteAccount()">Delete Account!</v-btn>
    <!-- </template> -->
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    user: {
      name: "",
      pass: ""
    }
  }),
  methods: {
    deleteAccount: function() {
      axios.delete("http://sdc.thummel.site:3004/delete").then(resp => {
        alert(resp.data);
        console.log(resp);
        if (resp.status == 200) {
          //this.setState({ loggedIn: false });
          alert("Account Deleted!");
          this.logout();
        }
      });
    },
    logout: function() {
      axios.get("http://sdc.thummel.site:3004/logout").then(resp => {
        alert(resp.data);
        console.log(resp);
        if (resp.status == 200) {
          // updateLoggedIn(false);
        }
      });
    }
  }
};
</script>

<style scoped>
#profile {
  font-size: 12pt;
}
</style>

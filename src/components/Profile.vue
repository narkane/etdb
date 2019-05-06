<template>
  <v-expansion-panel>
    <v-expansion-panel-content>
      <template v-slot:actions>
        <v-icon>list</v-icon>
      </template>
      <template v-slot:header>
        <div>Settings</div>
      </template>
      <v-card>
        <v-card-text id="prof">
          <v-layout column justify-start align-center>
            <ChangeName/>
            <Delete/>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import ChangeName from "../components/ChangeName";
import Delete from "../components/Delete";

export default {
  components: {
    ChangeName,
    Delete
  }
};
</script>

<style scoped>
#prof {
  border: 1px solid lightcoral;
  /* background-color: lightgray; */
}
</style>
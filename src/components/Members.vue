<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="light-blue" dark>
          <v-toolbar-side-icon></v-toolbar-side-icon>

          <v-toolbar-title>My files</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>view_module</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list two-line subheader>
          <v-subheader inset>Folders</v-subheader>
          {{members && members}}
          <v-list-tile v-for="item in items" :key="item.title" avatar @click>
            <v-list-tile-avatar>
              <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-subheader inset>Files</v-subheader>

          <v-list-tile v-for="item in items2" :key="item.title" avatar @click>
            <v-list-tile-avatar>
              <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      members: null,
      membersRet: null,
      items: [
        {
          icon: "folder",
          iconClass: "grey lighten-1 white--text",
          title: "Photos",
          subtitle: "Jan 9, 2014"
        },
        {
          icon: "folder",
          iconClass: "grey lighten-1 white--text",
          title: "Recipes",
          subtitle: "Jan 17, 2014"
        },
        {
          icon: "folder",
          iconClass: "grey lighten-1 white--text",
          title: "Work",
          subtitle: "Jan 28, 2014"
        }
      ],
      items2: [
        {
          icon: "assignment",
          iconClass: "blue white--text",
          title: "Vacation itinerary",
          subtitle: "Jan 20, 2014"
        },
        {
          icon: "call_to_action",
          iconClass: "amber white--text",
          title: "Kitchen remodel",
          subtitle: "Jan 10, 2014"
        }
      ]
    };
  },
  methods: {
    getDPMembers: function() {
      let retTotal = [];
      let ret;

      axios
        .get("http://localhost:3004/devpool/members")
        .then(resp => {
          if (resp.status == 200) {
            this.members = resp.data;
            alert(this.members);
            console.log(this.members);
            this.members.map((el, index) => {
              let tn = el.team_name;
              //selected team
              //   if (tn == sTeam) {
              if (tn) {
                alert(retTotal);
                retTotal.push(
                  <div
                    key={index}
                    // style={{
                    //   background: `rgba(${(Math.pow(el.team_user.length, 2) %
                    //     25) *
                    //     10}, ${(Math.pow(el.team_user.length, 2) *
                    //     el.team_user.charCodeAt(0)) %
                    //     256}, ${el.team_user.length * 15}, 0.5`
                    // }}
                  >
                    <div id="dev-lead">{el.team_user}</div>
                  </div>
                );
              }
              ret = retTotal.map(el => {
                return el;
              });
              ret = <div className="members-area">{ret}</div>;
              //   this.membersInSelectedTeamInspect = ret ;
              this.membersRet = ret;
              alert(this.membersRet);
            });
          }
        })
        .catch(e => {
          console.log("dog");
          console.log("dog");
          console.log("dog");
          console.log(e.status);
        });
      // this.forceUpdate();
    }
  },
  beforeMount() {
    this.getDPMembers();
  }
};
</script>
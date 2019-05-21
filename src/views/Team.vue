<template>
    <div class='section'>  
        <!-- Main container -->
        <nav class="level">
            <!-- Left side -->
            <div class="level-left">
                <div class="level-item">
                    <div class="field has-addons">
                        <p class="control">
                            <input class="input" type="text" placeholder="Find a post">
                        </p>
                        <p class="control">
                            <button class="button">
                                Search
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Right side -->
            <div class="level-right">
                <a class="level-item button is-success is-outlined" @click="isAddTeamMemberModalActive = true"><span class="icon"><i class="fas fa-user-plus"></i></span><span>Add</span></a>
            </div>
            <b-modal :active.sync="isAddTeamMemberModalActive" has-modal-card>
                <add-team-member></add-team-member>
            </b-modal>
        </nav>
        <div class="columns">
            <div class="column">
                <div class="list" v-for="member in teamMembers" :key="member.id">
                    <div class="list-item">
                        <div class="columns">
                            <div class="column">
                                <p class="title is-5">{{member.user.first_name}} {{member.user.last_name}}</p>
                                <p class="subtitle is-6">{{member.user.email}}</p>
                            </div>
                            <div class="column">
                                {{member.role}}
                            </div>
                            <div class="column">
                                <button v-if="member.user.is_active" class="button is-pulled-right is-danger is-outlined">Remove</button>
                                <button v-else class="button is-pulled-right">Send Invite</button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>      
        
    </div>

</template>

<script>
import { mapState, mapGetters } from "vuex"
import AddTeamMember from "@/components/AddTeamMember.vue"

export default {
  name: "controls",
  components: {
    AddTeamMember
  },
  computed: {
    ...mapState([
      'teamMembers'
    ]),
    ...mapGetters([
      'isAdmin',
    ]),
  },
  created () {
    this.$store.dispatch('getTeamMembers')
  },
  data() {
    return {
       isAddTeamMemberModalActive: false, 
    };
  },
  methods: {
  }
}
</script>

<style>

</style>

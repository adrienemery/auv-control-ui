<template>
    <form action="">
        <div class="modal-card" style="width: 300px">
            <header class="modal-card-head">
                <p class="modal-card-title">Add Team Member</p>
            </header>
            <section class="modal-card-body">
                <b-field label="Username">
                    <b-input
                        type="text"
                        v-model="username"
                        :value="username"
                        required>
                    </b-input>
                </b-field>
                
                <b-field label="Email">
                    <b-input
                        type="email"
                        v-model="email"
                        required>
                    </b-input>
                </b-field>

                <b-field label="First Name">
                    <b-input
                        type="text"
                        v-model="firstName"
                        required>
                    </b-input>
                </b-field>

                <b-field label="Last Name">
                    <b-input
                        type="text"
                        v-model="lastName"
                        required>
                    </b-input>
                </b-field>

            </section>
            <footer class="modal-card-foot">
                <button class="button" type="button" @click="$parent.close()">Close</button>
                <button class="button is-primary" @click="addTeamMember">Save</button>
            </footer>
        </div>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                username: '',
                firstName: '',
                lastName: '',
                email: '',
            }
        },
        methods: {
            addTeamMember () {
                let data = {
                    username: this.username,
                    first_name: this.firstName,
                    last_name: this.lastName,
                    email: this.email,
                }
                console.log(this.username)
                this.$store.dispatch('addTeamMember', data).then(this.$parent.close())
            }
        }
    }
</script>
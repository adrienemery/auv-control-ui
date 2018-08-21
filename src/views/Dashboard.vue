<template>
    <div class='section'>
        <h3>Dash</h3>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "debug",
  computed: {
    ...mapState([
      'auvData'
    ])
  },
  data() {
    return {
    }
  },
 
}
</script>

<style>
</style>

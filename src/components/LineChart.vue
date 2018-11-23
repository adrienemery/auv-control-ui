
<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  props: ['options'],
  mixins: [mixins.reactiveProp],
  extends: Line,
  name: 'linechart',
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>


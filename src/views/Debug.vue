<template>
    <div class='section'>
        <h3 class="header">Motor Controls</h3>

        <div class="control">
            <label class="radio">
            <input type="radio" value="individual" v-model="mode">
                Individual Motor
            </label>

            <div class="columns">
                <div class="column">
                    <p>Left Motor: {{leftMotorSpeed}} %</p>
                    <div class="slidecontainer">
                        <input type="range" min="1" max="100" value="50" class="slider" id="myRange" v-model="leftMotorSpeed" :disabled="mode !== 'individual'">
                    </div>
                </div>
                <div class="column">
                    <p>Right Motor: {{rightMotorSpeed}} %</p>
                    <div class="slidecontainer">
                        <input type="range" min="1" max="100" value="50" class="slider" id="myRange" v-model="rightMotorSpeed" :disabled="mode !== 'individual'">
                    </div>
                </div>
            </div>  

            <label class="radio">
            <input type="radio" value="dual" v-model="mode">
                Steering Control
            </label>

             <div class="columns">
                <div class="column">
                    <p>Turn: {{turnVal}}</p>
                    <div class="slidecontainer">
                        <input type="range" min="-100" max="100" value="50" class="slider" id="myRange" v-model="turnVal" :disabled="mode !== 'dual'">
                    </div>
                </div>
            </div>
        </div>
        
        <div class="columns">
                <div class="column">
                    <h3>GPS</h3>
                    <p>Lat:</p>
                    <p>Lon:</p>
                </div>
                <div class="column">
                    <h3>AHRS</h3>
                    <p>X: </p>
                    <p>Y: </p>
                    <p>Z: </p>
                    <p>Heading: </p>
                </div>
            </div>
         
    </div>

</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'debug',
    data () {
        return {
            leftMotorSpeed: 0,
            rightMotorSpeed: 0,
            turnVal: 0,
            mode: 'individual'
        }
    },
    watch: {
        leftMotorSpeed (newVal, oldVal) {
            this.setLeftMotor(newVal)
        },
        rightMotorSpeed (newVal, oldVal) {
            this.setRightMotor(newVal)
        }
    },
    methods: {
        setLeftMotor (speed) {
            this.$wamp.call('auv.set_left_motor_speed', [speed])
        },
        setRightMotor (speed) {
            this.$wamp.call('auv.set_right_motor_speed', [speed])
        },        
    }

}
</script>

<style>
    .slidecontainer {
        width: 100%; /* Width of the outside container */
    }

    /* The slider itself */
    .slider {
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        width: 100%; /* Full-width */
        height: 25px; /* Specified height */
        background: #d3d3d3; /* Grey background */
        outline: none; /* Remove outline */
        opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
        -webkit-transition: .2s; /* 0.2 seconds transition on hover */
        transition: opacity .2s;
    }

    /* Mouse-over effects */
    .slider:hover {
        opacity: 1; /* Fully shown on mouse-over */
    }

    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */ 
    .slider::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #4CAF50; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

    .slider::-moz-range-thumb {
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #4CAF50; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

</style>

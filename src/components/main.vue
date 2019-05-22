<template>
    <div>
        Hello from entry point
    </div>
</template>


<script>

import FuelEfficiencyScore from '../class/FuelEfficiencyScore.js';

export default {
    created() {
        
        console.log("entry point !");
        this.init();
    },
    methods: {

        init() {

            var myScore = new FuelEfficiencyScore();
            myScore.getScore();
            //console.log(myScore.transformData());
        }
    }
};
</script>

<template>
    <div>
        Hello from entry point
    </div>
</template>


<script>

import FuelEfficiencyScore from '../class/FuelEfficiencyScore.js';
import FetchData from '../class/FetchData.js';

import defaultConfig from '../config/defaultConfig.js';

export default {
    created() {
        
        console.log("entry point !");
        this.init();
    },
    methods: {

        init() {

            const tmpData = new FetchData();
            
            var data = tmpData.getData();

            const myScore = new FuelEfficiencyScore(data, defaultConfig);
            myScore.getScore();
        }
    }
};
</script>

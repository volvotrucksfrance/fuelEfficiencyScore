import configMatrice from '../config/configMatrice.js';

export default class FuelEfficiencyScore {

    constructor(data, defaultConfig) {

        this.defaultConfig = defaultConfig;
        this.data = data;
    }

    getMaxBetweenVal(tab, value) {

        const above = tab[Math.ceil(value)];
        const lower = tab[Math.trunc(value)];

        return Math.max(above, lower);
    }

    getFesScore() {

        let stats = this.data;

        const fes_score = {
            coasting: this.getMaxBetweenVal(configMatrice.coasting, stats.coasting),
            braking: this.getMaxBetweenVal(configMatrice.braking, stats.ratioFreinage),
            i_shift_a: configMatrice.i_shift_auto[Math.ceil(stats.auto)],
            i_shift_m: configMatrice.i_shift_manual[Math.ceil(stats.manual)],
            i_shift_p: configMatrice.i_shift_power[Math.ceil(stats.power)],
            topgear: configMatrice.topgear[Math.ceil(stats.topGear)],
            inEco: configMatrice.inEco[Math.ceil(stats.inEco)],
            outEco: configMatrice.outEco[Math.ceil(stats.outEco)],
            overrev: configMatrice.overrev[Math.ceil(stats.overrev)],
            engineload: configMatrice.engineload[Math.ceil(stats.engineload)],
            overspeed: configMatrice.overspeed[Math.ceil(stats.overspeed)],
            cruise: configMatrice.cruise[Math.ceil(stats.cruise)],
            idling: configMatrice.idling[Math.ceil(stats.idling)],
        };

        return fes_score;
    }

    getScore() {

        const fes_score = this.getFesScore();

        var sum = 0;

        const anticipationSum = (this.defaultConfig.anticipation_and_braking.coasting*fes_score.coasting)
                    +(this.defaultConfig.anticipation_and_braking.braking*fes_score.braking);
        sum += anticipationSum*this.defaultConfig.anticipation_and_braking.group_weight;

        const engineSum = ((this.defaultConfig.engine_and_gear_utilisation.i_shift_auto*fes_score.i_shift_a)
                    +(this.defaultConfig.engine_and_gear_utilisation.i_shift_manuel*fes_score.i_shift_m)
                    +(this.defaultConfig.engine_and_gear_utilisation.i_shift_power*fes_score.i_shift_p)
                    +(this.defaultConfig.engine_and_gear_utilisation.top_gear*fes_score.topgear)
                    +(this.defaultConfig.engine_and_gear_utilisation.withing_eco*fes_score.inEco)
                    +(this.defaultConfig.engine_and_gear_utilisation.out_eco*fes_score.outEco)
                    +(this.defaultConfig.engine_and_gear_utilisation.overrev*fes_score.overrev)
                    +(this.defaultConfig.engine_and_gear_utilisation.engine_load*fes_score.engineload));
        sum += engineSum*this.defaultConfig.engine_and_gear_utilisation.group_weight;

        const speedSum = ((this.defaultConfig.speed_adaption.fleet_overspeed*fes_score.overspeed)
                +(this.defaultConfig.speed_adaption.cruise_control*fes_score.cruise));
        sum += speedSum*this.defaultConfig.speed_adaption.group_weight;

        const stopSum = this.defaultConfig.stand_still.idling*fes_score.idling;
        sum += stopSum*this.defaultConfig.stand_still.group_weight;

        return {
            score: Math.round(sum/10000),
            anticipation: this.categorieScore(anticipationSum),
            engine: this.categorieScore(engineSum),
            speed: this.categorieScore(speedSum),
            idle: this.categorieScore(stopSum)
        }
    }

    categorieScore(val) {

        return Math.ceil(val/100);
    }

    average(array) {
        var sum = 0;
        var count = array.length;
        for (var i = 0; i < count; i++) {
            sum = sum + array[i];
        }
        return (sum / count).toFixed(1);
    }
}
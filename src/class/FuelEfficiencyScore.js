import configMatrice from '../config/configMatrice.js';
import defaultConfig from '../config/defaultConfig.js';

import data from '../data/fake_data.js';

export default class FuelEfficiencyScore {

    constructor() {

        this.defaultConfig = defaultConfig;
        this.data = data;
    }

    transformData() {

        let accumulatedData = data.vehicleStatusResponse.vehicleStatuses[0].accumulatedData;
        let volvoData = accumulatedData.volvoGroupAccumulated;

        const totalDist = data.vehicleStatusResponse.vehicleStatuses[0].hrTotalVehicleDistance;

        let brut_stats = {};

        //i-shift
        brut_stats.auto = 0;
        brut_stats.manual = 0;
        brut_stats.power = 0;

            let arrayShift = volvoData.transmissionModeSeconds;

            for(var i in arrayShift) {

                switch (arrayShift[i].label) {
                    case 'AUTO':
                        brut_stats.auto += arrayShift[i].value;
                        break;
                    case 'MANUAL':
                        brut_stats.manual += arrayShift[i].value;
                        break;
                    case 'POWER':
                        brut_stats.power += arrayShift[i].value;
                        break;
                }
            }
        /////////

        brut_stats.coasting = (volvoData.coasting.meters/(totalDist - accumulatedData.distanceCruiseControlActive))*100;

        brut_stats.ratioFreinage = volvoData.brakeCount/volvoData.stopCount;

        brut_stats.topGear = volvoData.topGear.meters;
        
        brut_stats.inEco = volvoData.engineWithinGreenArea.meters;

        brut_stats.outEco = volvoData.engineOutOfGreenArea.meters;

        brut_stats.overrev = volvoData.engineOverrev.meters;

        brut_stats.engineload = volvoData.engineOverload.meters;

        brut_stats.overspeed = volvoData.roadOverspeed.meters;

        brut_stats.cruise = accumulatedData.durationCruiseControlActive;

        brut_stats.idling = 5;

        return brut_stats;
    }

    getFesScore() {

        let stats = this.transformData();

        const fes_score = {
            coasting: configMatrice.coasting[Math.ceil(stats.coasting)],
            braking: configMatrice.braking[Math.ceil(stats.ratioFreinage)],
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

        console.log(fes_score);

        var sum = 0;

        sum += ((defaultConfig.anticipation_and_braking.coasting*fes_score.coasting)
            +(defaultConfig.anticipation_and_braking.braking*fes_score.braking))
            *defaultConfig.anticipation_and_braking.group_weight;

        sum += ((defaultConfig.engine_and_gear_utilisation.i_shift_auto*fes_score.i_shift_a)
            +(defaultConfig.engine_and_gear_utilisation.i_shift_manuel*fes_score.i_shift_m)
            +(defaultConfig.engine_and_gear_utilisation.i_shift_power*fes_score.i_shift_p)
            +(defaultConfig.engine_and_gear_utilisation.top_gear*fes_score.topgear)
            +(defaultConfig.engine_and_gear_utilisation.withing_eco*fes_score.inEco)
            +(defaultConfig.engine_and_gear_utilisation.out_eco*fes_score.outEco)
            +(defaultConfig.engine_and_gear_utilisation.overrev*fes_score.overrev)
            +(defaultConfig.engine_and_gear_utilisation.engine_load*fes_score.engineload))
            *defaultConfig.engine_and_gear_utilisation.group_weight;

        sum += ((defaultConfig.speed_adaption.fleet_overspeed*fes_score.overspeed)
           +(defaultConfig.speed_adaption.cruise_control*fes_score.cruise))
           *defaultConfig.speed_adaption.group_weight;

        sum += ((defaultConfig.stand_still.idling*fes_score.idling))
          *defaultConfig.stand_still.group_weight;

        console.log(Math.trunc(sum/10000));
    }
}
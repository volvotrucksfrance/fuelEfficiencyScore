import data from '../data/fake_data.js';

export default class FetchData {

    constructor(listTrucks) {

        this.listTrucks = listTrucks;
    }

    getData() {

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
}
export default class MergeData {

    

    constructor() {

        this.mergedData = {};
        this.mergedDataTrucks = {};
    }

    getDataTrucks() {

        return this.mergedDataTrucks;
    }

    getFormatedData(data) {

        let formatData = [];

        const listVin = Object.keys(data);

        for(var i in listVin) {

            const vin = listVin[i];

            const tmpData = data[vin];
            const dist = tmpData.distance;
            const time = tmpData.time;

            if(dist != NaN && time != NaN) {

            formatData.push({
                coasting: (tmpData.coasting.meters/dist)*100,
                ratioFreinage: tmpData.brakeCount
                                /tmpData.stopCount,
                auto: (tmpData.transmissionModeSeconds[0].value/time)*100,
                manual: (tmpData.transmissionModeSeconds[1].value/time)*100,
                power: (tmpData.transmissionModeSeconds[2].value/time)*100,
                topGear: (tmpData.topGear.meters/dist)*100,
                inEco: (tmpData.engineWithinGreenArea.meters/dist)*100,
                outEco: (tmpData.engineOutOfGreenArea.meters/dist)*100,
                overrev: (tmpData.engineOverrev.meters/dist)*100,
                engineload: (tmpData.engineOverload.meters/dist)*100,
                overspeed: (tmpData.roadOverspeed.meters/dist)*100,
                cruise: (tmpData.cruise.meters/dist)*100,
                idling: 0,
                vin: vin
            });
            }
        }

        return formatData;

        /* for(var i in data) {

            const dist = data[i].distance;
            const time = data[i].time;

            formatData.push({
                coasting: data[i].coasting.meters/dist,
                ratioFreinage: data[i].brakeCount
                                /data[i].stopCount,
                auto: data[i].transmissionModeSeconds[0].value/time,
                manual: data[i].transmissionModeSeconds[1].value/time,
                power: data[i].transmissionModeSeconds[2].value/time,
                topGear: data[i].topGear.meters/dist,
                inEco: data[i].engineWithinGreenArea.meters/dist,
                outEco: data[i].engineOutOfGreenArea.meters/dist,
                overrev: data[i].engineOverrev.meters/dist,
                engineload: data[i].engineOverload.meters/dist,
                overspeed: data[i].roadOverspeed.meters/dist,
                cruise: data[i].cruise.meters/dist,
                idling: 0,
                vin: i
            });
        }

        return formatData; */
    }

    byTrucks(brut_data) {

        const debut = brut_data.debut;
        const fin = brut_data.fin;

        const listVin = Object.keys(debut);

        for(var i in listVin) {

            const tmpVin = listVin[i];

            //Si Debut et Fin
            if(fin[tmpVin] && this.hasVolvoGroup(debut[tmpVin]) && this.hasVolvoGroup(fin[tmpVin])) {

                this.mergedDataTrucks[tmpVin] = this.makeDiff(debut[tmpVin], fin[tmpVin]);
            }
        }

        return this.mergedDataTrucks;
    }

    hasVolvoGroup(data) {

        return Object.entries(data.accumulatedData.volvoGroupAccumulated).length != 0;
    }

    makeDiff(a, b) {
 
        const bVolvoData = b.accumulatedData.volvoGroupAccumulated;
        const aVolvoData =  a.accumulatedData.volvoGroupAccumulated;

        return {
            "time": b.totalEngineHours*60*60 -  a.totalEngineHours*60*60,
            "distance": b.hrTotalVehicleDistance - a.hrTotalVehicleDistance,
            "cruise": {
                "seconds": b.accumulatedData.durationCruiseControlActive - a.accumulatedData.durationCruiseControlActive,
                "meters": b.accumulatedData.distanceCruiseControlActive - a.accumulatedData.distanceCruiseControlActive,
            },
            "brakeCount": bVolvoData.brakeCount - aVolvoData.brakeCount,
            "coasting": {
                "seconds": bVolvoData.coasting.seconds - aVolvoData.coasting.seconds,
                "meters": bVolvoData.coasting.meters - aVolvoData.coasting.meters
            },
            "engineOverload": {
                "seconds": bVolvoData.engineOverload.seconds - aVolvoData.engineOverload.seconds,
                "meters": bVolvoData.engineOverload.meters - aVolvoData.engineOverload.meters
            },
            "engineOverrev": {
                "seconds": bVolvoData.engineOverrev.seconds - aVolvoData.engineOverrev.seconds,
                "meters": bVolvoData.engineOverrev.meters - aVolvoData.engineOverrev.meters
            },
            "engineWithinGreenArea": {
                "seconds": bVolvoData.engineWithinGreenArea.seconds - aVolvoData.engineWithinGreenArea.seconds,
                "meters": bVolvoData.engineWithinGreenArea.meters - aVolvoData.engineWithinGreenArea.meters
            },
            "engineOutOfGreenArea": {
                "seconds": bVolvoData.engineOutOfGreenArea.seconds - aVolvoData.engineOutOfGreenArea.seconds,
                "meters": bVolvoData.engineOutOfGreenArea.meters - aVolvoData.engineOutOfGreenArea.meters
            },
            "transmissionModeSeconds": [
                {
                    "label": "AUTO",
                    "value": bVolvoData.transmissionModeSeconds[0].value - aVolvoData.transmissionModeSeconds[0].value
                },
                {
                    "label": "MANUAL",
                    "value": bVolvoData.transmissionModeSeconds[1].value - aVolvoData.transmissionModeSeconds[1].value
                },
                {
                    "label": "POWER",
                    "value": bVolvoData.transmissionModeSeconds[2].value - aVolvoData.transmissionModeSeconds[2].value
                }
            ],
            "convoyWeightMeters": [
                {
                    "label": "LIGHT",
                    "value": bVolvoData.convoyWeightMeters[0].value - aVolvoData.convoyWeightMeters[0].value
                },
                {
                    "label": "MEDIUM",
                    "value": bVolvoData.convoyWeightMeters[1].value - aVolvoData.convoyWeightMeters[1].value
                },
                {
                    "label": "FULL",
                    "value": bVolvoData.convoyWeightMeters[2].value - aVolvoData.convoyWeightMeters[2].value
                }
            ],
            "roadOverspeed": {
                "seconds": bVolvoData.roadOverspeed.seconds - aVolvoData.roadOverspeed.seconds,
                "meters": bVolvoData.roadOverspeed.meters - aVolvoData.roadOverspeed.meters
            },
            "stopCount": bVolvoData.stopCount - aVolvoData.stopCount,
            "topGear": {
                "seconds": bVolvoData.topGear.seconds - aVolvoData.topGear.seconds,
                "meters": bVolvoData.topGear.meters - aVolvoData.topGear.meters
            },
            "engineTotalCatalystUsed": bVolvoData.engineTotalCatalystUsed - aVolvoData.engineTotalCatalystUsed,
            /* "withoutCatalyst": {
                "seconds": bVolvoData.withoutCatalyst.seconds - aVolvoData.withoutCatalyst.seconds,
                "meters": bVolvoData.withoutCatalyst.meters - aVolvoData.withoutCatalyst.meters
            } */
        }; 
    }

    byDriver(brut_data) {

        for(var i in brut_data) {

            const tmpData = brut_data[i];

            const driverID = this._getDriverID(tmpData);

            if(driverID != null) {

                if(this.mergedData[driverID] == undefined) {

                    this.mergedData[driverID] = this._newTemplate();
                }
    
                for (var i in this.mergedData[driverID]) {
    
                    if(i == 'cruise') {
    
                        const valueSec = tmpData.accumulatedData.durationCruiseControlActive || 0;
                        const valueMet = tmpData.accumulatedData.distanceCruiseControlActive || 0;
    
                        this.mergedData[driverID][i].seconds += valueSec;
                        this.mergedData[driverID][i].meters += valueMet;
                    } else if(i == 'distance') {
    
                        const value = tmpData.hrTotalVehicleDistance || 0;
    
                        this.mergedData[driverID][i] += value;
                    } else if(i == 'time') {
    
                        const value = tmpData.totalEngineHours*60*60 || 0;
    
                        this.mergedData[driverID][i] += value;
                    } else {
    
                        this._addVolvoGroupValue(driverID, i, tmpData);
                    }
    
                }
            }

            
        }

        console.log(this.mergedData);

        return this.mergedData;
    }

    _addVolvoGroupValue(driverID, ref, data) {

        try {

            switch (typeof data.accumulatedData.volvoGroupAccumulated[ref]) {
                case 'object':

                    if(Array.isArray(data.accumulatedData.volvoGroupAccumulated[ref])) {

                        const value0 = data.accumulatedData.volvoGroupAccumulated[ref][0].value || 0;
                        const value1 = data.accumulatedData.volvoGroupAccumulated[ref][1].value || 0;
                        const value2 = data.accumulatedData.volvoGroupAccumulated[ref][2].value || 0;
                        
                        this.mergedData[driverID][ref][0].value += value0;
                        this.mergedData[driverID][ref][1].value += value1;
                        this.mergedData[driverID][ref][2].value += value2;
                    } else {

                        const valueSec = data.accumulatedData.volvoGroupAccumulated[ref].seconds || 0;
                        const valueMet = data.accumulatedData.volvoGroupAccumulated[ref].meters || 0;
            
                        this.mergedData[driverID][ref].seconds += valueSec;
                        this.mergedData[driverID][ref].meters += valueMet;
                    }
                    
                    break;
                case 'number':
                    const value = data.accumulatedData.volvoGroupAccumulated[ref] || 0;
                    this.mergedData[driverID][ref] += value;
                    break;
            }

        } catch (err) {

            console.log("err", err);
        }
    }

    _getDriverID(data) {

        return data.driver1Id ? data.driver1Id.tachoDriverIdentification.driverIdentification : null;
    }

    _newTemplate() {

        return {
            "time": 0,
            "distance": 0,
            "cruise": {
                "seconds": 0,
                "meters": 0
            },
            "brakeCount": 0,
            "coasting": {
                "seconds": 0,
                "meters": 0
            },
            "engineOverload": {
                "seconds": 0,
                "meters": 0
            },
            "engineOverrev": {
                "seconds": 0,
                "meters": 0
            },
            "engineWithinGreenArea": {
                "seconds": 0,
                "meters": 0
            },
            "engineOutOfGreenArea": {
                "seconds": 0,
                "meters": 0
            },
            "transmissionModeSeconds": [
                {
                    "label": "AUTO",
                    "value": 0
                },
                {
                    "label": "MANUAL",
                    "value": 0
                },
                {
                    "label": "POWER",
                    "value": 0
                }
            ],
            "convoyWeightMeters": [
                {
                    "label": "LIGHT",
                    "value": 0
                },
                {
                    "label": "MEDIUM",
                    "value": 0
                },
                {
                    "label": "FULL",
                    "value": 0
                }
            ],
            "roadOverspeed": {
                "seconds": 0,
                "meters": 0
            },
            "stopCount": 0,
            "topGear": {
                "seconds": 0,
                "meters": 0
            },
            "engineTotalCatalystUsed": 0,
            "withoutCatalyst": {
                "seconds": 0,
                "meters": 0
            }
        };
    }
}
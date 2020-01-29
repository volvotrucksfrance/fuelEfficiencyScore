const LIST_UNITS = ['meters', 'seconds', 'milliLitres'];

export default class MergeVehicleStatuses {

    constructor(a, b) {

        this._a = a;
        this._b = b;
        this._summed = {};
    }

    getSummedStatuses() {

        return this._summed;
    }

    _makeSumObj(a, b) {

        let res = {};

        for(var i in LIST_UNITS) {

            const unit = LIST_UNITS[i];

            if(a[unit] != undefined && b[unit] != undefined) {

                res[unit] = this._add(a[unit], b[unit]);

            } else if(a[unit] != undefined) {

                res[unit] = a[unit];

            } else if(b[unit] != undefined) {

                res[unit] = b[unit];
            }
        }

        return res;
    }

    _NaNToZero(a) {
        if(isNaN(a)) {

            return 0;
        }
        return a;
    }

    _add(a, b) {

        return this._NaNToZero(a) + this._NaNToZero(b);
    }

    makeSum() {

        this._summed = {

            "hrTotalVehicleDistance": this._add(this._a.hrTotalVehicleDistance, this._b.hrTotalVehicleDistance),
            "totalEngineHours": this._add(this._a.hrTotalVehicleDistance, this._b.hrTotalVehicleDistance),
            "engineTotalFuelUsed": this._add(this._a.engineTotalFuelUsed, this._b.engineTotalFuelUsed),
        }

        //handle accumulated

        if(this._a.accumulatedData != undefined && this._b.accumulatedData != undefined) {

            this._summed.accumulatedData = {

                "durationWheelbaseSpeedOverZero": this._add(this._a.accumulatedData.durationWheelbaseSpeedOverZero, this._b.accumulatedData.durationWheelbaseSpeedOverZero),
                "distanceCruiseControlActive": this._add(this._a.accumulatedData.distanceCruiseControlActive, this._b.accumulatedData.distanceCruiseControlActive),
                "durationCruiseControlActive": this._add(this._a.accumulatedData.durationCruiseControlActive, this._b.accumulatedData.durationCruiseControlActive),
                "fuelConsumptionDuringCruiseActive": this._add(this._a.accumulatedData.fuelConsumptionDuringCruiseActive, this._b.accumulatedData.fuelConsumptionDuringCruiseActive),
                "durationWheelbaseSpeedZero": this._add(this._a.accumulatedData.durationWheelbaseSpeedZero, this._b.accumulatedData.durationWheelbaseSpeedZero),
                "fuelWheelbaseSpeedZero": this._add(this._a.accumulatedData.fuelWheelbaseSpeedZero, this._b.accumulatedData.fuelWheelbaseSpeedZero),
                "fuelWheelbaseSpeedOverZero": this._add(this._a.accumulatedData.fuelWheelbaseSpeedOverZero, this._b.accumulatedData.fuelWheelbaseSpeedOverZero)
            };

            if(this._a.accumulatedData.volvoGroupAccumulated != undefined && this._b.accumulatedData.volvoGroupAccumulated != undefined) {

                this._summed.accumulatedData.volvoGroupAccumulated = {

                    "brakeCount": this._add(this._a.accumulatedData.volvoGroupAccumulated.brakeCount, this._b.accumulatedData.volvoGroupAccumulated.brakeCount),
                    "coasting": this._makeSumObj(this._a.accumulatedData.volvoGroupAccumulated.coasting, this._b.accumulatedData.volvoGroupAccumulated.coasting),
                    "engineOverload": this._makeSumObj(this._a.accumulatedData.volvoGroupAccumulated.engineOverload, this._b.accumulatedData.volvoGroupAccumulated.engineOverload),
                    "engineOverrev": this._makeSumObj(this._a.accumulatedData.volvoGroupAccumulated.engineOverrev, this._b.accumulatedData.volvoGroupAccumulated.engineOverrev),
                    "engineWithinGreenArea": this._makeSumObj(this._a.accumulatedData.volvoGroupAccumulated.engineOverload, this._b.accumulatedData.volvoGroupAccumulated.engineOverload),
                    "engineOutOfGreenArea": this._makeSumObj(this._a.accumulatedData.volvoGroupAccumulated.engineOverload, this._b.accumulatedData.volvoGroupAccumulated.engineOverload),
                    "transmissionModeSeconds": [
                        {
                            "label": "AUTO",
                            "value": this._add(this._a.accumulatedData.volvoGroupAccumulated.transmissionModeSeconds[0].value, this._b.accumulatedData.volvoGroupAccumulated.transmissionModeSeconds[0].value)
                        },
                        {
                            "label": "MANUAL",
                            "value": this._add(this._a.accumulatedData.volvoGroupAccumulated.transmissionModeSeconds[1].value, this._b.accumulatedData.volvoGroupAccumulated.transmissionModeSeconds[1].value)
                        },
                        {
                            "label": "POWER",
                            "value": this._add(this._a.accumulatedData.volvoGroupAccumulated.transmissionModeSeconds[2].value, this._b.accumulatedData.volvoGroupAccumulated.transmissionModeSeconds[2].value)
                        }
                    ],
                    "roadOverspeed": this._makeSumObj(this._a.accumulatedData.volvoGroupAccumulated.engineOverload, this._b.accumulatedData.volvoGroupAccumulated.engineOverload),
                    "stopCount": this._add(this._a.accumulatedData.volvoGroupAccumulated.stopCount, this._b.accumulatedData.volvoGroupAccumulated.stopCount),
                    "topGear": this._makeSumObj(this._a.accumulatedData.volvoGroupAccumulated.engineOverload, this._b.accumulatedData.volvoGroupAccumulated.engineOverload),
                    "engineTotalCatalystUsed": this._add(this._a.accumulatedData.volvoGroupAccumulated.engineTotalCatalystUsed, this._b.accumulatedData.volvoGroupAccumulated.engineTotalCatalystUsed),
                    "withoutCatalyst": this._makeSumObj(this._a.accumulatedData.volvoGroupAccumulated.engineOverload, this._b.accumulatedData.volvoGroupAccumulated.engineOverload)
                };

            } else if(this._a.accumulatedData.volvoGroupAccumulated != undefined) {

                this._summed.accumulatedData.volvoGroupAccumulated = this._a.accumulatedData.volvoGroupAccumulated;
            } else if(this._b.accumulatedData.volvoGroupAccumulated != undefined) {

                this._summed.accumulatedData.volvoGroupAccumulated = this._b.accumulatedData.volvoGroupAccumulated;
            }

        } else if(this._a.accumulatedData != undefined) {

            this._summed.accumulatedData = this._a.accumulatedData;

        } else if(this._b.accumulatedData != undefined) {

            this._summed.accumulatedData = this._b.accumulatedData;
        }

    }
}
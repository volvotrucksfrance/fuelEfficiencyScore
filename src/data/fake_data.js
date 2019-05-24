module.exports = {
  "vehicleStatusResponse": {
    "vehicleStatuses": [
      {
        "vin": "ABC12345678901234",
        "triggerType": {
          "triggerType": "IGNITION_ON",
          "context": "RFMS",
          "triggerInfo": [
            "VIN12345678901234"
          ],
          "driverId": {
            "tachoDriverIdentification": {
              "driverIdentification": 12345678901234,
              "cardIssuingMemberState": "S",
              "driverAuthenticationEquipment": "DRIVER_CARD",
              "cardReplacementIndex": 0,
              "cardRenewalIndex": 0
            },
            "oemDriverIdentification": {
              "idType": "USB",
              "oemDriverIdentification": "ABC-123-DEF"
            }
          },
          "ptoId": "string",
          "tellTaleInfo": {
            "tellTale": "FUEL_LEVEL",
            "oemTellTale": "NO_GPS_SIGNAL",
            "state": "YELLOW"
          }
        },
        "createdDateTime": "2019-05-22T07:44:42.800Z",
        "receivedDateTime": "2019-05-22T07:44:42.800Z",
        "hrTotalVehicleDistance": 95055,
        "totalEngineHours": 1234.3,
        "driver1Id": {
          "tachoDriverIdentification": {
            "driverIdentification": 12345678901234,
            "cardIssuingMemberState": "S",
            "driverAuthenticationEquipment": "DRIVER_CARD",
            "cardReplacementIndex": 0,
            "cardRenewalIndex": 0
          },
          "oemDriverIdentification": {
            "idType": "USB",
            "oemDriverIdentification": "ABC-123-DEF"
          }
        },
        "grossCombinationVehicleWeight": 23456,
        "engineTotalFuelUsed": 7890123,
        "status2OfDoors": "ALL_DOORS_DISABLED",
        "doorStatus": [
          {
            "DoorEnabledStatus": "ENABLED",
            "DoorOpenStatus": "CLOSED",
            "DoorLockStatus": "UNLOCKED",
            "DoorNumber": 1
          }
        ],
        "accumulatedData": {
          "durationWheelbaseSpeedOverZero": 123456,
          "distanceCruiseControlActive": 67122,
          "durationCruiseControlActive": 71,
          "fuelConsumptionDuringCruiseActive": 987654,
          "durationWheelbaseSpeedZero": 12345,
          "fuelWheelbaseSpeedZero": 87654,
          "fuelWheelbaseSpeedOverZero": 0,
          "ptoActiveClass": [
            {
              "label": "WHEELBASED_SPEED_OVER_ZERO",
              "seconds": 12345,
              "meters": 2345,
              "milliLitres": 3456
            }
          ],
          "brakePedalCounterSpeedOverZero": 12765,
          "distanceBrakePedalActiveSpeedOverZero": 1456,
          "accelerationPedalPositionClass": [
            {
              "from": 0,
              "to": 20,
              "seconds": 23456,
              "meters": 345678,
              "milliLitres": 678345
            }
          ],
          "accelerationClass": [
            {
              "from": -1.1,
              "to": -0.9,
              "seconds": 23456,
              "meters": 345678,
              "milliLitres": 678345
            }
          ],
          "highAccelerationClass": [
            {
              "from": -3,
              "to": -2.5,
              "seconds": 23456,
              "meters": 345678,
              "milliLitres": 678345
            }
          ],
          "retarderTorqueClass": [
            {
              "from": 0,
              "to": 20,
              "seconds": 23456,
              "meters": 345678,
              "milliLitres": 678345
            }
          ],
          "drivingWithoutTorqueClass": [
            {
              "label": "DRIVING_WITHOUT_TORQUE",
              "seconds": 12345,
              "meters": 2345,
              "milliLitres": 3456
            }
          ],
          "engineTorqueClass": [
            {
              "from": 0,
              "to": 10,
              "seconds": 23456,
              "meters": 345678,
              "milliLitres": 678345
            }
          ],
          "engineTorqueAtCurrentSpeedClass": [
            {
              "from": 0,
              "to": 10,
              "seconds": 23456,
              "meters": 345678,
              "milliLitres": 678345
            }
          ],
          "vehicleSpeedClass": [
            {
              "from": 0,
              "to": 4,
              "seconds": 23456,
              "meters": 345678,
              "milliLitres": 678345
            }
          ],
          "engineSpeedClass": [
            {
              "from": 0,
              "to": 400,
              "seconds": 23456,
              "meters": 345678,
              "milliLitres": 678345
            }
          ],
          "accelerationDuringBrakeClass": [
            {
              "from": -1.1,
              "to": -0.9,
              "seconds": 23456,
              "meters": 345678,
              "milliLitres": 678345
            }
          ],
          "selectedGearClass": [
            {
              "label": 0,
              "seconds": 12345,
              "meters": 2345,
              "milliLitres": 3456
            }
          ],
          "currentGearClass": [
            {
              "label": 0,
              "seconds": 12345,
              "meters": 2345,
              "milliLitres": 3456
            }
          ],
          "chairliftCounter": 568,
          "stopRequestCounter": 4567,
          "kneelingCounter": 976,
          "pramRequestCounter": 123,
          "volvoGroupAccumulated": {
            "brakeCount": 35,
            "coasting": {
              "seconds": 0,
              "meters": 7708,
              "milliLitres": 0
            },
            "engineOverload": {
              "seconds": 0,
              "meters": 13,
              "milliLitres": 0
            },
            "engineOverrev": {
              "seconds": 0,
              "meters": 0,
              "milliLitres": 0
            },
            "engineWithinGreenArea": {
              "seconds": 0,
              "meters": 93,
              "milliLitres": 0
            },
            "engineOutOfGreenArea": {
              "seconds": 0,
              "meters": 6,
              "milliLitres": 0
            },
            "transmissionModeSeconds": [
              {
                "label": "AUTO",
                "value": 94
              },
              {
                "label": "MANUAL",
                "value": 6
              },
              {
                "label": "POWER",
                "value": 0
              }
            ],
            "convoyWeightMeters": [
              {
                "label": "FULL",
                "value": 78901
              }
            ],
            "roadOverspeed": {
              "seconds": 0,
              "meters": 0,
              "milliLitres": 0
            },
            "stopCount": 4,
            "topGear": {
              "seconds": 0,
              "meters": 71,
              "milliLitres": 0
            },
            "engineTotalCatalystUsed": 0,
            "withoutCatalyst": {
              "seconds": 0,
              "meters": 0,
              "milliLitres": 0
            }
          }
        },
        "snapshotData": {
          "gnssPosition": {
            "latitude": 57.71727,
            "longitude": 11.921161,
            "heading": 30,
            "altitude": 32,
            "speed": 54.5,
            "positionDateTime": "2019-05-22T07:44:42.801Z"
          },
          "wheelBasedSpeed": 54.3,
          "tachographSpeed": 54.4,
          "engineSpeed": 1234,
          "fuelLevel1": 86,
          "catalystFuelLevel": 43,
          "driver1WorkingState": "DRIVE",
          "driver2Id": {
            "tachoDriverIdentification": {
              "driverIdentification": 12345678901234,
              "cardIssuingMemberState": "S",
              "driverAuthenticationEquipment": "DRIVER_CARD",
              "cardReplacementIndex": 0,
              "cardRenewalIndex": 0
            },
            "oemDriverIdentification": {
              "idType": "USB",
              "oemDriverIdentification": "ABC-123-DEF"
            }
          },
          "driver2WorkingState": "DRIVE",
          "ambientAirTemperature": 23.7,
          "volvoGroupSnapshot": {
            "cargo": {
              "cargoDefrostOn": true,
              "cargoDoorOpen": true,
              "cargoTemperatures": [
                {
                  "id": 1,
                  "temperature": 3,
                  "alarmOn": false
                }
              ]
            },
            "driver1WaitingTimeToday": 45,
            "driver1WorkingTimeToday": 156,
            "axleWeights": [
              {
                "label": "FRONT",
                "value": 6789
              }
            ],
            "trailerAxleWeight": [
              {
                "label": "FRONT",
                "value": 2345
              }
            ],
            "trailerTotalWeight": 0
          }
        },
        "uptimeData": {
          "tellTaleInfo": [
            {
              "tellTale": "FUEL_LEVEL",
              "oemTellTale": "NO_GPS_SIGNAL",
              "state": "YELLOW"
            }
          ],
          "serviceDistance": 100000,
          "engineCoolantTemperature": 90,
          "serviceBrakeAirPressureCircuit1": 512000,
          "serviceBrakeAirPressureCircuit2": 534000,
          "durationAtLeastOneDoorOpen": 0,
          "alternatorInfo": {
            "alternatorStatus": "CHARGING",
            "alternatorNumber": 1
          },
          "bellowPressureFrontAxleLeft": 234000,
          "bellowPressureFrontAxleRight": 234000,
          "bellowPressureRearAxleLeft": 234000,
          "bellowPressureRearAxleRight": 234000
        }
      }
    ]
  },
  "moreDataAvailable": true,
  "requestServerDateTime": "2019-05-22T07:44:42.801Z"
}
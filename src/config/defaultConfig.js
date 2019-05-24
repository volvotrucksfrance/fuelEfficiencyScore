module.exports = {
    anticipation_and_braking: {
        group_weight: 45,
        coasting: 60,
        braking: 40
    },
    engine_and_gear_utilisation: {
        group_weight: 35,
        i_shift_auto: 15,
        i_shift_manuel: 0.7,
        i_shift_power: 22.85,
        top_gear: 0.7,
        withing_eco: 10,
        out_eco: 25,
        overrev: 0.7,
        engine_load: 25
    },
    speed_adaption: {
        group_weight: 13,
        fleet_overspeed: 30,
        cruise_control: 70
    },
    stand_still: {
        group_weight: 7,
        idling: 100
    }
};
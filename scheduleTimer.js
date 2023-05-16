function scheduleTimer({
    providerRes,
    parserRes
} = {}) {
    return {
        totalWeek: 20,
        startWithSunday: false,
        showWeekend: false,
        forenoon: 4,
        afternoon: 4,
        night: 3,
        sections: [
            {
                section: 1,
                startTime: '08:00',
                endTime: '08:50',
            },
            {
                section: 2,
                startTime: '09:00',
                endTime: '09:50',
            },
            {
                section: 3,
                startTime: '10:10',
                endTime: '11:00',
            },
            {
                section: 4,
                startTime: '11:10',
                endTime: '12:00',
            },
            {
                section: 5,
                startTime: '14:00',
                endTime: '14:50',
            },
            {
                section: 6,
                startTime: '15:00',
                endTime: '15:50',
            },
            {
                section: 7,
                startTime: '16:10',
                endTime: '17:00',
            },
            {
                section: 8,
                startTime: '17:10',
                endTime: '18:00',
            },
            {
                section: 9,
                startTime: '18:30',
                endTime: '19:20',
            },
            {
                section: 10,
                startTime: '19:30',
                endTime: '20:20',
            },
            {
                section: 11,
                startTime: '20:40',
                endTime: '21:30',
            }
        ]
    }
}
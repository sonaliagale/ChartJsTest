const tooltipLink = "http://google.com";

let chartData =
{
    "aggregates": [
        {
            "label": "Sent Emails",
            totals: [
                {
                    date: "2023-01-01T00:00:00.000+08:00",
                    count: 5,
                    details: [{ time: '10am', fullName: 'AB', fileName: 'fileName' },
                    { time: '7am', fullName: 'DJ', fileName: 'fileName' },
                    { time: '8am', fullName: 'CD', fileName: 'fileName' }]
                },
                {
                    date: "2023-03-23T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '11am', fullName: 'CD', fileName: 'fileName' }, { time: '8am', fullName: 'DD', fileName: 'fileName' }]
                },
                {
                    date: "2023-05-22T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '12am', fullName: 'EF', fileName: 'fileName' }, { time: '9am', fullName: 'SS', fileName: 'fileName' }]
                },
            ]
        },
        {
            "label": "Mettings",
            totals: [
                {
                    date: "2023-04-04T00:00:00.000+08:00",
                    count: 5,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-05-06T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-06-23T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
            ]
        },
        {
            "label": "Comments",
            totals: [
                {
                    date: "2023-04-03T00:00:00.000+08:00",
                    count: 5,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-03-23T00:00:00.000+08:00",
                    count: 3,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-04-22T00:00:00.000+08:00",
                    count: 2,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
            ]
        },
        {
            "label": "Views",
            totals: [
                {
                    date: "2023-01-01T00:00:00.000+08:00",
                    count: 7,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-03-23T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-04-22T00:00:00.000+08:00",
                    count: 2,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
            ]
        },
        {
            "label": "Download",
            totals: [
                {
                    date: "2023-01-03T00:00:00.000+08:00",
                    count: 7,
                    details: [{ time: '10am', fullName: 'Pooja ', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-03-15T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'sonali', fileName: 'fileName' }]
                },
                {
                    date: "2023-04-18T00:00:00.000+08:00",
                    count: 2,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
            ]
        },
    ]
}


let chartData2 =
{
    "aggregates": [
        {
            "label": "Sent Emails",
            totals: [
                {
                    date: "2023-07-01",
                    count: 5,
                    details: [{ time: '10am', fullName: 'AB', fileName: 'fileName' }, { time: '7am', fullName: 'DJ', fileName: 'fileName' }]
                },
                {
                    date: "2023-10-23",
                    count: 5,
                    details: [{ time: '11am', fullName: 'CD', fileName: 'fileName' }, { time: '8am', fullName: 'DD', fileName: 'fileName' }]
                },
                {
                    date: "2023-09-22",
                    count: 5,
                    details: [{ time: '12am', fullName: 'EF', fileName: 'fileName' }, { time: '9am', fullName: 'SS', fileName: 'fileName' }]
                },
            ]
        },
        {
            "label": "Mettings",
            totals: [
                {
                    date: "2023-11-04T00:00:00.000+08:00",
                    count: 5,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-07-06T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-10-23T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
            ]
        },
        {
            "label": "Comments",
            totals: [
                {
                    date: "2023-08-03T00:00:00.000+08:00",
                    count: 5,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-11-23T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-08-22T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
            ]
        },
        {
            "label": "Views",
            totals: [
                {
                    date: "2023-07-01T00:00:00.000+08:00",
                    count: 5,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-09-23T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
                {
                    date: "2023-08-22T00:00:00.000+08:00",
                    count: 4,
                    details: [{ time: '10am', fullName: 'FLName', fileName: 'fileName' }, { time: '12am', fullName: 'FLName', fileName: 'fileName' }]
                },
            ]
        }
    ]
}

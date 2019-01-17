// 表头
const columns0 = [{
        type: "selection",
        width: 60,
        align: "center"
    },
    {
        title: "Handle",
        align: "center",
        renderTip: "edit-ok&cancel"
    },
    {
        title: "Seq.",
        align: "center",
        width: 70,
        renderTip: "seq"
    },
    {
        title: "Name",
        key: "configName",
        renderTip: "input"
    },
    {
        title: "Description",
        key: "configDesc",
        renderTip: "input"
    },
    {
        title: "Commodity Usage",
        key: "ccConfigId",
        renderTip: "selection"
    },
    {
        title: "Status",
        key: "configStatus",
        align: "center",
        renderTip: "checkbox"
    },
    {
        title: "Def.By",
        key: "defUserName",
        renderTip: "input"
    },
    {
        title: "Def.at",
        key: "defDt",
        width: 170,
        renderTip: "date"
    },
    {
        title: "Upd.by",
        key: "updUserName",
        renderTip: "input"
    },
    {
        title: "Upd.at",
        key: "updDt",
        width: 170,
        renderTip: "date"
    },
]
const columns1 = [{
            type: "selection",
            width: 60,
            align: "center"
        },
        {
            title: "Handle",
            align: "center",
            renderTip: "edit-ok&cancel"
        },
        {
            title: "Seq.",
            align: "center",
            width: 70,
            key: "sortNumber",
            renderTip: "input"
        },
        {
            title: "Name",
            key: "configName",
            renderTip: "input"
        },
        {
            title: "Description",
            key: "configDesc",
            renderTip: "input"
        },
        {
            title: "Status",
            key: "configStatus",
            align: "center",
            renderTip: "checkbox"
        },
        {
            title: "Def.By",
            key: "defUserName",
            renderTip: "input"
        },
        {
            title: "Def.at",
            key: "defDt",
            width: 170,
            renderTip: "date"
        },
        {
            title: "Upd.by",
            key: "defUserName",
            renderTip: "input"
        },
        {
            title: "Upad.at",
            key: "defDt",
            width: 170,
            renderTip: "date"
        },
    ]
    // 表头
const columns2 = [{
        type: "selection",
        width: 60,
        align: "center"
    },
    {
        title: "Handle",
        align: "center",
        renderTip: "edit-ok&cancel"
    },
    {
        title: "Seq.",
        align: "center",
        width: 70,
        key: "sortNumber",
        renderTip: "input"
    },
    {
        title: "Name",
        key: "configName",
        renderTip: "input"
    },
    {
        title: "Description",
        key: "configDesc",
        renderTip: "input"
    },
    {
        title: "Measurement System",
        key: "measutrmentSystem",
        renderTip: "selection"
    },
    {
        title: "Status",
        key: "configStatus",
        align: "center",
        renderTip: "checkbox"
    },
    {
        title: "Def.By",
        key: "defUserName",
        renderTip: "input"
    },
    {
        title: "Def.at",
        key: "defDt",
        width: 170,
        renderTip: "date"
    },
]
export {
    columns0,
    columns1,
    columns2,
}
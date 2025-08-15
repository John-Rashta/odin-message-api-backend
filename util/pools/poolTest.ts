import prisma from "../../config/client";

const testIcons = [
    {source: "sadas"},
    {source: "dddd"},
    {source: "hhhh"},
    {source: "VVVL"}
];

const poolIcons = async function poolTestDatabaseIcons() {
    await prisma.icons.createMany({
        data: [
            {source: testIcons[0].source},
            {source: testIcons[1].source},
            {source: testIcons[2].source},
            {source: testIcons[3].source},
        ]
    });
};

poolIcons();
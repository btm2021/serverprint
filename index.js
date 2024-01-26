const PubNub = require('pubnub');
const uuid = PubNub.generateUUID();
const pubnub = new PubNub({
    publishKey: "pub-c-2ecffcb0-ec4c-44c3-a88a-6f19b13057c3",
    subscribeKey: "sub-c-1db3ee38-8f0e-11eb-968e-467c259650fa",
    uuid: uuid
});
const { exec } = require('child_process');
const { createClient } = require('@supabase/supabase-js')
const r = 'https://ajsrzteoovahabndebyp.supabase.co';
const k = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqc3J6dGVvb3ZhaGFibmRlYnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2ODYyNTgsImV4cCI6MjAyMDI2MjI1OH0.TcA527gIcm_6HmaYgK28l3vIrHKbqc0TrI_GEBdw8sc';

const supabase = createClient(r, k);

const { printTable } = require('console-table-printer');

const moment = require('moment');
const { resolve } = require('path');
const pathCSV_sanpham = `C:\\datatem\\dulieu_sanpham.csv`
const pathCSV_dothe = `C:\\datatem\\dulieu_dothe.csv`

const pathTemplate_sanpham = `C:\\datatem\\mautem_sanpham.csv`
const pathTemplate_dothe = `C:\\datatem\\mautem_dothe.csv`

console.log(`=============BAT DAU SERVER IN TEM=================`)
console.log('=               Máy chủ pubnub                    =')
console.log('=subKey:sub-c-1db3ee38-8f0e-11eb-968e-467c259650fa=')
console.log('=pubKey:pub-c-2ecffcb0-ec4c-44c3-a88a-6f19b13057c3=')
console.log(`===================================================`)
fs = require('fs');
pubnub.addListener({
    message: function (message) {
        let action = message.message.type
        let mautem = message.message.mautem
        if (action === 'thaydoigia') {
            console.log(message)
        }
        if (action === "intem") {
            console.log(`[${moment().format('DD/MM/YYYY - hh:mm:ss')}]* Task : In Tem Sản Phẩm , mẫu tem : ${pathTemplate_sanpham}`)
            let listSp = message.message.list
            console.log(`[${moment().format('DD/MM/YYYY - hh:mm:ss')}]* Số lượng tem in ${listSp.length}`)
            console.log(`[${moment().format('DD/MM/YYYY - hh:mm:ss')}]* Danh sách :`)
            let result = json2csv(listSp, option, ",")
            printTable(listSp.map((item, index) => {
                return {
                    stt: index + 1,
                    'Mã Vạch': item.product_barcode,
                    'Trọng Lượng Tổng': formatSoVang(item.product_total_weight).fullStr,
                    'Trọng Lượng Hột': formatSoVang(item.product_stone_weight).fullStr,
                    'Trọng Lượng Vàng': formatSoVang(item.product_gold_weight).fullStr,
                    'Tiền Công': item.product_wage,
                    'Chành': item.product_import_type ? 'Cty' : 'Nội Bộ',
                }
            }));


            writeCsv('./dulieu_sanpham.csv', result).then(data => {
                if (data) {
                    console.log(`[${moment().format('DD/MM/YYYY - hh:mm:ss')}]* Bắt đầu chạy bartender cli theo mẫu template và data`)
                    console.log(`[${moment().format('DD/MM/YYYY - hh:mm:ss')}]* Task Done`)
                    console.log(`============================`)
                } else {
                    console.log(`Lỗi ở bước ghi`)
                }
            })
        }
        if (action === "ingiaythe") {

        }


    },
    presence: function (presenceEvent) {
        //   console.log(presenceEvent);
    }
})

pubnub.subscribe({
    channels: ["printserver"],
    withPresence: true,
});

function writeCsv(path, result) {
    console.log(`* Bắt đầu ghi vào file ${path}`)

    return new Promise((resolve, reject) => {
        fs.writeFile(path, result, (err, data) => {
            if (err) {

                console.log(`[${moment().format('DD/MM/YYYY - hh:mm:ss')}]* Ghi file ${pathCSV_sanpham} thất bại`)

                resolve(false)

            } else {
                console.log(`[${moment().format('DD/MM/YYYY - hh:mm:ss')}]* Ghi file ${path} thành công`)

                resolve(true)
            }

        })
    })

}

const product_catalog = [
    {
        name: 'NC',
        fullName: 'Nhẫn Cưới'
    },
    { text: "NHẪN NỮ", value: "NT" },
    { text: "NHẪN CƯỚI", value: "NC" },
    { text: "NHẪN NAM", value: "NN" },
    { text: "BÔNG LỚN", value: "BL" },
    { text: "BÔNG EM BÉ", value: "BE" },
    { text: "DÂY LỚN", value: "DL" },
    { text: "DÂY EM BÉ", value: "DE" },
    { text: "MẶT", value: "MD" },
    { text: "VÒNG TRƠN", value: "VT" },
    { text: "VÒNG KIỂU", value: "VK" },
    { text: "VÒNG EM BÉ", value: "VE" },
    { text: "LẮC LỚN", value: "LL" },
    { text: "LẮC EM BÉ", value: "LE" },
    { text: "KIỀNG 18K", value: "KT" },
    { text: "KIỀNG CƯỚI", value: "KC" },
    { text: "XIMEN", value: "XM" },
    { text: "KHÁC", value: "KK" },

]
const option = [
    {
        keyJSON: 'product_catalog', headerName: 'ten',
        formatter: (item) => {
            let fullName = product_catalog.find(x => x.value === item.product_catalog);

            return fullName.text
        }
    },
    {
        keyJSON: 'product_total_weight', headerName: 'klt',
        formatter: (item) => {
            return formatSoVang(item.product_total_weight).fullStr
        }
    },
    {
        keyJSON: 'product_gold_weight', headerName: 'klv',
        formatter: (item) => {
            return formatSoVang(item.product_gold_weight).fullStr
        }
    },
    {
        keyJSON: 'product_stone_weight', headerName: 'klh',
        formatter: (item) => {
            return formatSoVang(item.product_stone_weight).fullStr
        }
    },
    {
        keyJSON: 'product_wage', headerName: 'c'
    },

    {
        keyJSON: 'product_import_type', headerName: 'cty',
        formatter: (item) => {
            return item.product_import_type ? 'Cty' : 'Nội Bộ'
        }
    },
    {
        keyJSON: 'product_barcode', headerName: 'mavach',

    },
    {
        keyJSON: 'product_type', headerName: 'loaivang',

    },

]

function json2csv(jsonFile, options, delimiter = ',') {
    // Thêm 'index' vào tiêu đề
    const headers = ['index'].concat(options.map(opt => opt.headerName)).join(delimiter);

    // Tạo từng dòng dữ liệu, bao gồm cả index
    const rows = jsonFile.map((item, index) => {
        // Tạo mảng dữ liệu từ các option, bắt đầu bằng index
        const data = [index + 1].concat(options.map(opt => {
            // Áp dụng hàm formatter nếu có, ngược lại lấy giá trị trực tiếp từ jsonFile
            return opt.formatter ? opt.formatter(item) : item[opt.keyJSON];
        }));

        return data.join(delimiter);
    }).join('\n');

    // Kết hợp tiêu đề và dữ liệu
    return headers + '\n' + rows;
}
function formatSoVang(t) {
    if (0 == t || null == t || null == t)
        return {
            fullStr: 0,
            raw: 0
        };
    var e = String(t);
    let fullStr = t >= 1e4 ? e.toString().replace(/\B(?=(\d{4})+(?!\d))/g, "L") : 1e3 <= t && t < 1e4 ? e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "c") : 100 <= t < 1e3 ? e.toString().replace(/\B(?=(\d{2})+(?!\d))/g, "p") : void 0
    let objectFormat = {
        fullStr,
        raw: parseInt(t)
    }
    return objectFormat
}
async function updateStatusInTem(list) {
    return new Promise((resolve, reject) => {

    })
}
async function fetchData() {
    // Thay 'your_table' bằng tên bảng của bạn
    exec('ls', (error, stdout, stderr) => {
        console.log(stdout)
    })
}
async function deleteFile_csv(fileName) {
    return new Promise((resolve, reject) => {

    })
}
fetchData()
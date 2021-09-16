const puppeteer = require('puppeteer')
const expres = require('express')

const app = expres()

const port = process.env.PORT || 3000

const url = 'https://vnexpress.net/covid-19/covid-19-viet-nam'

const solieu = async (req, res) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })

    let nhiem = await page.evaluate(() => {
        return document.querySelector('div.block-data-vietnam > div.block-count-vietnam > div.item-nhiem').innerText
    })
    nhiem = nhiem.split('\n')
    nhiem.shift()

    let khoi = await page.evaluate(() => {
        return document.querySelector('div.block-data-vietnam > div.block-count-vietnam > div.item-khoi').innerText
    })
    khoi = khoi.split('\n')
    khoi.shift()

    let tuvong = await page.evaluate(() => {
        return document.querySelector('div.block-data-vietnam > div.block-count-vietnam > div.item-tuvong').innerText
    })
    tuvong = tuvong.split('\n')
    tuvong.shift()

    const tong = { nhiem: nhiem[0], khoi: khoi[0], tuvong: tuvong[0] }
    const homNay = { nhiem: nhiem[1].slice(17), khoi: khoi[1].slice(17), tuvong: tuvong[1].slice(17) }
    const covid = {
        covidVN: {
            tong,
            homNay
        }
    }

    res.json(covid)

    await browser.close()
}

app.get('/', (req, res) => {
    solieu(req, res)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
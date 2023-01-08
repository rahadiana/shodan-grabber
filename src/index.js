"use strict";

const ShodanGrabber = function (query) {
    return new Promise(async (resolve) => {

        const {ResponseHandler} = require('@rahadiana/node_response_standard')
        const puppeteer = require('puppeteer-extra')
        const StealthPlugin = require('puppeteer-extra-plugin-stealth')
        puppeteer.use(StealthPlugin())

        const browser = await puppeteer.launch(
            {headless: false, defaultViewport: null}
        );
        const page = await browser.newPage();
        try {
            const Selector = '//*[@id="search-query"]'
            const IpFound = '/html/body/div[3]/div/div[2]/div/div[2]/a[1]'

            await page.goto('https://www.shodan.io/', {
                waitUntil: 'networkidle2',
                timeout: 7000
            })

            await page.waitForXPath(`${Selector}`)

            await page.evaluate((text) => {
                (document.getElementById('search-query')).value = text;
            }, query);

            await page
                .keyboard
                .press('Enter');

            await page.waitForNavigation({waitUntil: 'networkidle2'});

            await page.waitForTimeout(2000)

            await page.waitForXPath(`${IpFound}`, {timeout: 7000})

            const loop = (await page.$x(`${IpFound}`)).length

            async function Infoname(val) {

                const [getXpath] = await page.$x(
                    `/html/body/div[3]/div/div[2]/div[${val}]/div[2]`
                );
                const getMsg = await page.evaluate(name => name.innerText, getXpath);

                return getMsg

            }

            async function Infodesc(val) {

                const [getXpath] = await page.$x(
                    `/html/body/div[3]/div/div[2]/div[${val}]/div[3]/div`
                );
                const getMsg = await page.evaluate(name => name.innerText, getXpath);

                return getMsg

            }

            async function InfoFoundAt(val) {

                const [getXpath] = await page.$x(
                    `/html/body/div[3]/div/div[2]/div[${val}]/div[1]`
                );
                const getMsg = await page.evaluate(name => name.innerText, getXpath);

                return getMsg

            }

            async function InfoIp(val) {
                try {
                    const [getXpath] = await page.$x(
                        `/html/body/div[3]/div/div[2]/div[${val}]/div[2]/a[3]`
                    )

                    const getMsg = await page.evaluate(name => name.href, getXpath)

                    return getMsg
                } catch (err) {
                    const GetInfoName = await Infoname(val)
                    return GetInfoName;
                }
            }

            async function poreach(l) {
                var str = []
                for (let i = 3; i < l + 3; i += 1) {

                    str.push(
                        {name: await Infoname(i), url: await InfoIp(i), desc: await Infodesc(i), found_at: await InfoFoundAt(i)}
                    );
                }
                return resolve(ResponseHandler(200, str, 'success get data'))
            }

            if (loop > 0) {
                await poreach(loop)
            }

            await browser.close()

        } catch (err) {
            const elHandleText = await page.evaluate(
                el => el.innerText,
                (await page.$x("/html/body/div[3]/p"))[0]
            )
            await browser.close()
            return resolve(ResponseHandler(500, '', elHandleText))
        } finally {
            await browser.close()
            return resolve(ResponseHandler(500, '', 'error'))
        }
    })
}

module.exports = {
    ShodanGrabber
}
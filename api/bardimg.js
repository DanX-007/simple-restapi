const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const { Headers } = require('undici');
const fakeUseragent = require('fake-useragent');

const router = express.Router();

// Helper functions
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateRandomIP = () => {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
};

const generateRandomUserAgent = () => {
    const androidVersions = ['4.0.3', '4.1.1', '4.2.2', '4.3', '4.4', '5.0.2', '5.1', '6.0', '7.0', '8.0', '9.0', '10.0', '11.0'];
    const deviceModels = ['M2004J19C', 'S2020X3', 'Xiaomi4S', 'RedmiNote9', 'SamsungS21', 'GooglePixel5'];
    const buildVersions = ['RP1A.200720.011', 'RP1A.210505.003', 'RP1A.210812.016', 'QKQ1.200114.002', 'RQ2A.210505.003'];
    const selectedModel = deviceModels[Math.floor(Math.random() * deviceModels.length)];
    const selectedBuild = buildVersions[Math.floor(Math.random() * buildVersions.length)];
    const chromeVersion = `Chrome/${Math.floor(Math.random() * 80) + 1}.${Math.floor(Math.random() * 999) + 1}.${Math.floor(Math.random() * 9999) + 1}`;
    return `Mozilla/5.0 (Linux; Android ${androidVersions[Math.floor(Math.random() * androidVersions.length)]}; ${selectedModel} Build/${selectedBuild}) AppleWebKit/537.36 (KHTML, like Gecko) ${chromeVersion} Mobile Safari/537.36 WhatsApp/1.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}`;
};

const getValidIPv4 = (ip) => {
    const match = !ip || ip.match(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))?$/);
    if (match) {
        if (match[5]) {
            const mask = parseInt(match[5], 10);
            let [a, b, c, d] = ip.split('.').map(x => parseInt(x, 10));
            const max = (1 << (32 - mask)) - 1;
            const rand = Math.floor(Math.random() * max);
            d += rand;
            c += Math.floor(d / 256);
            d %= 256;
            b += Math.floor(c / 256);
            c %= 256;
            a += Math.floor(b / 256);
            b %= 256;
            return `${a}.${b}.${c}.${d}`;
        }
        return ip;
    }
    return undefined;
};

class BingImageCreator {
    static HEADERS = {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        referrer: "https://www.bing.com/images/create/",
        origin: "https://www.bing.com",
        "user-agent": fakeUseragent() || generateRandomUserAgent(),
        "x-forwarded-for": getValidIPv4(generateRandomIP()) || generateRandomIP()
    };

    constructor(cookie) {
        this._cookie = `_U=${cookie}`;

        if (!this._cookie) {
            throw new Error("Bing cookie is required");
        }
    }

    async fetchRedirectUrl(url, formData) {
        const headers = new Headers({
            cookie: this._cookie,
            ...BingImageCreator.HEADERS,
        });

        const response = await axios.post(url, formData, {
            headers: Object.fromEntries(headers),
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400
        }).catch(error => {
            if (error.response && error.response.status >= 300 && error.response.status < 400) {
                return error.response;
            }
            throw error;
        });

        if (response.status >= 200 && response.status < 300) {
            throw new Error("Request failed");
        } else {
            const redirect_url = response.headers.location.replace("&nfy=1", "");
            const request_id = redirect_url.split("id=")[1];
            return {
                redirect_url,
                request_id,
            };
        }
    }

    async getCredits() {
        const response = await axios.get("https://www.bing.com/create", {
            headers: {
                cookie: this._cookie,
                ...BingImageCreator.HEADERS,
            }
        });
        const $ = cheerio.load(response.data);
        return $('#token_bal').text();
    }

    async fetchResult(encodedPrompt, redirect_url, request_id) {
        const cookie = this._cookie;
        try {
            await axios.get(`https://www.bing.com${redirect_url}`, {
                headers: {
                    cookie,
                    ...BingImageCreator.HEADERS,
                },
            });
        } catch (e) {
            throw new Error(`Request redirect_url failed: ${e.message}`);
        }

        const getResultUrl = `https://www.bing.com/images/create/async/results/${request_id}?q=${encodedPrompt}`;
        const start_wait = Date.now();
        let result = "";
        while (true) {
            if (Date.now() - start_wait > 800000) {
                throw new Error("Timeout");
            }

            await sleep(1000);
            result = await this.getResults(getResultUrl);
            if (result) {
                break;
            }
        }
        return this.parseResult(result);
    }

    async getResults(getResultUrl) {
        const response = await axios.get(getResultUrl, {
            headers: {
                cookie: this._cookie,
                ...BingImageCreator.HEADERS,
            },
            validateStatus: () => true
        });
        
        if (response.status !== 200) {
            throw new Error("Bad status code");
        }
        
        const content = response.data;
        if (!content || content.includes("errorMessage")) {
            return null;
        } else {
            return content;
        }
    }

    parseResult(result) {
        const regex = /src="([^"]*)"/g;
        const matches = [...result.matchAll(regex)].map((match) => match[1]);
        const normal_image_links = matches.map((link) => link.split("?w=")[0]);
        const safe_image_links = normal_image_links.filter((link) => !/r.bing.com\/rp/i.test(link));
        safe_image_links.length !== normal_image_links.length && console.log("Detected & Removed bad images");
        const unique_image_links = [...new Set(safe_image_links)];
        if (unique_image_links.length === 0) {
            throw new Error("error_no_images");
        }
        return unique_image_links;
    }

    async fetchRedirectUrlWithRetry(url, formData, retries = 30) {
        for (let i = 0; i < retries; i++) {
            try {
                return await this.fetchRedirectUrl(url, formData);
            } catch (error) {
                console.log(`retry ${i + 1} time`);
                if (i === retries - 1) {
                    throw new Error(`Max retries reached: ${error.message}`);
                }
            }
        }
    }

    async fetchResultWithRetry(encodedPrompt, redirect_url, request_id, retries = 30) {
        for (let i = 0; i < retries; i++) {
            try {
                return await this.fetchResult(encodedPrompt, redirect_url, request_id);
            } catch (error) {
                console.log(`retry ${i + 1} time`);
                if (i === retries - 1) {
                    throw new Error(`Max retries reached: ${error.message}`);
                }
            }
        }
    }

    async createImage(prompt) {
        const encodedPrompt = encodeURIComponent(prompt);
        const formData = new URLSearchParams();
        formData.append("q", encodedPrompt);
        formData.append("qa", "ds");
        
        const url = `https://www.bing.com/images/create?q=${encodedPrompt}&rt=8&FORM=GENCRE`;

        try {
            const { redirect_url, request_id } = await this.fetchRedirectUrlWithRetry(url, formData);
            return await this.fetchResultWithRetry(encodedPrompt, redirect_url, request_id);
        } catch (e) {
            console.log("retry 1 time");
            const res = await this.fetchRedirectUrlWithRetry(url, formData);
            return await this.fetchResultWithRetry(encodedPrompt, res.redirect_url, res.request_id);
        }
    }
}

// API Endpoints
router.get('/create', async (req, res) => {
    const { prompt } = req.query;
    const cookie = `154.201.58.41:3128|bypass=1; cf_clearance=ka_2gY5YzNy.hRa7IR5YNuNxvnN6uOvMgg.kvd2oAVQ-1694890828-0-1-735201e3.bc6a1dee.24535e03-250.0.0; cf_chl_2=27cbc156255b1de|Mozilla/5.0 (Linux; Android 10; LM-Q710(FGN)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.166 Mobile Safari/537.36`
    if (!prompt) {
        return res.status(400).json({ 
            status: 400, 
            error: 'Parameters "prompt" are required' 
        });
    }

    try {
        const bing = new BingImageCreator(cookie);
        const images = await bing.createImage(prompt);
        res.json({ 
            status: 200, 
            model: "Bing Image Creator",
            images 
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
});

router.get('/credits', async (req, res) => {
    const { cookie } = req.query;

    if (!cookie) {
        return res.status(400).json({ 
            status: 400, 
            error: 'Parameter "cookie" is required' 
        });
    }

    try {
        const bing = new BingImageCreator(cookie);
        const credits = await bing.getCredits();
        res.json({ 
            status: 200, 
            credits 
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message
        });
    }
});



module.exports = router;
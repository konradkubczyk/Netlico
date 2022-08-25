const SiteData = require("../schema/site");

class Site {
    #id;
    #owners;
    #tier;
    #title;
    #description;
    #subdomain;
    #isPublished;
    #customDomain;
    #pages;

    constructor(siteId) {
        this.#id = siteId;
    }

    async loadData() {
        const siteData = await SiteData.findById(this.id);
        this.#owners = siteData.owners;
        this.#tier = siteData.tier;
        this.#title = siteData.title;
        this.#description = siteData.description;
        this.#subdomain = siteData.subdomain;
        this.#isPublished = siteData.isPublished;
        this.#customDomain = siteData.customDomain;
        this.#pages = siteData.pages;
    }

    get id() {
        return this.#id;
    }

    get owners() {
        if (typeof this.#owners !== 'undefined') {
            return this.#owners;
        }
        return (async () => {
            await this.loadData();
            return this.#owners;
        })();
    }

    get tier() {
        if (typeof this.#tier !== 'undefined') {
            return this.#tier;
        }
        return (async () => {
            await this.loadData();
            return this.#tier;
        })();
    }

    get title() {
        if (typeof this.#title !== 'undefined') {
            return this.#title;
        }
        return (async () => {
            await this.loadData();
            return this.#title;
        })();
    }

    get description() {
        if (typeof this.#description !== 'undefined') {
            return this.#description;
        }
        return (async () => {
            await this.loadData();
            return this.#description;
        })();
    }

    get subdomain() {
        if (typeof this.#subdomain !== 'undefined') {
            return this.#subdomain;
        }
        return (async () => {
            await this.loadData();
            return this.#subdomain;
        })();
    }

    get isPublished() {
        if (typeof this.#isPublished !== 'undefined') {
            return this.#isPublished;
        }
        return (async () => {
            await this.loadData();
            return this.#isPublished;
        })();
    }

    get customDomain() {
        if (typeof this.#customDomain !== 'undefined') {
            return this.#customDomain;
        }
        return (async () => {
            await this.loadData();
            return this.#customDomain;
        })();
    }

    get pages() {
        if (typeof this.#pages !== 'undefined') {
            return this.#pages;
        }
        return (async () => {
            await this.loadData();
            return this.#pages;
        })();
    }
}

module.exports = Site;
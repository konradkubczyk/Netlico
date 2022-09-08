const SiteData = require("../schema/site");
const Page = require('./page');

class Site {
    #id;
    #owners;
    #tier;
    #language;
    #title;
    #description;
    #theme;
    #subdomain;
    #isPublished;
    #customDomain;
    #pages;

    /**
     * Creates a new site in database
     * 
     */
    static async create(ownerId){
        const siteData = new SiteData();
        siteData.owners = [ownerId];
        await siteData.save();
        const site = new Site(siteData._id);
        await site.read();
        site.createPage();
        return site;
    }

    constructor(siteId) {
        this.#id = siteId;
    }

    /**
     * Loads all properties of the object from database based on its id
     */
    async read() {
        const siteData = await SiteData.findById(this.#id);
        this.#owners = siteData.owners;
        this.#tier = siteData.tier;
        this.#language = siteData.language;
        this.#title = siteData.title;
        this.#description = siteData.description;
        this.#theme = siteData.theme;
        this.#subdomain = siteData.subdomain;
        this.#isPublished = siteData.isPublished;
        this.#customDomain = siteData.customDomain;
        this.#pages = siteData.pages;
    }

    /**
     * Updates the site's data in database
     */
    async update() {
        for (const property in this) {
            if (property.startsWith('#') && property !== '#id') {
                await this.updateProperty(property.substring(1), this[property]);
            }
        }
    }

    /**
     * Updates given property of the object in database
     */
    async updateProperty(property, value) {
        const siteData = await SiteData.findById(this.#id);
        siteData[property] = value;
        await siteData.save();
    }

    /**
     * Deletes the site and all its pages from database
     */
    async delete() {
        await SiteData.findByIdAndDelete(this.#id);
        
        // Delete all pages associated with the site
        for (const pageId of this.#pages) {
            const page = new Page(pageId);
            await page.delete();
        }
    }

    /**
     * Creates a new page and adds it to the list of pages associated with the site
     */
    async createPage() {
        const page = await Page.create(this.#id);
        this.#pages.push(page.id);
        await this.updateProperty('pages', this.#pages);
    }

    /**
     * Deletes a page and removes it from the list of pages associated with the site
     */
    async deletePage(pageId) {
        const page = new Page(pageId);
        await page.delete();
        this.#pages = this.#pages.filter(id => id !== pageId);
        await this.updateProperty('pages', this.#pages);
    }

    get id() { return this.#id; }
    get owners() { return this.#owners; }
    get tier() { return this.#tier; }
    get language() { return this.#language; }
    get title() { return this.#title; }
    get description() { return this.#description; }
    get theme() { return this.#theme; }
    get subdomain() { return this.#subdomain; }
    get isPublished() { return this.#isPublished; }
    get customDomain() { return this.#customDomain; }
    get pages() { return this.#pages; }

    set owners(owners) {
        this.#owners = owners;
        return (async () => {
            await this.updateProperty('owners', owners);
        });
    }

    set tier(tier) {
        this.#tier = tier;
        return (async () => {
            await this.updateProperty('tier', tier);
        });
    }

    set language(language) {
        this.#language = language;
        return (async () => {
            await this.updateProperty('language', language);
        });
    }

    set title(title) {
        this.#title = title;
        return (async () => {
            await this.updateProperty('title', title);
        });
    }

    set description(description) {
        this.#description = description;
        return (async () => {
            await this.updateProperty('description', description);
        });
    }

    set theme(theme) {
        this.#theme = theme;
        return (async () => {
            await this.updateProperty('theme', theme);
        });
    }

    set subdomain(subdomain) {
        this.#subdomain = subdomain;
        return (async () => {
            await this.updateProperty('subdomain', subdomain);
        });
    }

    set isPublished(isPublished) {
        this.#isPublished = isPublished;
        return (async () => {
            await this.updateProperty('isPublished', isPublished);
        });
    }

    set customDomain(customDomain) {
        this.#customDomain = customDomain;
        return (async () => {
            await this.updateProperty('customDomain', customDomain);
        });
    }

    set pages(pages) {
        this.#pages = pages;
        return (async () => {
            await this.updateProperty('pages', pages);
        });
    }
}

module.exports = Site;
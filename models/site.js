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

    /**
     * Find a site by its subdomain
     * @param {string} subdomain Subdomain of the site to be found
     * @returns {Site} Site object with properties already loaded from database
     */
    static async findBySubdomain(subdomain) {
        const siteData = await SiteData.findOne({ subdomain: subdomain });
        if (siteData) {
            const site = new Site(siteData._id);
            await site.read();
            return site;
        } else {
            return null;
        }
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
        try {
            const siteData = await SiteData.findById(this.#id);
            siteData[property] = value;
            await siteData.save();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Deletes the site and all its pages from database
     */
    async delete() {
        await this.read();
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
        await this.read();
        const page = await Page.create(this.#id);
        this.#pages.push(page.id);
        await this.updateProperty('pages', this.#pages);
    }

    /**
     * Deletes a page and removes it from the list of pages associated with the site
     * @param {string} pageId Id of the page to be deleted
     */
    async deletePage(pageId) {
        await this.read();
        if (this.#pages.includes(pageId)) {
            const page = new Page(pageId);
            await page.delete();
            this.#pages = this.#pages.filter(id => id != pageId);
            await this.updateProperty('pages', this.#pages);
        }
    }

    async render(res, user = null, pagePath = null, editorMode = false, pageNumber = 0) {
        // Check if the user owns the site when in editor mode
        await this.read();
        if (editorMode && !this.#owners.includes(user.id)) {
            return res.status(401).render('error', { errorCode: 401, errorMessage: 'Unauthorized' });
        } else if(!this.#isPublished && !editorMode) {
            return res.status(404).render('error', { errorCode: 403, errorMessage: 'Not published' });
        } else {
            // Reads pages of the site if the site has any, display error message otherwise
            if (this.#pages.length > 0) {
                const pages = [];
                for (const pageNumber of this.#pages) {
                    const page = new Page(pageNumber);
                    await page.read();
                    pages.push(page);
                }
                pages.sort((a, b) => a.position - b.position);

                let page = pages[0];

                // Change paths of the pages for editor mode
                if (editorMode) {
                    pages.forEach(page => {
                        page.number = pages.indexOf(page);
                        page.path = `/sites/${this.#id}/${page.number}/preview`;
                    });
                    page = pages[pageNumber];
                } else {
                    if (pagePath) {
                        page = pages.find(page => page.path === pagePath);
                        if (!page) {
                            return res.status(404).render('error', { errorCode: 404, errorMessage: 'Page not found' });
                        }
                    }
                }

                return res.render(`themes/${this.#theme}`, { site: this, pages, page });
            } else {
                return res.status(404).render('error', { errorCode: 404, errorMessage: 'No pages found' });
            }
        }
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

    set owners(owners) { this.#owners = owners; }
    set tier(tier) { this.#tier = tier; }
    set language(language) { this.#language = language; }
    set title(title) { this.#title = title; }
    set description(description) { this.#description = description; }
    set theme(theme) { this.#theme = theme; }
    set subdomain(subdomain) { this.#subdomain = subdomain; }
    set isPublished(isPublished) { this.#isPublished = isPublished; }
    set customDomain(customDomain) { this.#customDomain = customDomain; }
    set pages(pages) { this.#pages = pages; }
}

module.exports = Site;
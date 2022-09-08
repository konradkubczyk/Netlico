const PageData = require("../schema/page");

class Page {
    #id;
    #site;
    #title;
    #position;
    #content;
    #path;

    /**
     * Creates a new page in database
     */
    static async create(siteId) {
        const pageData = new PageData();
        pageData.site = siteId;
        await pageData.save();
        return new Page(pageData._id);
    }

    constructor(pageId) {
        this.#id = pageId;
    }

    /**
     * Loads all properties of the object from database based on its id
     */
    async read() {
        const pageData = await PageData.findById(this.#id);
        this.#site = pageData.site;
        this.#title = pageData.title;
        this.#position = pageData.position;
        this.#content = pageData.content;
        this.#path = pageData.path;
    }

    /**
     * Updates the page's data in database
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
        const pageData = await PageData.findById(this.#id);
        pageData[property] = value;
        await pageData.save();
    }

    /**
     * Deletes the page from database
     */
    async delete() {
        await PageData.findByIdAndDelete(this.#id);
    }

    get id() {
        return this.#id;
    }

    get site() {
        if (typeof this.#site !== 'undefined') {
            return this.#site;
        }
        return (async () => {
            await this.read();
            return this.#site;
        })();
    }

    get title() {
        if (typeof this.#title !== 'undefined') {
            return this.#title;
        }
        return (async () => {
            await this.read();
            return this.#title;
        })();
    }

    get position() {
        if (typeof this.#position !== 'undefined') {
            return this.#position;
        }
        return (async () => {
            await this.read();
            return this.#position;
        })();
    }

    get content() {
        if (typeof this.#content !== 'undefined') {
            return this.#content;
        }
        return (async () => {
            await this.read();
            return this.#content;
        })();
    }

    get path() {
        if (typeof this.#path !== 'undefined') {
            return this.#path;
        }
        return (async () => {
            await this.read();
            return this.#path;
        })();
    }

    set site(site) {
        this.#site = site;
        return (async () => {
            await this.updateProperty('site', site);
        });
    }

    set title(title) {
        this.#title = title;
        return (async () => {
            await this.updateProperty('title', title);
        });
    }

    set position(position) {
        this.#position = position;
        return (async () => {
            await this.updateProperty('position', position);
        });
    }

    set content(content) {
        this.#content = content;
        return (async () => {
            await this.updateProperty('content', content);
        });
    }

    set path(path) {
        this.#path = path;
        return (async () => {
            await this.updateProperty('path', path);
        });
    }
}

module.exports = Page;
const PageData = require("../schema/page");

class Page {
    #id;
    #website;
    #title;
    #position;
    #content;
    #path;

    constructor(pageId) {
        this.#id = pageId;
    }

    /**
     * Loads all properties of the object from database based on its id
     */
    async loadData() {
        const pageData = await PageData.findById(this.id);
        this.#website = pageData.website;
        this.#title = pageData.title;
        this.#position = pageData.position;
        this.#content = pageData.content;
        this.#path = pageData.path;
    }

    get id() {
        return this.#id;
    }

    get website() {
        if (typeof this.#website !== 'undefined') {
            return this.#website;
        }
        return (async () => {
            await this.loadData();
            return this.#website;
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

    get position() {
        if (typeof this.#position !== 'undefined') {
            return this.#position;
        }
        return (async () => {
            await this.loadData();
            return this.#position;
        })();
    }

    get content() {
        if (typeof this.#content !== 'undefined') {
            return this.#content;
        }
        return (async () => {
            await this.loadData();
            return this.#content;
        })();
    }

    get path() {
        if (typeof this.#path !== 'undefined') {
            return this.#path;
        }
        return (async () => {
            await this.loadData();
            return this.#path;
        })();
    }
}

module.exports = Page;
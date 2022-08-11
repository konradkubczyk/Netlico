class Website {
    #id;
    #domain;
    #title;
    #pages;
    #homePageId;

    constructor(id = null, domain = null, title = null, pages = [], homePageId = null) {
        this.#id = id;
        this.#domain = domain;
        this.#title = title;
        this.#pages = pages;
        this.#homePageId = homePageId;
    }
}

export default Website;
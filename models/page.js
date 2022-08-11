class Page {
    #id;
    #name;
    #content;
    #actions;

    constructor(id=null, name=null, content=null, actions=[]) {
        this.#id = id;
        this.#name = name;
        this.#content = content;
        this.#actions = actions;
    }
}

module.exports = Page;
"use strict";

const mcache = require("memory-cache");

module.exports = {
    /**
     * Clears the cache of a specified url root.
     * @param urlRoot sets the url root. For example "/publications".
     */
    clearCache: (urlRoot) => {
        for (let i = 0; i < mcache.keys().length; i++) {
            if (mcache.keys()[i].startsWith(urlRoot)) {
                mcache.del(mcache.keys()[i]);
                i--;
            }
        }
    }
}

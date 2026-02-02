const cookies = {
    getOptions: (name) => {
        return {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7
        };
    },
    setCookie: (res, name, value, options = {}) => {
        res.cookie(name, value, { ...cookies.getOptions(name), ...options });
    },
    clearCookie: (res, name, options = {}) => {
        res.clearCookie(name, { ...cookies.getOptions(name), ...options });
    },
    get: (req, name) => {
        return req.cookies[name];
    }
}

module.exports = cookies;
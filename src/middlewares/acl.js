const acl = role => (req, res, next) => {
    if (req?.session?.user?.role?.toLowerCase?.() === role.toLowerCase()) {
        return next()
    }

    return res.status(403).json({valid: false})
}

module.exports = acl
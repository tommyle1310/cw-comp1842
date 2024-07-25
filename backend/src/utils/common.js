const cr = {
    ok: {
        EC: 0,
        EM: 'Success'
    },
    notfound: {
        EC: 1,
        EM: 'Not found record.'
    },
    missing: {
        EC: 2,
        EM: 'Missing value.'
    },
    invalid: {
        EC: 2,
        EM: 'Invalid parameter.'
    },
    duplicated: {
        EC: 3,
        EM: 'Duplicated record.'
    },
    unknown: {
        EC: 4,
        EM: 'Internal server error.'
    },
}
module.exports = { cr }
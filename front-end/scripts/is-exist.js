function isExist(entery) {
    if (typeof entery != 'undefined' && entery != 0 && entery != '' && entery != null && entery != false) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = isExist;


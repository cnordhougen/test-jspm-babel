
module.exports = CurrentUserInit;

CurrentUserInit.$inject = ['currentUser', 'identityService'];

function CurrentUserInit(currentUser, identityService) {

    // This triggers the currentUser.whoami() method once
    // the identityService is ready to be used. This is
    // what automatically populates currentUser.details
    // on application bootstrap.

    identityService.whenReady().finally(currentUser.whoami);

}

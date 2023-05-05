// Use the describe function to group related tests together
describe('tricks', function () {

    // Use the it function to define an individual test case
    it('navigation', function () {

        // Use the cy.viewport command to set the browser viewport size
        cy.viewport(1920, 1080)

        // Use the cy.visit command to navigate to a web page
        cy.visit('http://localhost:3000/');

        // Use the cy.get command to select an element by its ID and interact with it
        cy.get('#amplify-id-0').type('test2');
        cy.get('#amplify-id-2').type('mSGT2pM7GTp3PB5!');
        cy.get('.amplify-button--primary').click();

        // Use the cy.get command to select a form element and submit it
        //cy.get('form').submit();


        // cy.get('.navbar > .mobileNavBar > #mainWrap > .navItem:nth-child(2) > .linkText').click()
        // cy.wait(1000)
        // cy.get('.edit-icon').click()
        //cy.get('.mainContent > .cards:nth-child(3) > .cardLinks:nth-child(1) > .amplify-card > h2').click()

        // cy.get('label:contains("Desc")')  // select the label element
        //     .invoke('attr', 'for')  // get the value of the "for" attribute
        //     .then((inputId) => {
        //         cy.get(`#${inputId}`)  // select the input element with the corresponding ID
        //             .type('this is a test')  // enter a value in the input
        //     })


        // Use the cy.get command to select an element by its class and interact with it
        //cy.get('.signOut').click();

    })
})
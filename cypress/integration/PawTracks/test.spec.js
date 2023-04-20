// Use the describe function to group related tests together
describe('status_check', function () {
    
    // Use the it function to define an individual test case
    it('login_logout', function () {
        
        // Use the cy.viewport command to set the browser viewport size
        cy.viewport(1920, 929)
        
        // Use the cy.visit command to navigate to a web page
        cy.visit('http://localhost:3000/');
        
        // Use the cy.get command to select an element by its ID and interact with it
        cy.get('#amplify-id-0').type('user');
        cy.get('#amplify-id-2').type('Testuser1!');
        cy.get('.amplify-button--primary').click();
        
        // Use the cy.get command to select a form element and submit it
        cy.get('form').submit();
        
        // Use the cy.get command to select an element by its class and interact with it
        cy.get('.signOut').click();
    })
})